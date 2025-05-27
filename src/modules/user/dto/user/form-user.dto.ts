import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../entities/user.entity';
import { IsDateString, IsEmail, IsOptional, IsPositive, Matches } from 'class-validator';
import { TrimAndValidate } from 'src/shared/decorators';

export class FormUserDto implements Partial<UserEntity> {
	@ApiProperty({
		description: 'Username',
		minLength: 3,
		maxLength: 30,
		nullable: false,
		required: true,
		pattern: '^[a-zA-Z0-9_ñÑ]+$',
	})
	@Matches(/^[a-zA-Z0-9_ñÑ]+$/)
	@TrimAndValidate(30)
	username: string;

	@ApiProperty({ description: 'Email' })
	@IsEmail()
	email: string;

	@ApiProperty({ description: 'Name', minLength: 3, maxLength: 100, nullable: false, required: true })
	@TrimAndValidate(100)
	name: string;

	@ApiProperty({ description: 'Paternal surname', minLength: 3, maxLength: 50, nullable: false, required: true })
	@TrimAndValidate(50)
	firstSurname: string;

	@ApiProperty({ description: 'Maternal surname', minLength: 3, maxLength: 50, nullable: false, required: true })
	@TrimAndValidate(50)
	secondSurname: string;

	@ApiProperty({
		description: 'Number of identification card',
		minLength: 3,
		maxLength: 20,
		nullable: false,
		required: true,
	})
	@TrimAndValidate(20)
	ci: string;

	@ApiProperty({ description: 'Phone number', minLength: 3, maxLength: 30, nullable: false, required: true })
	@TrimAndValidate(30)
	phone: string;

	@ApiProperty({ description: 'Direccion', nullable: false, required: true })
	@TrimAndValidate(200)
	address: string;

	@ApiProperty({ description: 'Role id', nullable: false, required: true, minimum: 1 })
	@IsPositive()
	idRole: number;

	@ApiProperty({ description: 'Image id', nullable: true, required: false, minimum: 1 })
	@IsOptional()
	idImage: number;

	@ApiProperty({ description: 'Expiration date of the account', nullable: false, required: true })
	@IsDateString()
	expirationAccount: Date;
}
