import { PaginableFilter } from 'src/shared/dto';
import { createNestedObject } from 'src/shared/utils';

const searchFields: string[] = ['role.name', 'resource.name'];

export class PermissionsFilter extends PaginableFilter {
	get where() {
		const where: any = {
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
