import { ApiProperty } from '@nestjs/swagger';
import { MapData, Prisma } from '@prisma/client';
import { PaginableFilter } from '@shared/dto';
import { createNestedObject } from '@shared/utils';
import { Transform } from 'class-transformer';

const searchFields: (keyof MapData)[] = ['id', 'name', 'description'];

export class MapDataFilter extends PaginableFilter {
	isPublic?: boolean;

	@ApiProperty({
		description: 'get only maps with the this ids',
		required: false,
	})
	@Transform(({ value }) => (value === 'undefined' ? undefined : value))
	ids?: string;

	get where() {
		const where: Prisma.MapDataWhereInput = {
			state: true,
			deletedDate: null,
			idDeletedBy: null,
		};

		if (this.ids && this.ids.length !== 0) {
			where.id = {
				in: this.ids.split(',').map((id) => parseInt(id, 10)),
			};
			return where;
		}

		if (this.isPublic !== undefined) {
			where.isPublic = this.isPublic;
		}

		if (this.search && !this.ids) {
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
