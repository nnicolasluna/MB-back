import { ApiProperty } from '@nestjs/swagger';
import { TrimAndValidate } from 'src/shared/decorators';
import { RoleEntity } from '../../entities/role.entity';
import { IsOptional } from 'class-validator';

export class FormRoleDto implements Partial<RoleEntity> {
	@ApiProperty({
		description: 'Role name',
		minLength: 3,
		maxLength: 100,
		nullable: false,
		required: true,
	})
	@TrimAndValidate(100)
	name: string;

	@ApiProperty({
		description: 'Description of role',
		minLength: 3,
		maxLength: 300,
		nullable: true,
		required: false,
	})
	@TrimAndValidate(300)
	@IsOptional()
	description: string;
}
