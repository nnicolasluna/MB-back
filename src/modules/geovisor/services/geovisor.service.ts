import { Injectable } from '@nestjs/common';
import { DBConnection } from '@shared/db/prisma';
import { GeoserverService } from '@shared/services/geoserver/services/geoserver.service';
import { cartographicSchema } from '@modules/map-data/lib/constants';
import { Decimal } from '@prisma/client/runtime/library';
import { GetLayerData } from '../dto/get-layer-data.dto';

@Injectable()
export class GeovisorService {
	constructor(
		private db: DBConnection,
		private geoserverService: GeoserverService,
	) {}

	public async getArcheologicalSites() {
		const sites = await this.db.archeologicalSites.findMany({});
		for (const site of sites) {
			const bbox = await this.geoserverService.getBbox(site.layer);
			site['bbox'] = bbox;
		}
		return sites;
	}

	async findLayerData(dto: GetLayerData) {
		const data: { name: string; data: any }[] = [];

		const cb = (layerData: any) => {
			data.push(layerData);
		};

		if ((dto.mapData?.length ?? 0) > 0) {
			const maps = await this.db.mapData.findMany({
				where: { id: { in: dto.mapData.map((v) => +v) } },
				select: { layer: true, name: true, typeGeom: true },
			});

			await this.getLayerData(maps, cb, dto);
		}

		if ((dto.archeologicalSite?.length ?? 0) > 0) {
			const archSites = await this.db.archeologicalSites.findMany({
				where: { id: { in: dto.archeologicalSite.map((v) => +v) } },
				select: { layer: true, name: true },
			});

			await this.getLayerData(archSites, cb, dto, false);
		}

		if ((dto.risk?.length ?? 0) > 0) {
			const risks = await this.db.monitoringFire.findMany({
				where: { id: { in: dto.risk.map((v) => +v) } },
				select: { layer: true, name: true },
			});

			await this.getLayerData(risks, cb, dto);
		}

		if ((dto.water?.length ?? 0) > 0) {
			const waters = await this.db.monitoringWater.findMany({
				where: { id: { in: dto.water.map((v) => +v) } },
				select: { layer: true, name: true },
			});

			await this.getLayerData(waters, cb, dto);
		}

		if ((dto.soil?.length ?? 0) > 0) {
			const soils = await this.db.monitoringSoilDegradation.findMany({
				where: { id: { in: dto.soil.map((v) => +v) } },
				select: { layer: true, name: true },
			});

			await this.getLayerData(soils, cb, dto);
		}

		if ((dto.soilAlert?.length ?? 0) > 0) {
			const alerts = await this.db.soilAlert.findMany({
				where: { id: { in: dto.soilAlert.map((v) => +v) } },
				select: { layer: true, name: true },
			});

			await this.getLayerData(alerts, cb, dto);
		}

		if ((dto.burn?.length ?? 0) > 0) {
			const burns = await this.db.monitoringBurn.findMany({
				where: { id: { in: dto.burn.map((v) => +v) } },
				select: { layer: true, name: true },
			});

			await this.getLayerData(burns, cb, dto);
		}

		if ((dto.use?.length ?? 0) > 0) {
			const uses = await this.db.monitoringUseLand.findMany({
				where: { id: { in: dto.use.map((v) => +v) } },
				select: { layer: true, name: true },
			});

			await this.getLayerData(uses, cb, dto);
		}

		return data;
	}

	private async getLayerData(
		layers: any[],
		cb: (data: { name: string; data: any }) => void,
		dto: GetLayerData,
		isPolygon: boolean = true,
	) {
		let radius = 0.03;

		if (dto.zoom) radius = 0.008 / Math.pow(2, dto.zoom - 11);

		for (const map of layers) {
			let columns: any[] = await this.db.$queryRawUnsafe(
				`SELECT * FROM information_schema.columns WHERE table_schema = '${cartographicSchema}' AND table_name = '${map.layer}';`,
			);

			columns = columns.filter((v) => !['geom', 'gid'].includes(v.column_name)).map((v) => `"${v.column_name}"`);

			let layerData: any[] = [];

			if (map.typeGeom) {
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
			} else {
				if (isPolygon)
					layerData = (await this.db.$queryRawUnsafe(
						`SELECT ${columns.join(',')} FROM ${cartographicSchema}.${map.layer} WHERE ST_Intersects(${cartographicSchema}.${map.layer}.geom, ST_SetSRID(ST_MakePoint(${dto.lng},${dto.lat}), 4326)) LIMIT 1`,
					)) as any;
				else
					layerData = (await this.db.$queryRawUnsafe(
						`SELECT ${columns.join(',')} FROM ${cartographicSchema}.${map.layer} WHERE ST_Intersects(${cartographicSchema}.${map.layer}.geom, ST_Buffer(ST_SetSRID(ST_MakePoint(${dto.lng},${dto.lat}), 4326), ${radius})) LIMIT 1`,
					)) as any;
			}

			if (layerData.length === 0) continue;

			for (const layer of layerData) {
				for (const key in layer) {
					const value = layer[key];
					if (value instanceof Decimal) layer[key] = value.toNumber();
				}
			}

			cb({
				name: map.name,
				data: layerData,
			});
		}
	}

	public async getFeatureBbox(prop: string, value: string) {
		let query = '';
		switch (prop) {
			case 'aps':
				query = `SELECT ST_AsGeoJSON(ST_Union(geom)) as geojson FROM ${cartographicSchema}.aps_moxos WHERE nom_aps1 = '${value}';`;
				break;
			case 'mun':
				query = `SELECT ST_AsGeoJSON(ST_Union(geom)) as geojson FROM ${cartographicSchema}.beni_municipios WHERE mun = '${value}';`;
				break;
			case 'prov':
				query = `SELECT ST_AsGeoJSON(ST_Union(geom)) as geojson FROM ${cartographicSchema}.beni_municipios WHERE prov = '${value}';`;
				break;
			case 'tcos':
				query = `SELECT ST_AsGeoJSON(ST_Union(geom)) as geojson FROM ${cartographicSchema}.tcos_moxos WHERE nom_tcos = '${value}';`;
				break;
			case 'ramsar':
				query = `SELECT ST_AsGeoJSON(ST_Union(geom)) as geojson FROM ${cartographicSchema}.sitios_ramsar WHERE nom_ramsar = '${value}';`;
				break;
			default:
				throw new Error('Invalid property name. Expecte "aps", "mun", "prov", "tcos" or "ramsar"');
		}

		const res = await this.db.$queryRawUnsafe(query);

		return res?.[0]?.geojson ?? null;
	}

	public async getLastHotSpot() {
		const lastUpdate = await this.db.hotSpot.findFirst({
			select: { date: true },
			orderBy: { date: 'desc' },
		});

		return lastUpdate?.date ?? null;
	}
}
