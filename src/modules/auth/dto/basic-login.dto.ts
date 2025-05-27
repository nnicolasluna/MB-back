import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class BasicLoginDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'User or email', example: 'admin' })
	username: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: 'Password', example: 'sample' })
	password: string;

	@IsBoolean()
	@ApiProperty({ description: 'Remember 30days' })
	remember: boolean;
}
