import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DBConnection } from '@shared/db/prisma';
import { ListStyleDto } from '../dto/style/list-style.dto';
import { StyleFilter } from '../dto/style/style.filter';
import { FormStyleDto } from '../dto/style/form-style.dto';
import { GeoserverStyleService } from '@shared/services/geoserver/services/geoserver-styles.service';
import { StyleEntity } from '../entities/style.entity';
import { AuditDeleteFields, ExistsQuery } from '@shared/interfaces';
import { StyleResponse } from '../dto/style/style-response.dto';
import { MapData, Style } from '@prisma/client';
import { GeoserverService } from '@shared/services/geoserver/services/geoserver.service';

@Injectable()
export class StyleService {
	private logger = new Logger(StyleService.name);

	constructor(
		private readonly db: DBConnection,
		private readonly geoService: GeoserverService,
		private readonly geoserverService: GeoserverStyleService,
	) {}

	private async updateMapsPreviews(style: Style & { maps: MapData[] }, prevMaps?: MapData[]) {
		this.logger.debug(`Updating maps previews for style ${style.name}`);
		let maps = style.maps ?? [];

		if (prevMaps) maps = maps.filter((map) => !prevMaps.find((prev) => prev.id === map.id));

		maps.forEach(async (map) => {
			this.logger.debug(`Updating map ${map.name} preview`);
			const { min_x, min_y, max_x, max_y } = JSON.parse(map.bbox);
			await this.geoService.savePreview(map.layer, map.uuid, min_x, min_y, max_x, max_y, style.name);
		});
	}

	async create(dto: FormStyleDto) {
		this.logger.log(`Creating sld ${dto.name}`);

		try {
			const res = await this.geoserverService.createStyleWithRaw(dto.name, dto.data);

			if (res.status !== 201) {
				throw new BadRequestException(res.statusText);
			}

			delete dto.data;

			const { maps, ...style } = dto;

			let data: Style & { maps: MapData[] };

			if (!maps || maps?.length === 0) {
				data = await this.db.style.create({ data: style, include: { maps: true } });
			} else {
				data = await this.db.style.create({
					data: {
						...style,
						maps: {
							connect: maps.map((id) => ({ id })),
						},
					},
					include: { maps: true },
				});
			}

			await this.updateMapsPreviews(data);

			return new StyleEntity(data);
		} catch (error) {
			this.logger.error(`Error creating sld ${dto.name}: ${error.message}`);
			throw new BadRequestException();
		}
	}

	async findAll(filter: StyleFilter) {
		this.logger.log(`Finding all slds, with filter: ${filter}`);

		const { where, pagination } = filter;

		const [data, total] = await this.db.$transaction([
			this.db.style.findMany({
				where,
				...pagination,
				include: {
					maps: {
						where: {
							deletedDate: null,
							idDeletedBy: null,
						},
						select: {
							id: true,
							name: true,
						},
					},
				},
			}),
			this.db.style.count({ where }),
		]);

		return new ListStyleDto(data, total);
	}

	async findOne(id: number) {
		this.logger.log(`Finding sld with id: ${id}`);

		const style = await this.db.style.findFirst({
			where: { id },
			select: {
				id: true,
				name: true,
				type: true,
				maps: {
					where: {
						deletedDate: null,
						idDeletedBy: null,
					},
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		if (!style) throw new BadRequestException();

		const raw = await this.geoserverService.getStyleRaw(style.name, style.type).then((res) => res.text());

		this.logger.debug(`Raw sld: ${raw}`);

		return new StyleResponse({ ...style, data: raw });
	}

	async checkIfExists({ value, field }: ExistsQuery) {
		try {
			this.logger.log(`Checking if style exists with ${field}: ${value}`);
			return this.db.style.exists({ [field]: value });
		} catch (error) {
			this.logger.error(`Error checking if style exists: ${error}`);
			return false;
		}
	}

	async update(id: number, dto: FormStyleDto) {
		this.logger.log(`Updating sld with id: ${id}`);

		const style = await this.db.style.findFirst({ where: { id }, include: { maps: true } });

		if (!style) throw new BadRequestException();

		try {
			const res = await this.geoserverService.updateStyleRaw(style.name, dto.data);

			if (res.status !== 200) throw new BadRequestException(res.statusText);

			delete dto.data;

			const { maps, name, type } = dto;

			let data: any;

			if (!maps || maps?.length === 0) {
				data = await this.db.style.update({ where: { id }, data: { name, type }, include: { maps: true } });
			} else {
				data = await this.db.style.update({
					where: { id },
					include: { maps: true },
					data: {
						name,
						type,
						maps: {
							disconnect: style.maps.map((map) => ({ id: map.id })),
							connect: maps.map((id) => ({ id })),
						},
					},
				});
			}

			await this.updateMapsPreviews(data, style.maps);

			return new StyleEntity(data);
		} catch (error) {
			this.logger.error(`Error updating sld ${style.name}: ${error.message}`);
			throw new BadRequestException();
		}
	}

	async delete(id: number, body: AuditDeleteFields) {
		try {
			const data = await this.db.style.findFirst({ where: { id }, include: { maps: { select: { id: true } } } });

			if (!data) throw new BadRequestException();

			await this.geoserverService.deleteSld(data.name);

			await this.db.style.update({
				where: { id },
				data: {
					state: false,
					...body,
					maps: {
						disconnect: data.maps.map((map) => ({ id: map.id })),
					},
				},
			});

			return true;
		} catch (error) {
			this.logger.error(`Error deleting style ${id}: ${error.message}`);
			throw new BadRequestException();
		}
	}
}
