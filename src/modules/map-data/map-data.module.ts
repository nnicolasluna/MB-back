import { Module } from '@nestjs/common';
import { MapDataController } from './controllers/map-data.controller';
import { UploadMapConsumer } from './queues/upload-map.consumer';
import { MapDataService } from './services/map-data.service';
import { BullModule } from '@nestjs/bull';
import { UPLOAD_MAP_QUEUE_TOKEN } from './lib/constants';
import { GeoserverModule } from '@shared/services/geoserver/geoserver.modules';
import { GeoserverService } from '@shared/services/geoserver/services/geoserver.service';
import { GeoserverStyleService } from '@shared/services/geoserver/services/geoserver-styles.service';
import { MapStylesController } from './controllers/style.controller';
import { StyleService } from './services/style.service';

@Module({
	exports: [MapDataService],
	controllers: [MapDataController, MapStylesController],
	providers: [MapDataService, UploadMapConsumer, GeoserverService, GeoserverStyleService, StyleService],
	imports: [BullModule.registerQueue({ name: UPLOAD_MAP_QUEUE_TOKEN }), GeoserverModule],
})
export class MapDataModule {}
