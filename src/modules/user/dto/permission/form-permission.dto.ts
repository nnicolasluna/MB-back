import { PermissionEntity } from '@modules/user/entities/permission.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class FormPermissionDto implements Partial<PermissionEntity> {
	@ApiProperty({ description: 'Id role', required: true, nullable: false, minimum: 1 })
	@IsNotEmpty()
	@IsPositive()
	idRole: number;

	@ApiProperty({ description: 'Id resource', required: true, nullable: false, minimum: 1 })
	@IsNotEmpty()
	@IsPositive()
	idResource: number;

	@ApiProperty({ description: 'Permission', required: true, nullable: false, minimum: 1 })
	@IsNotEmpty()
	@IsPositive()
	permission: number;
}
