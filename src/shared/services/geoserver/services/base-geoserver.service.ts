import { cartographicSchema } from '@modules/map-data/lib/constants';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBConnection } from '@shared/db/prisma';

export abstract class BaseGeoserverService {
	abstract logger: Logger;

	protected geoserverUrl = this.configService.get('geoserver.url');
	protected workspace = this.configService.get('geoserver.workspace');
	protected username = this.configService.get('geoserver.username');
	protected password = this.configService.get('geoserver.password');
	protected schema = cartographicSchema;

	constructor(
		protected readonly configService: ConfigService,
		protected readonly db: DBConnection,
	) {}

	protected async sendQuery(url: string, method: string = 'GET', body?: BodyInit, headers: HeadersInit = {}) {
		return fetch(url, {
			method,
			headers: {
				Authorization: `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`,
				...headers,
			},
			body,
		});
	}
}
