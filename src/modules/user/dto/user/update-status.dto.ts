import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateStatusDto {
	@ApiProperty({ description: 'User id' })
	@IsNotEmpty()
	@IsPositive()
	id: number;

	@ApiProperty({ description: 'User status' })
	@IsNotEmpty()
	@IsEnum(UserStatus)
	status: UserStatus;
}
