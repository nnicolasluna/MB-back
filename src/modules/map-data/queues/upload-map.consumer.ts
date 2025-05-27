import { Logger } from '@nestjs/common';
import { cartographicSchema, MapUploadStatus, UPLOAD_MAP_QUEUE_TOKEN } from '../lib/constants';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as AdmZip from 'adm-zip';
import { DBConnection } from '@shared/db/prisma';
import { ConfigService } from '@nestjs/config';
import { spawn } from 'child_process';
import { rmSync, mkdirSync, unlinkSync } from 'fs';
import { MapNotificationService } from '@modules/notifications/services/map-notification.service';
import { UPLOAD_FOLDER } from '@shared/constants';
import { GeoserverService } from '@shared/services/geoserver/services/geoserver.service';
import { MapDataEntity } from '../entities/map-data.entity';
import { StyleEntity } from '../entities/style.entity';

@Processor(UPLOAD_MAP_QUEUE_TOKEN)
export class UploadMapConsumer {
	private logger = new Logger(UploadMapConsumer.name);

	constructor(
		private readonly db: DBConnection,
		private readonly configService: ConfigService,
		private readonly notificationService: MapNotificationService,
		private readonly geoserverService: GeoserverService,
	) {}

	@Process()
	async uploadMap(job: Job<{ id: string; path: string; name: string }>) {
		const { id, path, name } = job.data;

		try {
			this.notificationService.emitDecompression(id);
			const shpPath = await this.decompressMap(path, name);
			this.notificationService.emitProcessing(id);
			const res = await this.processMap(id, shpPath);
			if (!res.success) throw new Error('Error processing map');
			const mapData = await this.updateBoundingBox(id, res.table);
			const publishRes = await this.publishLayer(mapData.layer);
			this.logger.debug(`Publish layer response: ${JSON.stringify(publishRes)}`);
			const generatePreview = await this.generatePreview(mapData);
			this.logger.debug(`Generate preview response: ${JSON.stringify(generatePreview)}`);
		} catch (error) {
			this.notificationService.emitFailed(id);
			this.logger.error(`Error processing map ${name}: ${error.message}`);
			return { success: false, error: error.message };
		}

		this.logger.verbose(`Job ${job.id} completed successfully`);

		this.notificationService.emitComplete(id);
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

	async processMap(id: string, path: string): Promise<{ success: boolean; table: string }> {
		const basePath = path.split('/').slice(0, -1).join('/');
		const mapData = await this.db.mapData.findFirst({ where: { uuid: id } });
		this.logger.verbose(`Processing map ${mapData.name}`);

		const table = mapData.layer;
		await this.dropTableIfExists(table);

		return new Promise(async (resolve, reject) => {
			setTimeout(async () => {
				try {
					const command = `shp2pgsql -s 4326 -t 2D -I ${path} ${cartographicSchema}.${table} | psql -d ${this.configService.get('database.url')}`;
					this.logger.verbose(`command: ${command}`);

					const process = spawn('bash', ['-c', command]);

					let hasError = false;

					process.stdout.on('data', async (data: any) => {
						if (data.includes('ERROR') || data.includes('error') || data.includes('Unable to convert')) hasError = true;
					});

					process.on('close', async (code: number) => {
						if (code !== 0 || hasError || !(await this.checkTableExists(table))) {
							this.logger.error(`Error processing map ${mapData.name}: ${code}`);
							await this.dropTableIfExists(table);
							rmSync(basePath, { recursive: true });
							reject({ success: false, table: mapData.layer });
						}

						resolve({ success: true, table: mapData.layer });
					});

					process.on('error', async (error: any) => {
						this.logger.error(`Error processing map ${mapData.name}: ${error.message}`);
						await this.dropTableIfExists(table);
						rmSync(basePath, { recursive: true });
						reject({ success: false, error, table: mapData.layer });
					});
				} catch (error) {
					this.logger.error(`Error processing map ${mapData.name}: ${error.message}`);
					await this.dropTableIfExists(table);
					rmSync(basePath, { recursive: true });
					reject({ success: false, error, table: mapData.layer });
				}
			}, 1000);
		});
	}

	async updateBoundingBox(uuid: string, table: string) {
		this.logger.verbose(`Updating bounding box for map ${uuid}`);
		const bbox: [{ min_x: number; min_y: number; max_y: number; max_x: number }] = await this.db.$queryRawUnsafe(
			`SELECT ST_XMin(ST_Extent(geom)) AS min_x, ST_YMin(ST_Extent(geom)) AS min_y, ST_XMax(ST_Extent(geom)) AS max_x, ST_YMax(ST_Extent(geom)) AS max_y FROM ${cartographicSchema}.${table};`,
		);

		this.logger.debug(`bbox: ${JSON.stringify(bbox)}`);

		if (!bbox[0]) throw new Error('Error getting bounding box');

		return this.db.mapData.update({
			where: { uuid },
			data: { bbox: JSON.stringify(bbox[0]) },
			include: { style: true },
		});
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

	async generatePreview(mapData: MapDataEntity & { style: StyleEntity }) {
		const { bbox, uuid, layer } = mapData;
		const { min_x, min_y, max_x, max_y } = JSON.parse(bbox);

		this.logger.verbose(`Generating preview for layer ${layer}`);

		let layerName = layer,
			style = undefined;

		if (mapData.typeGeom == 'Raster') {
			layerName = `a_${mapData.nameImage}`;
			if (mapData.style?.name) style = `wcs:${mapData.style.name}`;
		}

		return this.geoserverService.savePreview(layerName, uuid, min_x, min_y, max_x, max_y, style);
	}

	async dropTableIfExists(table: string) {
		const query = `DROP TABLE IF EXISTS ${cartographicSchema}.${table};`;
		await this.db.$executeRawUnsafe(query);
	}

	async checkTableExists(table: string) {
		const res = await this.db.$queryRawUnsafe(`SELECT EXISTS (
              SELECT 1
              FROM information_schema.tables
              WHERE table_name =  '${table}'
              ) AS table_existence`);

		return res?.[0]?.table_existence;
	}
}
