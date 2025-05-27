import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GeocoderService } from '../services/geocoder.service';
import { IsPublic } from '@shared/decorators';

@Controller('geocoder')
@ApiTags('Geocoder')
export class GeocoderController {
	constructor(private readonly geocoderService: GeocoderService) {}

	@Get('region-limits')
	@ApiOperation({ summary: 'Get region limits' })
	@IsPublic()
	findRegionLimits() {
		return this.geocoderService.regionLimits();
	}
}
