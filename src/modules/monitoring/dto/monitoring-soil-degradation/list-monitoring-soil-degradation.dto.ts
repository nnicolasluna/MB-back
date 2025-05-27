import { ListDto } from 'src/shared/dto';
import { plainToInstance, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MonitoringSoilDegradationEntity } from '@modules/monitoring/entities/monitoring-soil-degradation.entity';

export class ListMonitoringSoilDegradationDto extends ListDto<MonitoringSoilDegradationEntity> {
	@ApiProperty({ description: 'List of items', type: MonitoringSoilDegradationEntity, isArray: true })
	@Type(() => MonitoringSoilDegradationEntity)
	items: MonitoringSoilDegradationEntity[];

	constructor(items: MonitoringSoilDegradationEntity[], total: number) {
		super(plainToInstance(MonitoringSoilDegradationEntity, items), total);
	}
}
