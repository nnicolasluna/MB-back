import { ListDto } from 'src/shared/dto';
import { plainToInstance, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MonitoringUseLandEntity } from '@modules/monitoring/entities/monitoring-use-land.entity';

export class ListMonitoringUseLandDto extends ListDto<MonitoringUseLandEntity> {
	@ApiProperty({ description: 'List of items', type: MonitoringUseLandEntity, isArray: true })
	@Type(() => MonitoringUseLandEntity)
	items: MonitoringUseLandEntity[];

	constructor(items: MonitoringUseLandEntity[], total: number) {
		super(plainToInstance(MonitoringUseLandEntity, items), total);
	}
}
