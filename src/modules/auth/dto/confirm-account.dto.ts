import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmAccountDto {
	@ApiProperty({ description: 'Email of the user', required: true })
	@IsNotEmpty()
	@IsEmail()
	email: string | null;

	@ApiProperty({ description: 'Password of the user', required: true })
	@IsString()
	@IsNotEmpty()
	password: string;

	@ApiProperty({ description: 'Verification code of the user', required: true })
	@IsString()
	@IsNotEmpty()
	verificationCode: string;
}
