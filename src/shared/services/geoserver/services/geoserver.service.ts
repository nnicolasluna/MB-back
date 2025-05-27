import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBConnection } from '@shared/db/prisma';
import { GeoserverLinkBuilder } from '../lib/geoserver-link.build';
import { WMSLinkBuilder } from '../lib/wms-link.builder';
import { Readable } from 'stream';
import { PUBLIC_FOLDER } from '@shared/constants';
import { createWriteStream, existsSync, unlinkSync } from 'fs';
import { finished } from 'stream/promises';
import { BaseGeoserverService } from './base-geoserver.service';

@Injectable()
export class GeoserverService extends BaseGeoserverService {
	override logger = new Logger(GeoserverService.name);

	constructor(
		readonly configService: ConfigService,
		readonly db: DBConnection,
	) {
		super(configService, db);
	}

	async publishLayer(layer: string) {
		const geoserverLink = new GeoserverLinkBuilder().getPublishLayerLink();
		this.logger.debug(`Publishing layer ${layer} to geoserver: ${geoserverLink}`);

		return this.sendQuery(geoserverLink, 'POST', `<featureType><name>${layer}</name></featureType>`, {
			'Content-Type': 'text/xml',
		});
	}

	async deleteLayer(layer: string) {
		const geoServerLink = new GeoserverLinkBuilder();
		try {
			await this.sendQuery(geoServerLink.getDeleteLayerLink(layer), 'DELETE');

			return await this.db.$executeRawUnsafe(`DROP TABLE IF EXISTS ${this.schema}.${layer}`);
		} catch (error) {
			this.logger.error(`Error deleting layer ${layer}: ${error.message}`);
			throw error;
		}
	}

	async savePreview(
		layer: string,
		fileName: string,
		minx: number,
		miny: number,
		maxx: number,
		maxy: number,
		style?: string,
	) {
		const urlBuilder = new WMSLinkBuilder().getURLImage(layer, minx, miny, maxx, maxy, style);
		this.logger.debug(`Url Preview: ${urlBuilder}`);

		const res = await this.sendQuery(urlBuilder);

		const filePath = `${PUBLIC_FOLDER}/${fileName}.png`;

		if (existsSync(filePath)) unlinkSync(filePath);

		const fileStream = createWriteStream(filePath, { flags: 'wx' });

		return finished(Readable.fromWeb(res.body as any).pipe(fileStream));
	}

	async updateMapSld(layer: string, style: string) {
		const assignStyleUrl = `${this.geoserverUrl}/rest/layers/${this.workspace}:${layer}`;
		const styleBody = `<layer><defaultStyle><name>${style}</name></defaultStyle></layer>`;
		return this.sendQuery(assignStyleUrl, 'PUT', styleBody, {
			'Content-Type': 'application/xml',
		});
	}

	public deleteSld(style: string) {
		const url = `${this.geoserverUrl}/rest/workspaces/${this.workspace}/styles/${style}`;
		return this.sendQuery(url, 'DELETE');
	}

	public async getBbox(layer: string) {
		const url = `${this.geoserverUrl}/rest/workspaces/${this.workspace}/datastores/${this.workspace}/featuretypes/${layer}.json`;
		try {
			let res = await this.sendQuery(url, 'GET');
			res = await res.json();
			return res['featureType']?.['latLonBoundingBox'];
		} catch (error) {
			this.logger.error(`Error getting bbox for layer ${layer}: ${error.message}`);
			return null;
		}
	}
}
