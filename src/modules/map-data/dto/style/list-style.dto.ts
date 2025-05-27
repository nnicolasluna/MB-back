import { ListDto } from 'src/shared/dto';
import { plainToInstance, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { StyleEntity } from '@modules/map-data/entities/style.entity';

export class ListStyleDto extends ListDto<StyleEntity> {
	@ApiProperty({ description: 'List of items', type: StyleEntity, isArray: true })
	@Type(() => StyleEntity)
	items: StyleEntity[];

	constructor(items: StyleEntity[], total: number) {
		super(plainToInstance(StyleEntity, items), total);
	}
}
