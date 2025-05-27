import { Injectable, Logger } from '@nestjs/common';
import { BaseGeoserverService } from './base-geoserver.service';
import { ConfigService } from '@nestjs/config';
import { DBConnection } from '@shared/db/prisma';
import { GeoserverLinkBuilder } from '../lib/geoserver-link.build';

@Injectable()
export class GeoserverStyleService extends BaseGeoserverService {
	override logger = new Logger(GeoserverStyleService.name);

	constructor(
		readonly configService: ConfigService,
		readonly db: DBConnection,
	) {
		super(configService, db);
	}

	async listSlds() {
		const url = new GeoserverLinkBuilder().setRest().setWorkspaces().setWorkspace().setStyles().build();
		try {
			const res = await this.sendQuery(url);
			return res.json().then((res) => res.data.styles.styles.map((style: any) => style.name));
		} catch (error) {
			this.logger.error(`Error listing slds: ${error.message}`);
			throw error;
		}
	}

	async getStyleRaw(name: string, type: string) {
		const url = new GeoserverLinkBuilder()
			.setRest()
			.setWorkspaces()
			.setWorkspace()
			.setStyles()
			.setStyle(`${name}`)
			.build();

		if (type === 'sld')
			return this.sendQuery(url, 'GET', null, { Accept: 'application/vnd.ogc.se+xml,application/vnd.ogc.sld+xml' });
		return this.sendQuery(url);
	}

	async createStyleWithRaw(name: string, payload: string) {
		const url = new GeoserverLinkBuilder()
			.setRest()
			.setWorkspaces()
			.setWorkspace()
			.setStyles()
			.setParams('name', name)
			.build();

		const contentType = /StyledLayerDescriptor.*version=\"1\.0\.0/gm.test(payload)
			? 'application/vnd.ogc.sld+xml'
			: 'application/vnd.ogc.se+xml';

		return this.sendQuery(url, 'POST', payload, {
			'Content-Type': contentType,
		});
	}

	async updateStyleRaw(name: string, payload: string) {
		const url = new GeoserverLinkBuilder().setRest().setWorkspaces().setWorkspace().setStyles().setStyle(name).build();

		return this.sendQuery(url, 'PUT', payload, {
			'Content-Type': 'application/vnd.ogc.se+xml',
		});
	}

	public deleteSld(style: string) {
		const url = new GeoserverLinkBuilder().setRest().setWorkspaces().setWorkspace().setStyles().setStyle(style).build();
		return this.sendQuery(url, 'DELETE');
	}
}
