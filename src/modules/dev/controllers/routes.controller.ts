import { HotSpotState } from '@modules/hot_spots/entities/hot-spot.entity';
import {
	HOST_SPOTS_LINKS,
	HOT_SPOT_SCHEMA,
	INTERSECTIONS_CONFIG,
} from '@modules/hot_spots/services/task-hot-spot.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { STORAGE_FOLDER } from '@shared/constants';
import { DBConnection } from '@shared/db/prisma';
import { IsPublic } from '@shared/decorators';
import { getColorsFromSLD } from '@shared/services/geoserver/lib/parse-sld';
import { GeoserverStyleService } from '@shared/services/geoserver/services/geoserver-styles.service';
import { IntersectionService } from '@shared/services/map-intersector/intersection-service.service';
import { ShapefileProcessorService } from '@shared/services/map-processor/shapefile-processor.service';
import { streamToString } from '@shared/utils';

import * as AdmZip from 'adm-zip';
import * as dayjs from 'dayjs';
import { mkdirSync } from 'node:fs';

@Controller('routes')
@ApiTags('Development Tools')
export class RoutesController {
	constructor(
		private readonly _geoserverStyleService: GeoserverStyleService,
		private readonly _mapProcessorService: ShapefileProcessorService,
		private readonly _mapIntersectionService: IntersectionService,
		private readonly db: DBConnection,
	) {}

	@IsPublic()
	@Get('hello')
	@ApiOperation({ summary: 'Hello World' })
	@ApiQuery({ name: 'name', required: true })
	async hello(@Query('name') name: string) {
		return `Hello ${name}`;
	}

	@IsPublic()
	@Get('raw-style')
	@ApiOperation({ summary: 'Raw Style' })
	@ApiQuery({ name: 'style', required: true })
	async rawStyle(@Query('style') style: string) {
		const res = await this._geoserverStyleService.getStyleRaw(style, 'sld');
		const xmlSLD = await streamToString(res.body);

		return await getColorsFromSLD(xmlSLD);
	}

	async downloadAndProcess() {
		for (const { link, name } of HOST_SPOTS_LINKS) {
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

	@IsPublic()
	@Get('hot-spots')
	async getHotSpots(
		@Query('start') startDate: string,
		@Query('end') endDate: string,
		@Query('satellite') satellite: string = 'MODIS_C6_1',
	) {
		return await this.listHotSpots(dayjs(startDate).toDate(), dayjs(endDate).toDate(), satellite);
	}

	@IsPublic()
	@Get('download-hot-spot')
	async downloadHotSpot() {
		this.downloadAndProcess();
	}

	async listHotSpots(startDate: Date, endDate: Date, satellite: string) {
		const q = `select get_hot_spots('${dayjs(startDate).format('YYYY-MM-DD')}', '${dayjs(endDate).format('YYYY-MM-DD')}', '${satellite.toLowerCase().trim()}');`;

		const res = await this.db.$queryRawUnsafe(q);

		return res?.[0]?.get_hot_spots ?? {};
	}
}
