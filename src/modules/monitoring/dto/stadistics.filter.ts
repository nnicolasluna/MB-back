import { ApiProperty } from '@nestjs/swagger';

export class StadisticsFilter {
	@ApiProperty({
		description: 'start year',
		required: false,
	})
	startDate: Date;

	@ApiProperty({
		description: 'end year',
		required: false,
	})
	endDate: Date;

	@ApiProperty({
		description: 'uuid',
		required: false,
	})
	uuid?: string;
}
