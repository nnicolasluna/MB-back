import { ListDto } from 'src/shared/dto';
import { plainToInstance, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { HotSpotEntity } from '../entities/hot-spot.entity';

export class ListHotSpotDto extends ListDto<HotSpotEntity> {
	@ApiProperty({ description: 'List of items', type: HotSpotEntity, isArray: true })
	@Type(() => HotSpotEntity)
	items: HotSpotEntity[];

	constructor(items: HotSpotEntity[], total: number) {
		super(plainToInstance(HotSpotEntity, items), total);
	}
}
