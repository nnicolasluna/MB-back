import { Injectable } from '@nestjs/common';
import { DBConnection } from '@shared/db/prisma';

@Injectable()
export class AgendaService {
	constructor(private readonly db: DBConnection) {}
	findAll() {
		return {
			items: [
				{
					id: 1,
					name: 'Sesiones de la MBC',
					periodo: '01/04/2025- 30/12/2025',
				},
			],
			total: 2,
		};
	}
	create(createMeetDto: any) {
		return createMeetDto;
	}
}
