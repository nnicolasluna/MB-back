import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as AdmZip from 'adm-zip';
import { DBConnection } from '@shared/db/prisma';
import { mkdirSync, unlinkSync } from 'fs';
import { MapNotificationService } from '@modules/notifications/services/map-notification.service';
import { UPLOAD_FOLDER } from '@shared/constants';
import { GeoserverService } from '@shared/services/geoserver/services/geoserver.service';
import { PROCESS_MONITORING_MAP_TOKEN } from '../lib/constants';
import { ShapefileProcessorService } from '@shared/services/map-processor/shapefile-processor.service';
import { cartographicSchema, MapUploadStatus } from '@modules/map-data/lib/constants';
import { MonitoringType, ProcessMapJobDto } from '../dto/upload-map-job.dto';

@Processor(PROCESS_MONITORING_MAP_TOKEN)
export class UploadMapConsumer {
	private logger = new Logger(UploadMapConsumer.name);

	constructor(
		private readonly db: DBConnection,
		private readonly notificationService: MapNotificationService,
		private readonly geoserverService: GeoserverService,
		private readonly shapefileProcessorService: ShapefileProcessorService,
	) {}

	@Process()
	async uploadMap(job: Job<ProcessMapJobDto>) {
		const { table, path, name, columns, type, skipProcess } = job.data;

		try {
			this.notificationService.emitDecompression(table);
			const shpPath = await this.decompressMap(path, name);
			this.logger.debug(`Decompressed map ${name} to ${shpPath}`);

			this.notificationService.emitProcessing(table);
			const res = (await this.shapefileProcessorService.process({
				path: shpPath,
				table,
				schema: cartographicSchema,
			})) as { success: boolean; table: string };

			if (!res.success) throw new Error('Error processing map');

			if (!skipProcess) {
				const test = await this.db.$queryRawUnsafe(`select process_monitoring_table('${table}', '${columns}');`);
				this.logger.debug(`Test response: ${JSON.stringify(test)}`);
			}

			const mapData = await this.updateBoundingBox(table, type);
			this.logger.debug(`Map data response: ${JSON.stringify(mapData)}`);
			const publishRes = await this.publishLayer(mapData.layer);
			this.logger.debug(`Publish layer response: ${JSON.stringify(publishRes)}`);

			// const generatePreview = await this.generatePreview(mapData);
			// this.logger.debug(`Generate preview response: ${JSON.stringify(generatePreview)}`);
		} catch (error) {
			this.notificationService.emitFailed(table);
			this.dropTableIfExists(table);
			this.logger.error(`Error processing map ${name}: ${error.message}`);
			return { success: false, error: error.message };
		}

		this.logger.verbose(`Job ${job.id} completed successfully`);

		this.notificationService.emitComplete(table);
		return { progress: MapUploadStatus.COMPLETED };
	}

	async decompressMap(path: string, name: string) {
		this.logger.verbose(`Decompressing map ${name}`);
		return new Promise<string>((resolve) => {
			setTimeout(() => {
				const zip = new AdmZip(path);
				const entries = zip.getEntries();

				const files = entries.filter(
					(e) => e.entryName.endsWith('.shp') || e.entryName.endsWith('.dbf') || e.entryName.endsWith('.shx'),
				);

				if (files.length !== 3) throw new Error('Invalid map file');

				const basePath = `${UPLOAD_FOLDER}/${entries[0].entryName.slice(0, -4)}`;

				mkdirSync(basePath, { recursive: true });

				zip.extractAllTo(basePath, true);

				const pathShp = entries.find((e) => e.entryName.endsWith('.shp'));
				unlinkSync(path);
				resolve(basePath + '/' + pathShp.entryName);
			}, 1000);
		});
	}

	async updateBoundingBox(table: string, type: MonitoringType) {
		this.logger.verbose(`Updating bounding box for map ${table}`);
		const bbox: [{ min_x: number; min_y: number; max_y: number; max_x: number }] = await this.db.$queryRawUnsafe(
			`SELECT ST_XMin(ST_Extent(geom)) AS min_x, ST_YMin(ST_Extent(geom)) AS min_y, ST_XMax(ST_Extent(geom)) AS max_x, ST_YMax(ST_Extent(geom)) AS max_y FROM ${cartographicSchema}.${table};`,
		);

		this.logger.debug(`bbox: ${JSON.stringify(bbox)}`);

		if (!bbox[0]) throw new Error('Error getting bounding box');

		let tableService: any = this.db.monitoringWater;
		if (type === MonitoringType.RISK) tableService = this.db.monitoringFire;
		if (type === MonitoringType.BURN) tableService = this.db.monitoringBurn;
		if (type === MonitoringType.SOIL) tableService = this.db.monitoringSoilDegradation;
		if (type === MonitoringType.SOIL_ALERTS) tableService = this.db.soilAlert;
		if (type === MonitoringType.USE) tableService = this.db.monitoringUseLand;

		const map = await tableService.findFirst({ where: { layer: table }, select: { id: true } });

		return tableService.update({ where: { id: map.id }, data: { bbox: JSON.stringify(bbox[0]) } });
	}

	async publishLayer(layer: string) {
		this.logger.verbose(`Publishing layer ${layer}`);
		try {
			return this.geoserverService.publishLayer(layer);
		} catch (error) {
			this.logger.warn(`Error publishing layer ${layer}: ${error.message}`);
			if (error.message.includes('already exists')) return;
			throw error;
		}
	}

	// async generatePreview(mapData: ProcessMapJobDto) {
	// 	const { table } = mapData;
	// 	const { min_x, min_y, max_x, max_y } = JSON.parse(bbox);
	// 	this.logger.verbose(`Generating preview for layer ${layer}`);
	// 	return this.geoserverService.savePreview(layer, uuid, min_x, min_y, max_x, max_y);
	// }

	async dropTableIfExists(table: string) {
		const query = `DROP TABLE IF EXISTS ${cartographicSchema}.${table};`;
		await this.db.$executeRawUnsafe(query);
	}

	async checkTableExists(table: string) {
		const res = await this.db.$queryRawUnsafe(`SELECT EXISTS (
              SELECT 1
              FROM information_schema.tables
              WHERE table_name = '${table}'
              ) AS table_existence`);

		return res?.[0]?.table_existence;
	}
}
