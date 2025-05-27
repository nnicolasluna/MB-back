import { ApiProperty } from '@nestjs/swagger';
import { Prisma, User, UserStatus } from '@prisma/client';
import { PaginableFilter } from 'src/shared/dto';
import { createNestedObject } from 'src/shared/utils';

const searchFields: (keyof User)[] = ['username', 'email', 'name', 'firstSurname', 'secondSurname'];

export class UsersFilter extends PaginableFilter {
	@ApiProperty({ description: 'Estado del usuario', enum: UserStatus })
	userStatus: UserStatus = UserStatus.APROVE;

	get where() {
		const where: Prisma.UserWhereInput = {
			userStatus: this.userStatus,
			state: true,
			deletedDate: null,
			idDeletedBy: null,
		};

		if (this.search) {
			where.OR = searchFields.map((field) => {
				if (field === 'id') {
					if (isNaN(parseInt(this.search, 10))) return {};

					return createNestedObject(field, {
						equals: parseInt(this.search, 10),
					});
				}

				return createNestedObject(field, {
					contains: this.search,
					mode: 'insensitive',
				});
			});
		}

		return where;
	}
}
