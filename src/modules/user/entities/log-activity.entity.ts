import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LogActivity } from '@prisma/client';

export class LogActivityEntity implements LogActivity {
	@ApiPropertyOptional({ description: 'Id' })
	id: number;

	@ApiProperty({ description: 'Name of the role' })
	name: string;

	@ApiProperty({ description: 'Description of the activity' })
	description: string;

	@ApiProperty({ description: 'Http Method' })
	method: string;

	@ApiProperty({ description: 'Url' })
	url: string;

	@ApiProperty({ description: 'Ip' })
	ip: string;

	@ApiProperty({ description: 'User Id' })
	idUser: number;

	@ApiProperty({ description: 'Date' })
	date: Date;

	constructor(partial: Partial<LogActivity>) {
		Object.assign(this, partial);
	}
}
