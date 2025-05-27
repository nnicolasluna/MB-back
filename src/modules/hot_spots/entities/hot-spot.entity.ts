import { ApiProperty } from '@nestjs/swagger';
import { HotSpot } from '@prisma/client';

export const enum HotSpotState {
	Processing = 'Procesando',
	Completed = 'Completado',
	Failed = 'Fallido',
}

export class HotSpotEntity implements HotSpot {
	@ApiProperty({ description: 'id' })
	id: number;

	@ApiProperty({ description: 'Url of the service' })
	url: string;

	@ApiProperty({ description: 'Details of the process' })
	details: string;

	@ApiProperty({ description: 'Date of the process' })
	date: Date;

	@ApiProperty({ description: 'State of the process' })
	state: string;

	@ApiProperty({ description: 'Table of data' })
	table: string;

	constructor(partial: Partial<HotSpotEntity>) {
		Object.assign(this, partial);
	}
}
