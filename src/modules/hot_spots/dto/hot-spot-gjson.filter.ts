import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class HotSpotGJSONFilter {
	@ApiProperty({ description: 'Start date' })
	@IsString()
	@Matches(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'date must be in the format YYYY-MM-DD',
	})
	startDate: string;

	@ApiProperty({ description: 'End date' })
	@IsString()
	@Matches(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'date must be in the format YYYY-MM-DD',
	})
	endDate: Date;
}
