import { ListDto } from 'src/shared/dto';
import { plainToInstance, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MonitoringBurnEntity } from '@modules/monitoring/entities/monitoring-burn.entity';

export class ListMonitoringBurnDto extends ListDto<MonitoringBurnEntity> {
	@ApiProperty({ description: 'List of items', type: MonitoringBurnEntity, isArray: true })
	@Type(() => MonitoringBurnEntity)
	items: MonitoringBurnEntity[];

	constructor(items: MonitoringBurnEntity[], total: number) {
		super(plainToInstance(MonitoringBurnEntity, items), total);
	}
}
