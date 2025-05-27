import { ApiProperty } from '@nestjs/swagger';
import { Prisma, Style } from '@prisma/client';
import { PaginableFilter } from '@shared/dto';
import { createNestedObject } from '@shared/utils';

const searchFields: (keyof Style)[] = ['id', 'name'];

export class StyleFilter extends PaginableFilter {
	@ApiProperty({ required: false, type: String, default: '' })
	public mapDataCode: string = '';

	get where() {
		const where: Prisma.StyleWhereInput = {};

		if ((this.mapDataCode ?? '') !== '') {
			where.maps = {
				some: {
					uuid: {
						contains: this.mapDataCode,
					},
				},
			};
		}

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
