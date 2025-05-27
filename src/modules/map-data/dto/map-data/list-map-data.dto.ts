import { ListDto } from 'src/shared/dto';
import { plainToInstance, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MapDataResponse } from './map-data-response.dto';

export class ListMapDataDto extends ListDto<MapDataResponse> {
	@ApiProperty({ description: 'List of items', type: MapDataResponse, isArray: true })
	@Type(() => MapDataResponse)
	items: MapDataResponse[];

	constructor(items: MapDataResponse[], total: number) {
		super(plainToInstance(MapDataResponse, items), total);
	}
}
