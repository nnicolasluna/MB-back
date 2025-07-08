import { Prisma, Actividad } from '@prisma/client';
import { PaginableFilter } from 'src/shared/dto';
import { createNestedObject } from 'src/shared/utils';

const searchFields: (keyof Actividad)[] = ['nombre'];

export class ActivityFilter extends PaginableFilter {
	get where() {
		const where: Prisma.ActividadWhereInput = {};

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
