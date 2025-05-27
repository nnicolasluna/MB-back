import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Resources } from '@prisma/client';

export class ResourceEntity implements Resources {
	@ApiPropertyOptional({ description: 'Id' })
	id: number;

	@ApiProperty({ description: 'Name' })
	name: string;

	@ApiProperty({ description: 'Code' })
	code: string;

	@ApiProperty({ description: 'Type' })
	type: string;
}
