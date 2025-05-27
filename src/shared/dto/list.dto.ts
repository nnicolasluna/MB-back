import { ApiProperty } from '@nestjs/swagger';

export abstract class ListDto<T> {
	items: T[];

	@ApiProperty({ description: 'Total number of items' })
	total: number;

	constructor(items: T[], total: number) {
		this.items = items;
		this.total = total;
	}
}
