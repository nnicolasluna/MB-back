import { MonitoringWater, Prisma } from '@prisma/client';
import { PaginableFilter } from '@shared/dto';
import { createNestedObject } from '@shared/utils';

const searchFields: (keyof MonitoringWater)[] = ['id', 'name', 'description'];

export class MonitoringWaterFilter extends PaginableFilter {
	coverageState?: string;

	get where() {
		const where: Prisma.MonitoringWaterWhereInput = {
			state: true,
			deletedDate: null,
			idDeletedBy: null,
		};

		if (this.coverageState) {
			where.coverageState = {
				equals: this.coverageState,
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
