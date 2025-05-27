import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
	@ApiProperty({ description: 'Email of the account', required: true, example: 'example@example.com' })
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;
}
