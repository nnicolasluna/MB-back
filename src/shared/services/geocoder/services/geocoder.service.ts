import { cartographicSchema } from '@modules/map-data/lib/constants';
import { Injectable, Logger } from '@nestjs/common';
import { DBConnection } from '@shared/db/prisma';

@Injectable()
export class GeocoderService {
	private logger = new Logger(GeocoderService.name);

	constructor(private readonly db: DBConnection) {
		this.logger.log('Geocoder service started');
	}

	public async regionLimits() {
		let q = `SELECT json_build_object( 'type', 'FeatureCollection', 'features', json_agg( json_build_object( 'type', 'Feature', 'geometry', ST_AsGeoJSON(geom)::json, 'properties', json_build_object( 'id', gid, 'prov', prov, 'mun', mun)))) AS geojson FROM ${cartographicSchema}.beni_municipios bm;`;
		let res = await this.db.$queryRawUnsafe(q);
		const limits = res?.[0]?.geojson ?? {};

		q = `SELECT gid as id, nom_aps1 as aps, ST_AsGeoJson(ST_Envelope(geom)) as bbox FROM cartographic.aps_moxos bm;`;
		res = await this.db.$queryRawUnsafe(q);
		const aps = res;

		q = `SELECT gid as id, nom_tcos as tcos, ST_AsGeoJson(ST_Envelope(geom)) as bbox FROM cartographic.tcos_moxos bm;`;
		res = await this.db.$queryRawUnsafe(q);
		const tcos = res;

		q = `SELECT gid as id, nom_ramsar as ramsar, ST_AsGeoJson(ST_Envelope(geom)) as bbox FROM cartographic.sitios_ramsar bm;`;
		res = await this.db.$queryRawUnsafe(q);
		const ramsar = res;

		return { limits, aps, tcos, ramsar };
	}
}
