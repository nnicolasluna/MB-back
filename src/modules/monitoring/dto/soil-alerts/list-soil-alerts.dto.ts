import { ListDto } from 'src/shared/dto';
import { plainToInstance, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SoilAlertEntity } from '@modules/monitoring/entities/soil-alert.entity';

export class ListSoilAlertDto extends ListDto<SoilAlertEntity> {
	@ApiProperty({ description: 'List of items', type: SoilAlertEntity, isArray: true })
	@Type(() => SoilAlertEntity)
	items: SoilAlertEntity[];

	constructor(items: SoilAlertEntity[], total: number) {
		super(plainToInstance(SoilAlertEntity, items), total);
	}
}
