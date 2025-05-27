import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBConnection } from '@shared/db/prisma';
import { spawn } from 'node:child_process';
import { rmSync } from 'node:fs';

export interface ProcessorOptions {
	table: string;
	path: string;
	schema: string;
}

@Injectable()
export class ShapefileProcessorService {
	private readonly logger = new Logger(ShapefileProcessorService.name);

	constructor(
		private readonly config: ConfigService,
		private readonly db: DBConnection,
	) {}

	async process(options: ProcessorOptions) {
		this.logger.log('Processing shapefile: ' + JSON.stringify(options));

		const { path, table, schema } = options;

		const basePath = path.split('/').slice(0, -1).join('/');

		await this.dropTableIfExists(table, schema);

		return new Promise((resolve, reject) => {
			const command = `shp2pgsql -s 4326 -t 2D -I ${path} ${schema}.${table} | psql -d ${this.config.get('database.url')}`;

			this.logger.debug(`command: ${command}`);

			const process = spawn('bash', ['-c', command]);
			let hasError = false;

			process.stdout.on('data', (data) => {
				if (data.toString().toLowerCase().includes('error')) hasError = true;
			});

			process.on('close', async (code) => {
				if (code !== 0 || hasError) {
					await this.dropTableIfExists(table, schema);
					rmSync(basePath, { recursive: true });
					return reject();
				}
				resolve({ success: true, table });
			});

			process.on('error', async (error) => {
				await this.dropTableIfExists(table, schema);
				rmSync(basePath, { recursive: true });
				reject(error);
			});
		});
	}

	private async dropTableIfExists(table: string, schema: string) {
		const query = `DROP TABLE IF EXISTS ${schema}.${table};`;
		await this.db.$executeRawUnsafe(query);
	}
}
