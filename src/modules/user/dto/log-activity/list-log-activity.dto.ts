import { ListDto } from 'src/shared/dto';
import { plainToInstance, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LogActivityResponse } from './log-activity-response.dto';

export class ListLogActivityDto extends ListDto<LogActivityResponse> {
	@ApiProperty({ description: 'List of items', type: LogActivityResponse, isArray: true })
	@Type(() => LogActivityResponse)
	override items: LogActivityResponse[];

	constructor(items: LogActivityResponse[], total: number) {
		super(plainToInstance(LogActivityResponse, items), total);
	}
}
