import { documentos } from '@prisma/client';
import { PaginableFilter } from 'src/shared/dto';
import { createNestedObject } from 'src/shared/utils';

const searchFields: (keyof documentos)[] = ['titulo'];

export class SubDocsFilter extends PaginableFilter {
	get where() {
		const where: any = {};

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
