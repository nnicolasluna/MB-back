import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DBConnection } from '@shared/db/prisma';
import { HotSpotState } from '../entities/hot-spot.entity';

import * as AdmZip from 'adm-zip';
import * as dayjs from 'dayjs';
import { mkdirSync } from 'node:fs';
import { ShapefileProcessorService } from '@shared/services/map-processor/shapefile-processor.service';
import { IntersectionConfig, IntersectionService } from '@shared/services/map-intersector/intersection-service.service';
import { cartographicSchema } from '@modules/map-data/lib/constants';
import { STORAGE_FOLDER } from '@shared/constants';

export const HOST_SPOTS_LINKS = [
	{
		link: 'https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/shapes/zips/MODIS_C6_1_South_America_24h.zip',
		name: 'MODIS_C6_1',
	},
	{
		link: 'https://firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/shapes/zips/SUOMI_VIIRS_C2_South_America_24h.zip',
		name: 'SUOMI_VIIRS_C2',
	},
	{
		link: 'https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/shapes/zips/J1_VIIRS_C2_South_America_24h.zip',
		name: 'J1_VIIRS_C2',
	},
	{
		link: 'https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-21-viirs-c2/shapes/zips/J2_VIIRS_C2_South_America_24h.zip',
		name: 'J2_VIIRS_C2',
	},
];

export const HOT_SPOT_SCHEMA = 'hot_spots';

export const INTERSECTIONS_CONFIG: IntersectionConfig[] = [
	{
		fromTable: 'beni_municipios',
		fromSchema: cartographicSchema,
		alias: 'bm',
		mapping: {
			mun: 'bm.mun',
			prov: 'bm.prov',
		},
		conditions: 'ST_Intersects(p.geom, bm.geom)',
		removeNulls: true,
		columns: {
			mun: 'varchar(50)',
			prov: 'varchar(50)',
		},
	},
	{
		fromTable: 'aps_moxos',
		fromSchema: cartographicSchema,
		alias: 'a',
		mapping: {
			aps: 'a.nom_aps1',
		},
		conditions: 'ST_Intersects(p.geom, a.geom)',
		removeNulls: false,
		columns: {
			aps: 'varchar(200)',
		},
	},
	{
		fromTable: 'tcos_moxos',
		fromSchema: cartographicSchema,
		alias: 't',
		mapping: {
			tcos: 't.nom_tcos',
		},
		conditions: 'ST_Intersects(p.geom, t.geom)',
		removeNulls: false,
		columns: {
			tcos: 'varchar(200)',
		},
	},
	{
		fromTable: 'sitios_ramsar',
		fromSchema: cartographicSchema,
		alias: 't',
		mapping: {
			ramsar: 't.nom_ramsar',
		},
		conditions: 'ST_Intersects(p.geom, t.geom)',
		removeNulls: false,
		columns: {
			ramsar: 'varchar(200)',
		},
	},
	{
		fromTable: 'cuerpos_agua',
		fromSchema: cartographicSchema,
		alias: 'ca',
		mapping: {},
		conditions: 'ST_Intersects(p.geom, ca.geom)',
		removeNulls: true,
		type: 'delete',
	},
];

@Injectable()
export class TaskHotSpotService {
	private logger = new Logger(TaskHotSpotService.name);

	constructor(
		private readonly db: DBConnection,
		private readonly _mapProcessorService: ShapefileProcessorService,
		private readonly _mapIntersectionService: IntersectionService,
	) {}

	async downloadAndProcess() {
		for (const { link, name } of HOST_SPOTS_LINKS) {
			this.logger.verbose(`Processing ${link}`);

			const table = `${name}_${dayjs(new Date()).format('DD_MM_YYYY')}`;

			const hotSpot = await this.db.hotSpot.create({
				data: {
					url: link,
					details: '',
					date: new Date(),
					state: HotSpotState.Processing,
					table,
				},
			});

			try {
				const path = await this.downloadAndExtract(link);

				await this._mapProcessorService.process({
					path,
					table,
					schema: HOT_SPOT_SCHEMA,
				});

				await this._mapIntersectionService.intersect(table, INTERSECTIONS_CONFIG, HOT_SPOT_SCHEMA);

				await this.db.hotSpot.update({
					where: { id: hotSpot.id },
					data: {
						state: HotSpotState.Completed,
						details: 'Completado exitosamente',
					},
				});
			} catch (error) {
				this.logger.error(`Error generating hotspot ${link}: ${error.message}`);
				await this.db.hotSpot.update({
					where: { id: hotSpot.id },
					data: {
						state: HotSpotState.Failed,
						details: 'Error generando los focos de calor: ' + error.message,
					},
				});
				continue;
			}
		}
	}

	//@Cron(CronExpression.EVERY_HOUR, { name: 'DownloadHotSpots', waitForCompletion: true, timeZone: 'America/La_Paz' })
	async downloadHotSpots() {
		this.downloadAndProcess();
	}

	async downloadAndExtract(url: string) {
		const response = await fetch(url);
		const buffer = Buffer.from(await response.arrayBuffer());

		const zip = new AdmZip(buffer);
		const entries = zip.getEntries();

		const files = entries.filter((e) => ['.shp', '.shx', '.dbf'].some((ext) => e.entryName.endsWith(ext)));

		if (files.length !== 3) throw new Error('Shapefile incompleto');

		const basePath = `${STORAGE_FOLDER}/${files[0].entryName.replace(/\.shp$/, '')}`;
		mkdirSync(basePath, { recursive: true });
		zip.extractAllTo(basePath, true);

		const shpEntry = files.find((e) => e.entryName.endsWith('.shp'));
		return `${basePath}/${shpEntry.entryName}`;
	}
}
