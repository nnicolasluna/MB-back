import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User, UserStatus } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';
import * as dayjs from 'dayjs';

export class UserEntity implements User {
	@ApiPropertyOptional({ description: 'Id' })
	id: number;

	@ApiPropertyOptional({ description: 'Código' })
	uuid: string;

	@ApiProperty({ description: 'Username' })
	username: string;

	@ApiProperty({ description: 'Email' })
	email: string;

	@ApiProperty({ description: 'Name' })
	name: string;

	@ApiProperty({ description: 'Paternal surname' })
	firstSurname: string;

	@ApiProperty({ description: 'Maternal surname' })
	secondSurname: string;

	@ApiProperty({ description: 'Number of identification card' })
	ci: string;

	@ApiProperty({ description: 'Phone number' })
	phone: string;

	@ApiProperty({ description: 'User status', enum: UserStatus })
	userStatus: UserStatus;

	@ApiProperty({ description: 'True if the user verifide his account' })
	reviwedVerificationCode: boolean;

	@ApiProperty({ description: 'Expiration date of the account' })
	@Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
	expirationAccount: Date;

	@ApiProperty({ description: 'Is Two Factor Authentication Active' })
	isTFAActive: boolean;

	@ApiProperty({ description: 'User Blocked until this date' })
	blockedUntil: Date;

	@ApiProperty({ description: 'Address' })
	address: string;

	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	expirationVerificationCode: Date;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	verificationCode: string;
	@ApiProperty({ description: 'Password' })
	@Exclude({ toPlainOnly: true })
	password: string;
	@Exclude({ toPlainOnly: true })
	idRole: number;
	@Exclude({ toPlainOnly: true })
	idImage: number;
	@Exclude({ toPlainOnly: true })
	@ApiHideProperty()
	idCreatedBy: number;
	@Exclude({ toPlainOnly: true })
	@ApiHideProperty()
	createdDate: Date;
	@Exclude({ toPlainOnly: true })
	@ApiHideProperty()
	idUpdatedBy: number;
	@Exclude({ toPlainOnly: true })
	@ApiHideProperty()
	updatedDate: Date;
	@Exclude({ toPlainOnly: true })
	@ApiHideProperty()
	idDeletedBy: number;
	@Exclude({ toPlainOnly: true })
	@ApiHideProperty()
	deletedDate: Date;
	@Exclude({ toPlainOnly: true })
	@ApiHideProperty()
	state: boolean;

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial);
	}
}
