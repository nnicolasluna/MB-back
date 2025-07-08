import { ListDto } from 'src/shared/dto';
import { ApiProperty } from '@nestjs/swagger';

export class ListGroupDto extends ListDto<any> {
	@ApiProperty({ description: 'List of items', type: Object, isArray: true })
	override items: any[];

	constructor(items: any[], total: number) {
		super(items, total);
	}
}
