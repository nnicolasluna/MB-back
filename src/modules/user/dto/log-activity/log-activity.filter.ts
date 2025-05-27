import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { PaginableFilter } from 'src/shared/dto';
import { createNestedObject } from 'src/shared/utils';

const searchFields: string[] = [
	'user.firstName',
	'user.secondName',
	'user.firstSurname',
	'user.secondSurname',
	'description',
	'method',
	'ip',
	'url',
];

export class LogActivitiesFilter extends PaginableFilter {
	@ApiProperty({ description: 'Sort field', example: 'id', default: 'id' })
	override sortField: string = 'id';

	get where() {
		const where: Prisma.LogActivityWhereInput = {};

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
