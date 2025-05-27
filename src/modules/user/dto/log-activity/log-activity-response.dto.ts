import { LogActivityEntity } from '@modules/user/entities/log-activity.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Type } from 'class-transformer';
import { UserResponse } from '../user/user-response.dto';

export class LogActivityResponse extends PartialType(LogActivityEntity) {
	@ApiProperty({ description: 'User' })
	@Type(() => UserResponse)
	user: Omit<UserResponse, 'fullName'>;

	constructor(partial: Partial<LogActivityResponse & { user?: User }>) {
		super();
		Object.assign(this, partial);
	}
}
