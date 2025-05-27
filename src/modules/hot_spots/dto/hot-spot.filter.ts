import { HotSpot, Prisma } from '@prisma/client';
import { PaginableFilter } from '@shared/dto';
import { createNestedObject } from '@shared/utils';

const searchFields: (keyof HotSpot)[] = ['details', 'state', 'url', 'table'];

export class HotSpotFilter extends PaginableFilter {
	override sortField?: string = 'date';

	get where() {
		const where: Prisma.HotSpotWhereInput = {};

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
