import { UserResponse } from '@modules/user/dto/user/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class Resource {
	@ApiProperty({ description: 'Resource name' })
	resource: string;
	@ApiProperty({ description: 'Resource code' })
	code: string;
	@ApiProperty({ description: 'Resource permission' })
	permission: string;
}

export interface AccessTo {
	[key: string]: Resource;
}

export class BasicLoginResponseDto {
	@ApiProperty({ description: 'User information', type: UserResponse })
	@Type(() => UserResponse)
	user: Omit<UserResponse, 'fullName'>;

	@ApiProperty({ description: 'Access token' })
	token: string;

	@ApiProperty({ description: 'Access to resources' })
	accessTo: AccessTo;

	constructor(user: Omit<UserResponse, 'fullName'>, token: string, accessTo: AccessTo) {
		this.user = user;
		this.token = token;
		this.accessTo = accessTo;
	}
}
