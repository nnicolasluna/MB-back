import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResourceRoles } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class PermissionEntity implements ResourceRoles {
	@ApiPropertyOptional({ description: 'Code' })
	uuid: string;

	@ApiProperty({ description: 'Id of the role' })
	idRole: number;

	@ApiProperty({ description: 'Id of the resource' })
	idResource: number;

	@ApiProperty({ description: 'Permission' })
	permission: number;

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

	constructor(partial: Partial<ResourceRoles>) {
		Object.assign(this, partial);
	}
}
