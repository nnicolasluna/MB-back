import { ListDto } from 'src/shared/dto';
import { plainToInstance, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MonitoringFireEntity } from '@modules/monitoring/entities/monitoring-fire.entity';

export class ListMonitoringFireDto extends ListDto<MonitoringFireEntity> {
	@ApiProperty({ description: 'List of items', type: MonitoringFireEntity, isArray: true })
	@Type(() => MonitoringFireEntity)
	items: MonitoringFireEntity[];

	constructor(items: MonitoringFireEntity[], total: number) {
		super(plainToInstance(MonitoringFireEntity, items), total);
	}
}
