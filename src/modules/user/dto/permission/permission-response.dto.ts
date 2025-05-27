import { PermissionEntity } from '@modules/user/entities/permission.entity';
import { ResourceEntity } from '@modules/user/entities/resource.entity';
import { RoleEntity } from '@modules/user/entities/role.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Resources, Role } from '@prisma/client';
import { Type } from 'class-transformer';

export class PermissionResponse extends PartialType(PermissionEntity) {
	@ApiProperty({ description: 'Role' })
	@Type(() => RoleEntity)
	role: RoleEntity;

	@ApiProperty({ description: 'Resource' })
	@Type(() => ResourceEntity)
	resource: ResourceEntity;

	constructor(partial: Partial<PermissionResponse & { role?: Role; resource?: Resources }>) {
		super(partial);
		Object.assign(this, partial);

		if (partial.role) this.role = partial.role;
		if (partial.resource) this.resource = partial.resource;
	}
}
