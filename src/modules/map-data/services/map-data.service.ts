import { PUBLIC_FOLDER, UPLOAD_FOLDER } from '@shared/constants';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { cartographicSchema, UPLOAD_MAP_QUEUE_TOKEN } from '../lib/constants';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { FormMapDataDto } from '../dto/map-data/form-map-data.dto';
import { MapDataEntity } from '../entities/map-data.entity';
import { generateCleanName } from '@shared/utils';
import { MapDataFilter } from '../dto/map-data/map-data.filter';
import { ListMapDataDto } from '../dto/map-data/list-map-data.dto';
import { AuditDeleteFields } from '@shared/interfaces';
import { ConfigService } from '@nestjs/config';
import { spawn } from 'child_process';
import * as AdmZip from 'adm-zip';
import { unlink } from 'fs/promises';
import { unlinkSync, createWriteStream, createReadStream } from 'fs';
import { existsSync, mkdirSync } from 'fs';
import { DBConnection } from '@shared/db/prisma';
import { GeoserverService } from '@shared/services/geoserver/services/geoserver.service';
import { MapDataResponse } from '../dto/map-data/map-data-response.dto';
import { LAYER_DOWNLOAD_URI, PUBLIC_LAYERS_FOLDER } from '@shared/constants';
import { Prisma } from '@prisma/client';
import { GetLayerData } from '../dto/map-data/get-map-data.dto';
import { Decimal } from '@prisma/client/runtime/library';
const axios = require('axios');
const FormData = require('form-data');

@Injectable()
export class MapDataService {
	private logger = new Logger(MapDataService.name);

	constructor(
		@InjectQueue(UPLOAD_MAP_QUEUE_TOKEN) private readonly uploadMapQueue: Queue,
		private readonly geoserverService: GeoserverService,
		private readonly db: DBConnection,
		private readonly configService: ConfigService,
	) {}

	async create(dto: FormMapDataDto) {
		const existMapData = await this.db.mapData.findFirst({
			where: {
				name: dto.name,
				state: true,
				deletedDate: null,
				idDeletedBy: null,
			},
		});

		if (existMapData) {
			this.logger.error('Map data already exists');
			throw new BadRequestException();
		}

		const data = new MapDataEntity(dto);

		data.layer = generateCleanName(dto.name, 'layer_');

		this.logger.log(`Creating map ${data.name}, layer ${data.layer}`);

		const { idStyle, ...rest } = data as any;

		const createData: Prisma.MapDataCreateInput = {
			...rest,
		};

		if (dto.idStyle) {
			createData.style = {
				connect: { id: idStyle },
			};
		}

		return new MapDataEntity(await this.db.mapData.create({ data: createData }));
	}

	async findAll(filter: MapDataFilter) {
		this.logger.log(`Finding all maps, with filter: ${filter}`);

		const { where, pagination } = filter;

		const [data, total] = await this.db.$transaction([
			this.db.mapData.findMany({
				where,
				...pagination,
				include: { style: true },
			}),
			this.db.mapData.count({ where }),
		]);

		return new ListMapDataDto(data, total);
	}

	async findOne(id: number) {
		this.logger.log(`Finding map with id: ${id}`);
		const data = await this.db.mapData.findFirst({ where: { id }, include: { style: true } });

		if (!data) throw new NotFoundException();

		return new MapDataResponse(data);
	}

	async update(id: number, dto: FormMapDataDto) {
		this.logger.log(`Updating map with id: ${id}`);
		const bfMapData = await this.db.mapData.findFirst({
			where: { id },
			include: { style: true },
		});

		if (!bfMapData) throw new NotFoundException();

		const { idStyle, ...rest } = dto;

		const updateData: Prisma.MapDataUpdateInput = {
			...rest,
		};

		if (idStyle) {
			updateData.style = { connect: { id: idStyle } };
		}

		const res = await this.db.mapData.update({
			where: { id },
			data: updateData,
		});

		if (dto.idStyle) {
			const style = await this.db.style.findFirst({ where: { id: dto.idStyle } });
			let minx: number, miny: number, maxx: number, maxy: number;

			if (res.bbox) {
				const { min_x, min_y, max_x, max_y } = JSON.parse(res.bbox);
				minx = min_x;
				miny = min_y;
				maxx = max_x;
				maxy = max_y;
			} else if (res.bboxImage) {
				const bbox = res.bboxImage as any;
				minx = bbox.minx;
				miny = bbox.miny;
				maxx = bbox.maxx;
				maxy = bbox.maxy;
			}

			let layerName = res.layer,
				styleName = style?.name;

			if (updateData.typeGeom == 'Raster') {
				layerName = `a_${res.nameImage}`;
				if (style?.name) styleName = `wcs:${style?.name}`;
			}

			await this.geoserverService.savePreview(layerName, res.uuid, minx, miny, maxx, maxy, styleName);
			this.logger.verbose(`Update preview form map ${res.name}`);
		}

		return new MapDataEntity(res);
	}

	async remove(id: number, body: AuditDeleteFields) {
		const data = await this.db.mapData.findUnique({ where: { id } });

		if (!data) throw new NotFoundException();

		await this.geoserverService.deleteLayer(data.layer);

		await this.db.mapData.update({
			where: { id },
			data: {
				state: false,
				...body,
				style: { disconnect: true },
			},
		});

		return true;
	}

	async uploadMap(id: string, file: Express.Multer.File) {
		this.logger.log('Uploading map');
		const job = await this.uploadMapQueue.add(
			{
				id,
				path: file.path,
				name: file.filename,
			},
			{ removeOnComplete: true },
		);
		return job.id;
	}

	async exportShpToZip(uuid: string) {
		try {
			const map = await this.db.mapData.findUnique({
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

	async findLayerData(dto: GetLayerData) {
		this.logger.log(`Finding map data with filter: ${JSON.stringify(dto)}`);

		if (dto.ids.length === 0) return [];

		const maps = await this.db.mapData.findMany({
			where: { id: { in: dto.ids.map((v) => +v) } },
			select: { layer: true, name: true, typeGeom: true },
		});

		const data: { name: string; data: any }[] = [];

		let radius = 0.03;

		if (dto.zoom) radius = 0.008 / Math.pow(2, dto.zoom - 11);

		for (const map of maps) {
			let columns: any[] = await this.db.$queryRawUnsafe(
				`SELECT * FROM information_schema.columns WHERE table_schema = '${cartographicSchema}' AND table_name = '${map.layer}';`,
			);

			columns = columns.filter((v) => !['geom', 'gid'].includes(v.column_name)).map((v) => `"${v.column_name}"`);

			let layerData: any[] = [];

			switch (map.typeGeom) {
				case 'Polygon':
					layerData = (await this.db.$queryRawUnsafe(
						`SELECT ${columns.join(',')} FROM ${cartographicSchema}.${map.layer} WHERE ST_Intersects(${cartographicSchema}.${map.layer}.geom, ST_SetSRID(ST_MakePoint(${dto.lng},${dto.lat}), 4326)) LIMIT 1`,
					)) as any;
					break;
				default:
					layerData = (await this.db.$queryRawUnsafe(
						`SELECT ${columns.join(',')} FROM ${cartographicSchema}.${map.layer} WHERE ST_Intersects(${cartographicSchema}.${map.layer}.geom, ST_Buffer(ST_SetSRID(ST_MakePoint(${dto.lng},${dto.lat}), 4326), ${radius})) LIMIT 1`,
					)) as any;
					break;
			}

			if (layerData.length === 0) continue;

			for (const layer of layerData) {
				for (const key in layer) {
					const value = layer[key];
					if (value instanceof Decimal) layer[key] = value.toNumber();
				}
			}

			data.push({
				name: map.name,
				data: layerData,
			});
		}

		return data;
	}

	private geoserverUrl = process.env.GEOSERVER_URL;
	private geoserverWorkspace = process.env.GEOSERVER_WORKSPACE;
	private geoserverUsername = process.env.GEOSERVER_USERNAME;
	private geoserverPassword = process.env.GEOSERVER_PASSWORD;

	async createEmptyImport() {
		const geoserverUrl = this.geoserverUrl;
		const workspace = this.geoserverWorkspace;
		const username = this.geoserverUsername;
		const password = this.geoserverPassword;
		const url = `${geoserverUrl}/rest/imports`;
		try {
			const importData = {
				import: {
					targetWorkspace: {
						workspace: {
							name: workspace,
						},
					},
				},
			};
			const response = await axios.post(url, importData, {
				auth: {
					username,
					password,
				},
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const importId = response.data.import.id;
			return importId;
		} catch (error) {
			console.error('Error al crear la importación en GeoServer:', error.message);
			throw error;
		}
	}

	// Agregar el archivo GeoTIFF como tarea en la importación
	async addImportTask(importId: number, filePath: string, name: string) {
		const geoserverUrl = this.geoserverUrl;
		const username = this.geoserverUsername;
		const password = this.geoserverPassword;
		const url = `${geoserverUrl}/rest/imports`;
		const formData = new FormData();
		formData.append('name', name);
		formData.append('filedata', createReadStream(filePath));
		const headers = {
			...formData.getHeaders(),
			Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
		};
		try {
			const response = await axios.post(`${url}/${importId}/tasks`, formData, {
				auth: {
					username,
					password,
				},
				headers,
			});
			this.logger.debug('Archivo GeoTIFF agregado a la importación en GeoServer:', true);
			return response.data;
		} catch (error) {
			console.error('Error al agregar el archivo GeoTIFF a la importación en GeoServer:', error.message);
			throw error;
		}
	}

	async addTransform(importId: number): Promise<void> {
		const geoserverUrl = this.geoserverUrl;
		const workspace = this.geoserverWorkspace;
		const username = this.geoserverUsername;
		const password = this.geoserverPassword;
		const url = `${geoserverUrl}/rest/imports`;
		try {
			const responseWarp = await axios.post(
				`${url}/${importId}/tasks/0/transforms`,
				{
					type: 'GdalWarpTransform',
					options: ['-t_srs', 'EPSG:4326'],
				},
				{
					auth: {
						username,
						password,
					},
				},
			);
			this.logger.debug('GdalWarpTransform', true);
			const responseGtx = await axios.post(
				`${url}/${importId}/tasks/0/transforms`,
				{
					type: 'GdalTranslateTransform',
					options: ['-co', 'TILED=YES', '-co', 'BLOCKXSIZE=512', '-co', 'BLOCKYSIZE=512'],
				},
				{
					auth: {
						username,
						password,
					},
				},
			);
			this.logger.debug('GdalTranslateTransform', true);
			const responseGad = await axios.post(
				`${url}/${importId}/tasks/0/transforms`,
				{
					type: 'GdalAddoTransform',
					options: ['-r', 'average'],
					levels: [2, 4, 8, 16],
				},
				{
					auth: {
						username,
						password,
					},
				},
			);
			this.logger.debug('GdalAddoTransform', true);
		} catch (error) {
			throw new Error(`Error adding warp transform: ${error.message}`);
		}
	}

	// Ejecutar la importación
	async executeImport(importId): Promise<void> {
		const geoserverUrl = this.geoserverUrl;
		const workspace = this.geoserverWorkspace;
		const username = this.geoserverUsername;
		const password = this.geoserverPassword;
		const url = `${geoserverUrl}/rest/imports`;
		try {
			const response = await axios.post(
				`${url}/${importId}`,
				{},
				{
					auth: {
						username,
						password,
					},
				},
			);
			this.logger.log('Importación ejecutada en GeoServer:', true);
		} catch (error) {
			console.error('Error al ejecutar la importación en GeoServer:', error.message);
			throw error;
		}
	}

	async getData(url) {
		const username = this.geoserverUsername;
		const password = this.geoserverPassword;
		this.logger.log('getData url: ', url);
		try {
			const response = await axios.get(url, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
				},
			});
			return response.data;
		} catch (error) {
			console.error('Error al obetner los datos', error.message);
			throw error;
		}
	}

	async saveImg(name: string, uuid: string) {
		const geoserverUrl = this.geoserverUrl;
		const workspace = this.geoserverWorkspace;
		const username = this.geoserverUsername;
		const password = this.geoserverPassword;
		const baseUrl = `${geoserverUrl}/rest/workspaces/${workspace}/coveragestores/${name}/coverages.json`;

		const coverages = await axios
			.get(baseUrl, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
				},
			})
			.then((response) => response.data.coverages.coverage);

		const coverage = coverages[0];

		const url = coverage.href;
		const response = await axios
			.get(url, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
				},
			})
			.then((response) => response.data);
		const minx = response.coverage.latLonBoundingBox.minx;
		const miny = response.coverage.latLonBoundingBox.miny;
		const maxx = response.coverage.latLonBoundingBox.maxx;
		const maxy = response.coverage.latLonBoundingBox.maxy;
		const urlImage = `${geoserverUrl}/wms?service=WMS&version=1.1.0&request=GetMap&layers=${workspace}:a_${name}&bbox=${minx},${miny},${maxx},${maxy}&width=200&height=200&format=image/png&transparent=true`;
		return new Promise((resolve, reject) => {
			axios({
				method: 'GET',
				url: urlImage,
				headers: {
					Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
				},
				responseType: 'stream',
			})
				.then((response) => {
					if (!existsSync(`${PUBLIC_FOLDER}`)) {
						mkdirSync(`${PUBLIC_FOLDER}`);
					}
					const filePath = `${PUBLIC_FOLDER}/${uuid}.png`;
					this.logger.log(`filePath: ${filePath}`);
					const writer = createWriteStream(filePath);
					response.data.pipe(writer);
					resolve({
						success: true,
						message: `Imagen guardada.`,
					});
				})
				.catch((err) => {
					reject({
						success: false,
						message: err,
					});
				});
		});
	}

	async importGeoTiff(id, fileName) {
		try {
			const importId = await this.createEmptyImport();
			const filePath = `${UPLOAD_FOLDER}/` + fileName;
			const dataImportTask = await this.addImportTask(importId, filePath, fileName.split('.')[0]);
			const dataTarget = await this.getData(dataImportTask.task.target.href);
			const dataLayer = await this.getData(dataImportTask.task.layer.href);
			await this.addTransform(importId);
			await this.executeImport(importId);
			const satelliteImage = await this.db.mapData.update({
				where: {
					id,
				},
				data: {
					importId: importId,
					nameImage: fileName.split('.')[0],
					urlImage: dataTarget.coverageStore.url,
					bboxImage: dataLayer.layer.bbox,
					srsImage: dataLayer.layer.srs,
				},
			});
			await this.saveImg(satelliteImage.nameImage, satelliteImage.uuid);
			unlinkSync(filePath);
			return { success: true, message: 'Proceso completado' };
		} catch (error) {
			this.logger.error(error);
			return { success: false, message: 'Error' };
		}
	}

	async removeSatellite(id: number, body: any) {
		const data = await this.db.mapData.findUnique({
			where: { id },
		});

		try {
			const geoserverUrl = process.env.GEOSERVER_URL;
			const workspace = process.env.GEOSERVER_WORKSPACE;
			const username = process.env.GEOSERVER_USERNAME;
			const password = process.env.GEOSERVER_PASSWORD;
			const url = `${geoserverUrl}/rest/workspaces/${workspace}/layers/a_${data.nameImage.replace(/-/g, '_')}`;
			await axios
				.delete(url, {
					auth: {
						username: username,
						password: password,
					},
				})
				.then((response) => response.data);
			const res = await axios
				.delete(`${geoserverUrl}/rest/workspaces/${workspace}/coveragestores/${data.nameImage}.json?recurse=true`, {
					auth: {
						username: username,
						password: password,
					},
				})
				.then((response) => {
					return response.data;
				});
		} catch (error) {
			this.logger.error('La capa raster no existe en el geoserver o el geoserver no esta activo');
		}

		await this.db.mapData.update({
			where: { id },
			data: {
				state: false,
				...body,
			},
		});

		return true;
	}
}
