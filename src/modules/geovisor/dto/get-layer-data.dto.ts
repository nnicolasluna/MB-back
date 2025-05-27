import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetLayerData {
	@ApiProperty({ required: false, description: 'Archeological sites ids' })
	@Transform(({ value }) => (value ?? '')?.split(',') ?? [])
	archeologicalSite: string[];

	@ApiProperty({ required: false, description: 'mapData ids' })
	@Transform(({ value }) => (value ?? '')?.split(',') ?? [])
	mapData: string[];

	@ApiProperty({ required: false, description: 'Water ids' })
	@Transform(({ value }) => (value ?? '')?.split(',') ?? [])
	water: string[];

	@ApiProperty({ required: false, description: 'monitoringRisk ids' })
	@Transform(({ value }) => (value ?? '')?.split(',') ?? [])
	risk: string[];

	@ApiProperty({ required: false, description: 'soil alert ids' })
	@Transform(({ value }) => (value ?? '')?.split(',') ?? [])
	soilAlert: string[];

	@ApiProperty({ required: false, description: 'Monitoring burn ids' })
	@Transform(({ value }) => (value ?? '')?.split(',') ?? [])
	burn: string[];

	@ApiProperty({ required: false, description: 'Use Land ids' })
	@Transform(({ value }) => (value ?? '')?.split(',') ?? [])
	use: string[];

	@ApiProperty({ required: false, description: 'Monitoring soil ids' })
	@Transform(({ value }) => (value ?? '')?.split(',') ?? [])
	soil: string[];

	@ApiProperty({ required: true, description: 'Latitude' })
	lat: number;
	@ApiProperty({ required: true, description: 'Longitude' })
	lng: number;
	@ApiProperty({ required: false, description: 'Zoom' })
	zoom: number;
}
