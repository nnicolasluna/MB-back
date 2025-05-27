import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetLayerData {
	@ApiProperty({ required: false, description: 'Layers IDS' })
	@Transform(({ value }) => (value ?? '')?.split(',') ?? [])
	ids: string[];
	@ApiProperty({ required: true, description: 'Latitude' })
	lat: number;
	@ApiProperty({ required: true, description: 'Longitude' })
	lng: number;
	@ApiProperty({ required: false, description: 'Zoom' })
	zoom: number;
	@ApiProperty({ required: false, description: 'Name for layers geovisor controller' })
	name?: string;
}
