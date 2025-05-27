import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DBConnection } from 'src/shared/db/prisma';
import { HotSpotFilter } from '../dto/hot-spot.filter';
import { ListHotSpotDto } from '../dto/list-hot-spot.dto';
import { HotSpotGJSONFilter } from '../dto/hot-spot-gjson.filter';
import { ConfigService } from '@nestjs/config';
import { LAYER_DOWNLOAD_URI, PUBLIC_LAYERS_FOLDER } from '@shared/constants';
import { existsSync, mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import * as AdmZip from 'adm-zip';
import { unlink } from 'node:fs/promises';

@Injectable()
export class HotSpotService {
	private logger = new Logger(HotSpotService.name);

	constructor(
		private readonly db: DBConnection,
		private readonly configService: ConfigService,
	) {}

	async findAll(filter: HotSpotFilter) {
		this.logger.log(`Finding all hotSpots controls, with filter: ${filter}`);

		const { where, pagination } = filter;

		const [items, total] = await this.db.$transaction([
			this.db.hotSpot.findMany({
				where,
				...pagination,
			}),
			this.db.hotSpot.count({ where }),
		]);

		return new ListHotSpotDto(items, total);
	}

	async getLastUpdate() {
		this.logger.log(`Getting last update of hotSpots controls`);

		const lastUpdate = await this.db.hotSpot.findFirst({
			select: { date: true },
			orderBy: { date: 'desc' },
		});

		return lastUpdate?.date ?? null;
	}

	async getAllHotSpotsGJSON({ startDate, endDate }: HotSpotGJSONFilter) {
		const q = `select get_hot_spots('${startDate}', '${endDate}', ARRAY['modis_c6_1', 'suomi_viirs_c2', 'j1_viirs_c2', 'j2_viirs_c2']);`;

		const res = await this.db.$queryRawUnsafe(q);

		return res?.[0]?.get_hot_spots ?? {};
	}

	async exportShpToZip({ startDate, endDate }: HotSpotGJSONFilter) {
		try {
			const host = this.configService.get('database.host');
			const port = this.configService.get('database.port');
			const username = this.configService.get('database.username');
			const password = this.configService.get('database.password');
			const database = this.configService.get('database.name');

			const basePath = PUBLIC_LAYERS_FOLDER;

			if (!existsSync(basePath)) mkdirSync(basePath, { recursive: true });

			const fileName = `focos_${startDate}_${endDate}`;

			const filePaths = ['.shp', '.dbf', '.shx', '.prj', '.qpj', '.cpg'].map(
				(extension) => `${basePath}/${fileName}${extension}`,
			);

			const getSqlSelect = `select select_shp_hot_spots('${startDate}', '${endDate}', ARRAY['modis_c6_1', 'suomi_viirs_c2', 'j1_viirs_c2', 'j2_viirs_c2']);`;
			const sqlSelect = (await this.db.$queryRawUnsafe(getSqlSelect)) as any;
			const selectQuery = sqlSelect?.[0]?.select_shp_hot_spots ?? '';

			if (selectQuery === '') {
				this.logger.error('No data found for the given date range');
				throw new BadRequestException('No data found for the given date range');
			}

			const comando = `pgsql2shp -f ${
				filePaths[0]
			}  -h ${host} -p ${port} -u ${username} -P ${password} ${database} "${sqlSelect[0].select_shp_hot_spots}"`;

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
}
