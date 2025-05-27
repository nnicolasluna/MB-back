import { ListDto } from 'src/shared/dto';
import { plainToInstance, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MonitoringWaterEntity } from '@modules/monitoring/entities/monitoring-water.entity';

export class ListMonitoringWaterDto extends ListDto<MonitoringWaterEntity> {
	@ApiProperty({ description: 'List of items', type: MonitoringWaterEntity, isArray: true })
	@Type(() => MonitoringWaterEntity)
	items: MonitoringWaterEntity[];

	constructor(items: MonitoringWaterEntity[], total: number) {
		super(plainToInstance(MonitoringWaterEntity, items), total);
	}
}
