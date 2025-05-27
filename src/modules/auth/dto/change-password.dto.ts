import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: 'Old Password' })
	oldPassword: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: 'New Password' })
	newPassword: string;
}
