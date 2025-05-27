import { ApiProperty } from '@nestjs/swagger';

export class ExistsQuery {
	@ApiProperty({ description: 'Value to search' })
	value: string;

	@ApiProperty({ description: 'Field to search' })
	field: string;
}
