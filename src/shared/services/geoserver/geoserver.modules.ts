import { Module } from '@nestjs/common';
import { GeoserverService } from './services/geoserver.service';

@Module({
	providers: [GeoserverService],
	controllers: [],
	exports: [GeoserverService],
})
export class GeoserverModule {}
