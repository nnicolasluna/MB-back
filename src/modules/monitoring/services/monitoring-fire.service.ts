import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { FormMonitoringFireDto } from '../dto/monitoring-fire/form-monitoring-fire.dto';
import { generateCleanName, SelectQueryBuilder } from '@shared/utils';
import { MonitoringFireFilter } from '../dto/monitoring-fire/monitoring-fire.filter';
import { ListMonitoringFireDto } from '../dto/monitoring-fire/list-monitoring-fire.dto';
import { AuditDeleteFields, AuditFields } from '@shared/interfaces';
import { ConfigService } from '@nestjs/config';
import { spawn } from 'child_process';
import * as AdmZip from 'adm-zip';
import { unlink } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { DBConnection } from '@shared/db/prisma';
import { GeoserverService } from '@shared/services/geoserver/services/geoserver.service';
import { LAYER_DOWNLOAD_URI, PUBLIC_LAYERS_FOLDER } from '@shared/constants';
import { PROCESS_MONITORING_MAP_TOKEN } from '../lib/constants';
import { MonitoringFireEntity } from '../entities/monitoring-fire.entity';
import { cartographicSchema } from '@modules/map-data/lib/constants';
import { MonitoringType, ProcessMapJobDto } from '../dto/upload-map-job.dto';
import { StadisticsFilter } from '../dto/stadistics.filter';

const DEFAULT_MONITORING_WATER_STYLE = 'default_monitoring_risk';

@Injectable()
export class MonitoringFireService {
	private logger = new Logger(MonitoringFireService.name);

	constructor(
		@InjectQueue(PROCESS_MONITORING_MAP_TOKEN) private readonly queue: Queue,
		private readonly geoserverService: GeoserverService,
		private readonly db: DBConnection,
		private readonly configService: ConfigService,
	) {}

	async create(dto: FormMonitoringFireDto) {
		const existMapData = await this.db.monitoringFire.findFirst({
			where: {
				name: dto.name,
				coverageDate: dto.coverageDate,
				state: true,
				deletedDate: null,
				idDeletedBy: null,
			},
		});

		if (existMapData) {
			this.logger.error('Map data already exists');
			throw new BadRequestException();
		}

		const { zipFile, ...updateData } = dto;
		const data = new MonitoringFireEntity(updateData);

		data.layer = generateCleanName(dto.name, 'risk_');
		data.styleName = DEFAULT_MONITORING_WATER_STYLE;
		data.coverageState = 'Activo';

		this.logger.log(`Creating map ${data.name}, layer ${data.layer}`);

		const createdData = await this.db.monitoringFire.create({ data });

		if (zipFile) await this.uploadMap(zipFile, data.layer);

		return new MonitoringFireEntity(createdData);
	}

	async findAll(filter: MonitoringFireFilter) {
		this.logger.log(`Finding all risk monitoring, with filter: ${filter}`);

		const { where, pagination } = filter;

		const [data, total] = await this.db.$transaction([
			this.db.monitoringFire.findMany({
				where,
				...pagination,
				include: { createdBy: { select: { name: true, firstSurname: true } } },
			}),
			this.db.monitoringFire.count({ where }),
		]);

		return new ListMonitoringFireDto(data, total);
	}

	async findOne(id: number) {
		this.logger.log(`Finding map with id: ${id}`);
		const data = await this.db.monitoringFire.findFirst({ where: { id } });

		if (!data) throw new NotFoundException();

		return new MonitoringFireEntity(data);
	}

	async update(id: number, dto: FormMonitoringFireDto) {
		this.logger.log(`Updating map with id: ${id}`);

		const { zipFile, ...updateData } = dto;

		const res = await this.db.monitoringFire.update({
			where: { id },
			data: updateData,
		});

		if (zipFile) await this.uploadMap(zipFile, res.layer);

		return new MonitoringFireEntity(res);
	}

	async remove(id: number, body: AuditDeleteFields) {
		const data = await this.db.monitoringFire.findUnique({ where: { id } });

		if (!data) throw new NotFoundException();

		await this.geoserverService.deleteLayer(data.layer);

		await this.db.monitoringFire.update({
			where: { id },
			data: {
				state: false,
				...body,
			},
		});

		return true;
	}

	async uploadMap(file: Express.Multer.File, table: string = '') {
		this.logger.log('Uploading map');
		const job = await this.queue.add(
			{
				path: file.path,
				name: file.filename,
				table,
				columns: 't."label",t.leyenda,t.fecha',
				type: MonitoringType.RISK,
			} as ProcessMapJobDto,
			{ removeOnComplete: true },
		);
		return job.id;
	}

	async updateStatus(code: string, dto: AuditFields & { status: string }) {
		this.logger.log(`Updating status map with id: ${code}`);

		const data = await this.db.monitoringFire.findUnique({ where: { uuid: code } });

		if (!data) throw new NotFoundException();

		const { status, ...updateData } = dto;

		await this.db.monitoringFire.update({
			where: { uuid: code },
			data: {
				coverageState: status,
				...updateData,
			},
		});

		return true;
	}

	async exportShpToZip(uuid: string) {
		try {
			const map = await this.db.monitoringFire.findUnique({
				where: { uuid },
				select: { layer: true },
			});

			if (!map) throw new NotFoundException();

			const schemaTable = await this.db.$queryRawUnsafe(
				`SELECT * FROM information_schema.columns WHERE table_schema = '${cartographicSchema}' AND table_name = '${map.layer}';`,
			);

			const columnsExists = Array.isArray(schemaTable)
				? schemaTable.map((e) => {
						return e.column_name;
					})
				: [];

			const host = this.configService.get('database.host');
			const port = this.configService.get('database.port');
			const username = this.configService.get('database.username');
			const password = this.configService.get('database.password');
			const database = this.configService.get('database.name');

			const basePath = PUBLIC_LAYERS_FOLDER;

			if (!existsSync(basePath)) mkdirSync(basePath, { recursive: true });

			const fileName = `descargar_${map.layer}`;

			const filePaths = ['.shp', '.dbf', '.shx', '.prj', '.qpj', '.cpg'].map(
				(extension) => `${basePath}/${fileName}${extension}`,
			);

			const comando = `pgsql2shp -f ${
				filePaths[0]
			}  -h ${host} -p ${port} -u ${username} -P ${password} ${database} "SELECT ${columnsExists.join(
				',',
			)} FROM ${cartographicSchema}.${map.layer}"`;

			this.logger.debug(`EXPORT Command: ${comando}`);

			const shp2pgsql = spawn('bash', ['-c', comando]);

			await new Promise((resolve, reject) => {
				shp2pgsql.on('close', (code) => {
					if (code === 0) {
						resolve(code);
					} else {
						reject(new Error(`child process exited with code ${code}, message: ${code}`));
					}
				});
				shp2pgsql.on('error', (error) => {
					reject(new Error(`child process error: ${error}`));
				});
			});

			const zipFilePath = `${basePath}/${fileName}.zip`;
			const zip = new AdmZip();
			for (const filePath of filePaths) {
				if (existsSync(filePath)) {
					zip.addLocalFile(filePath);
					await unlink(filePath);
				}
			}
			zip.writeZip(zipFilePath);
			this.logger.log(`Exported ZIP to: ${zipFilePath}`);
			return `${LAYER_DOWNLOAD_URI}/${fileName}.zip`;
		} catch (error) {
			this.logger.error('Error exporting shp: ' + error.message);
			throw new BadRequestException();
		}
	}

	// TODO: add functions for monitoring water
	// async findLayerData(dto: GetLayerData) {
	// 	this.logger.log(`Finding map data with filter: ${JSON.stringify(dto)}`);
	//
	// 	if (dto.ids.length === 0) return [];
	//
	// 	const maps = await this.db.mapData.findMany({
	// 		where: { id: { in: dto.ids.map((v) => +v) } },
	// 		select: { layer: true, name: true, typeGeom: true },
	// 	});
	//
	// 	const data: { name: string; data: any }[] = [];
	//
	// 	let radius = 0.03;
	//
	// 	if (dto.zoom) radius = 0.008 / Math.pow(2, dto.zoom - 11);
	//
	// 	for (const map of maps) {
	// 		let columns: any[] = await this.db.$queryRawUnsafe(
	// 			`SELECT * FROM information_schema.columns WHERE table_schema = '${cartographicSchema}' AND table_name = '${map.layer}';`,
	// 		);
	//
	// 		columns = columns.filter((v) => !['geom', 'gid'].includes(v.column_name)).map((v) => `"${v.column_name}"`);
	//
	// 		let layerData: any[] = [];
	//
	// 		switch (map.typeGeom) {
	// 			case 'Polygon':
	// 				layerData = (await this.db.$queryRawUnsafe(
	// 					`SELECT ${columns.join(',')} FROM ${cartographicSchema}.${map.layer} WHERE ST_Intersects(${cartographicSchema}.${map.layer}.geom, ST_SetSRID(ST_MakePoint(${dto.lng},${dto.lat}), 4326)) LIMIT 1`,
	// 				)) as any;
	// 				break;
	// 			default:
	// 				layerData = (await this.db.$queryRawUnsafe(
	// 					`SELECT ${columns.join(',')} FROM ${cartographicSchema}.${map.layer} WHERE ST_Intersects(${cartographicSchema}.${map.layer}.geom, ST_Buffer(ST_SetSRID(ST_MakePoint(${dto.lng},${dto.lat}), 4326), ${radius})) LIMIT 1`,
	// 				)) as any;
	// 				break;
	// 		}
	//
	// 		if (layerData.length === 0) continue;
	//
	// 		for (const layer of layerData) {
	// 			for (const key in layer) {
	// 				const value = layer[key];
	// 				if (value instanceof Decimal) layer[key] = value.toNumber();
	// 			}
	// 		}
	//
	// 		data.push({
	// 			name: map.name,
	// 			data: layerData,
	// 		});
	// 	}
	//
	// 	return data;
	// }

	async getStadistics(q: StadisticsFilter) {
		this.logger.log(`Getting stadistics with filter: ${JSON.stringify(q)}`);

		let monitoring: any = await this.db.monitoringFire.findFirst({
			where: {
				uuid: q.uuid,
				coverageState: 'Activo',
				state: true,
				NOT: {
					bbox: null,
				},
			},
			select: { bbox: true, layer: true, coverageDate: true, name: true, uuid: true, id: true },
			orderBy: { coverageDate: 'desc' },
		});

		if (!monitoring) {
			monitoring = await this.db.monitoringFire.findFirst({
				where: {
					coverageState: 'Activo',
					state: true,
					NOT: {
						bbox: null,
					},
				},
				select: { bbox: true, layer: true, coverageDate: true, name: true, uuid: true, id: true },
				orderBy: { coverageDate: 'desc' },
			});
		}

		monitoring['data'] = await this.getStadisticsFromLayer(monitoring.layer);

		return monitoring;
	}

	async getStadisticsFromLayer(layer: string): Promise<any[]> {
		const qBuilder = new SelectQueryBuilder(layer, cartographicSchema);

		qBuilder.setColumns([
			{ field: 'fecha' },
			{ field: 'leyenda' },
			{ field: '"label"' },
			{ field: 'prov' },
			{ field: 'mun' },
			{ field: 'aps' },
			{ field: 'tcos' },
			{ field: 'ramsar' },
			{ field: 'sup' },
			// { field: 'ST_AsGeoJSON(geom)', as: 'geom' },
		]);

		const coverageData = (await this.db.$queryRawUnsafe(qBuilder.build())) as any[];

		return coverageData;
	}
}
