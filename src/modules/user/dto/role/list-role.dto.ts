import { ListDto } from 'src/shared/dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '@modules/user/entities/role.entity';

export class ListRoleDto extends ListDto<RoleEntity> {
	@ApiProperty({ description: 'List of items', type: RoleEntity, isArray: true })
	@Type(() => RoleEntity)
	override items: RoleEntity[];

	constructor(items: RoleEntity[], total: number) {
		super(items, total);
	}
}
