import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class RoleEntity implements Role {
	@ApiPropertyOptional({ description: 'Id' })
	id: number;

	@ApiPropertyOptional({ description: 'Código' })
	uuid: string;

	@ApiProperty({ description: 'Name of the role' })
	name: string;

	@ApiProperty({ description: 'Description of the role' })
	description: string;

	@Exclude({ toPlainOnly: true })
	@ApiHideProperty()
	idCreatedBy: number;
	@Exclude({ toPlainOnly: true })
	@ApiHideProperty()
	createdDate: Date;
	@Exclude({ toPlainOnly: true })
	@ApiHideProperty()
	idUpdatedBy: number;
	@Exclude({ toPlainOnly: true })
	@ApiHideProperty()
	updatedDate: Date;
	@Exclude({ toPlainOnly: true })
	@ApiHideProperty()
	idDeletedBy: number;
	@Exclude({ toPlainOnly: true })
	@ApiHideProperty()
	deletedDate: Date;
	@Exclude({ toPlainOnly: true })
	@ApiHideProperty()
	state: boolean;

	constructor(partial: Partial<RoleEntity>) {
		Object.assign(this, partial);
	}
}
