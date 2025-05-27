import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MapData } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';
import { Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';

export class MapDataEntity implements MapData {
	@ApiPropertyOptional({ description: 'Id' })
	id: number;

	@ApiPropertyOptional({ description: 'Código' })
	uuid: string;

	@ApiProperty({ description: 'Name of the map' })
	name: string;

	@ApiProperty({ description: 'Type of geometry' })
	typeGeom: string;

	@ApiProperty({ description: 'Description' })
	description: string;

	@ApiProperty({ description: 'Update frequency' })
	updateFrequency: string;

	@ApiProperty({ description: 'Content Date' })
	@Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD') : null))
	contentDate: Date;

	@ApiProperty({ description: 'Layer name' })
	layer: string;

	@ApiProperty({ description: 'Allow Download' })
	allowDownload: boolean;

	@ApiProperty({ description: 'Is public' })
	isPublic: boolean;

	@ApiProperty({ description: 'Id Style' })
	idStyle: number;

	@ApiProperty({ description: 'Bouding box' })
	bbox: string;

	urlImage: string;
	srsImage: string;
	nameImage: string;
	importId: number;
	bboxImage: Prisma.JsonValue;

	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	state: boolean;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	idCreatedBy: number;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	createdDate: Date;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	updatedDate: Date;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	idUpdatedBy: number;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	idDeletedBy: number;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	deletedDate: Date;

	constructor(partial: Partial<MapDataEntity>) {
		Object.assign(this, partial);
		if (partial?.contentDate) this.contentDate = new Date(partial.contentDate);
	}
}
