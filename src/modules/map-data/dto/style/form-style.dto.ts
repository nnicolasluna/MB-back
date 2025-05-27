import { StyleEntity } from '@modules/map-data/entities/style.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TrimAndValidate } from '@shared/decorators';
import { IsString } from 'class-validator';

export class FormStyleDto implements Partial<StyleEntity> {
	@ApiProperty({ description: 'Name of the style', required: true, maxLength: 100, minLength: 3, nullable: false })
	@TrimAndValidate(100)
	name: string;

	@ApiProperty({ description: 'Type of style', required: true, maxLength: 100, minLength: 3, nullable: false })
	@TrimAndValidate(100)
	type: string;

	@ApiProperty({ description: 'Maps that use this style', required: false, nullable: true })
	maps?: number[];

	@ApiProperty({ description: 'Raw text sld', required: true, nullable: false })
	@IsString()
	data: string;
}
