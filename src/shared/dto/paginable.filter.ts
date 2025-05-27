import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { createNestedObject } from '../utils';

export enum SortDirEnum {
	asc = 'asc',
	desc = 'desc',
}

export class PaginableFilter {
	@ApiProperty({
		description: 'Quantity of elements to show',
		required: false,
		default: 6,
	})
	limit?: number = 6;

	@ApiProperty({ description: 'Current page', required: false, default: 0 })
	skip?: number = 0;

	@ApiProperty({
		description: 'Field to sort',
		required: false,
		default: 'createdDate',
	})
	sortField?: string = 'createdDate';

	@ApiProperty({
		description: 'Sort direction',
		enum: SortDirEnum,
		required: false,
		default: SortDirEnum.desc,
	})
	sortDir?: SortDirEnum = SortDirEnum.desc;

	@ApiProperty({ description: 'Search term', required: false })
	@Transform(({ value }) => value.trim())
	search?: string;

	@ApiProperty({
		description: 'Show all elements (Skip limit and skip)',
		required: false,
		default: false,
	})
	@Transform(({ value }) => value === 'true')
	showAll?: boolean = false;

	toString(): string {
		return JSON.stringify(this);
	}

	get orderBy() {
		const res = createNestedObject(this.sortField, this.sortDir);
		return [res];
	}

	get pagination() {
		return {
			take: this.showAll ? undefined : isNaN(+this.limit) ? 6 : +this.limit,
			skip: this.showAll ? undefined : isNaN(+this.skip) ? 0 : +this.skip,
			orderBy: this.orderBy,
		};
	}
}
