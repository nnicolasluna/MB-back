import { MapDataEntity } from '@modules/map-data/entities/map-data.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrimAndValidate } from '@shared/decorators';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsPositive, IsString } from 'class-validator';

export class FormMapDataDto implements Partial<MapDataEntity> {
	@ApiProperty({ description: 'Name of the map', required: true, maxLength: 200, minLength: 3, nullable: false })
	@TrimAndValidate(200)
	name: string;

	@ApiProperty({ description: 'Type of geometry', required: true, maxLength: 100, minLength: 3, nullable: false })
	@TrimAndValidate(100)
	typeGeom: string;

	@ApiPropertyOptional({
		description: 'Source of the map',
		nullable: true,
		required: false,
		maxLength: 100,
		minLength: 3,
	})
	@TrimAndValidate(100)
	@IsOptional()
	source: string;

	@ApiPropertyOptional({ description: 'Description', required: false, maxLength: 300, minLength: 3, nullable: true })
	@TrimAndValidate(300)
	@IsString()
	@IsOptional()
	description: string;

	@ApiPropertyOptional({ description: 'Contact', required: false, maxLength: 100, minLength: 3, nullable: true })
	@TrimAndValidate(100)
	@IsOptional()
	contactResource: string;

	@ApiPropertyOptional({
		description: 'Status of the resource',
		required: false,
		maxLength: 100,
		minLength: 3,
		nullable: true,
	})
	@TrimAndValidate(100)
	@IsOptional()
	statusResource: string;

	@ApiPropertyOptional({
		description: 'Update frequency',
		required: false,
		maxLength: 100,
		minLength: 3,
		nullable: true,
	})
	@TrimAndValidate(100)
	@IsOptional()
	updateFrequency: string;

	@ApiPropertyOptional({ description: 'CRS', required: false, maxLength: 50, minLength: 3, nullable: true })
	@TrimAndValidate(50)
	@IsOptional()
	crs: string;

	@ApiPropertyOptional({ description: 'Scale', required: false, maxLength: 100, minLength: 3, nullable: true })
	@TrimAndValidate(100)
	@IsOptional()
	scale: string;

	@ApiProperty({ description: 'Content Date', required: true, nullable: false })
	@Transform(({ value }) => (value ? new Date(value) : null))
	@IsDate()
	@IsOptional()
	contentDate: Date;

	@ApiProperty({ description: 'Styles', required: true, nullable: false, isArray: true })
	@IsOptional()
	@IsPositive()
	idStyle: number;

	@ApiProperty({
		description: 'Array of id of thematics for the map',
		type: Number,
		required: true,
		nullable: false,
		isArray: true,
		example: [1, 2, 3],
	})
	@IsOptional()
	@Transform(({ value }) => (value ?? []).map((id: number) => ({ id })))
	idThematics: { id: number }[];

	@ApiProperty({ description: 'Id of the attachment of carimbo', required: true, nullable: false, isArray: false })
	@IsOptional()
	@IsPositive()
	idCarimbo: number;
}
