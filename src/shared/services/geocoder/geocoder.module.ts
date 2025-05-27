import { Module } from '@nestjs/common';
import { GeocoderService } from './services/geocoder.service';
import { GeocoderController } from './controllers/geocoder.controller';

@Module({
	providers: [GeocoderService],
	controllers: [GeocoderController],
	exports: [GeocoderService],
})
export class GeocoderModule {}
