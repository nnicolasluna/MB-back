import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MonitoringUseLand } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class MonitoringUseLandEntity implements MonitoringUseLand {
	@ApiPropertyOptional({ description: 'Id' })
	id: number;

	@ApiPropertyOptional({ description: 'Código' })
	uuid: string;

	@ApiProperty({ description: 'Name of the map' })
	name: string;

	@ApiProperty({ description: 'Description' })
	description: string;

	@ApiProperty({ description: 'Coverage date' })
	coverageDate: Date;

	@ApiProperty({ description: 'Coverage state' })
	coverageState: string;

	@ApiProperty({ description: 'Bouding box' })
	bbox: string;

	@ApiProperty({ description: 'Layer name' })
	layer: string;

	@ApiProperty({ description: 'Style name' })
	styleName: string;

	@ApiProperty({ description: 'Creation Date' })
	createdDate: Date;

	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	state: boolean;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	idCreatedBy: number;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	updatedDate: Date;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	idUpdatedBy: number;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	idDeletedBy: number;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	deletedDate: Date;

	constructor(partial: Partial<MonitoringUseLandEntity>) {
		Object.assign(this, partial);
	}
}
