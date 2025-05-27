import { Prisma, Role } from '@prisma/client';
import { PaginableFilter } from 'src/shared/dto';
import { createNestedObject } from 'src/shared/utils';

const searchFields: (keyof Role)[] = ['name', 'description'];

export class RolesFilter extends PaginableFilter {
	get where() {
		const where: Prisma.RoleWhereInput = {
			state: true,
			deletedDate: null,
			idDeletedBy: null,
		};

		if (this.search) {
			where.OR = searchFields.map((field) => {
				return createNestedObject(field, {
					contains: this.search,
					mode: 'insensitive',
				});
			});
		}

		return where;
	}
}
