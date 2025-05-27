import { ListDto } from 'src/shared/dto';
import { plainToInstance, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user-response.dto';

export class ListUserDto extends ListDto<Omit<UserResponse, 'fullName'>> {
	@ApiProperty({ description: 'List of items', type: UserResponse, isArray: true })
	@Type(() => UserResponse)
	items: Omit<UserResponse, 'fullName'>[];

	constructor(users: Omit<UserResponse, 'fullName'>[], total: number) {
		super(plainToInstance(UserResponse, users), total);
	}
}
