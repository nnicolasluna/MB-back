import { RoleEntity } from '@modules/user/entities/role.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class UserResponse extends PartialType(UserEntity) {
	@ApiProperty({ description: 'Role of the user' })
	@Type(() => RoleEntity)
	role?: RoleEntity;

	@ApiProperty({ description: 'Full name of the user', type: String })
	@Expose({ toPlainOnly: true })
	get fullName(): string {
		return `${this.name} ${this.firstSurname} ${this.secondSurname}`;
	}

	constructor(user: Partial<UserEntity & { role?: RoleEntity }>) {
		super();
		Object.assign(this, user);
	}
}
