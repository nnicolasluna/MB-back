import { Module } from '@nestjs/common';
import { MonitoringWaterController } from './controllers/monitoring-water.controller';
import { UploadMapConsumer } from './queues/upload-map.consumer';
import { BullModule } from '@nestjs/bull';
import { PROCESS_MONITORING_MAP_TOKEN } from './lib/constants';
import { GeoserverModule } from '@shared/services/geoserver/geoserver.modules';
import { GeoserverService } from '@shared/services/geoserver/services/geoserver.service';
import { GeoserverStyleService } from '@shared/services/geoserver/services/geoserver-styles.service';
import { MonitoringWaterService } from './services/monitoring-water.service';
import { MonitoringFireService } from './services/monitoring-fire.service';
import { MapIntersectionModule } from '@shared/services/map-intersector/map-intersection.module';
import { MapProcessorModule } from '@shared/services/map-processor/map-processor.module';
import { ShapefileProcessorService } from '@shared/services/map-processor/shapefile-processor.service';
import { IntersectionService } from '@shared/services/map-intersector/intersection-service.service';
import { MonitoringFireController } from './controllers/monitoring-fire.controller';
import { MonitoringBurnController } from './controllers/monitoring-burn.controller';
import { MonitoringBurnService } from './services/monitoring-burn.service';
import { MonitoringUseLandService } from './services/monitoring-use-land.service';
import { MonitoringSoilDegradationService } from './services/monitoring-soil-degradation.service';
import { MonitoringSoilDegradationController } from './controllers/monitoring-soil-degradation.controller';
import { MonitoringUseLandController } from './controllers/monitoring-use-land.controller';
import { SoilAlertsService } from './services/soil-alerts.service';
import { SoilAlertsController } from './controllers/soil-alerts.controller';

@Module({
	exports: [
		MonitoringFireService,
		MonitoringWaterService,
		MonitoringBurnService,
		MonitoringUseLandService,
		MonitoringSoilDegradationService,
		SoilAlertsService,
	],
	controllers: [
		MonitoringWaterController,
		MonitoringFireController,
		MonitoringBurnController,
		MonitoringSoilDegradationController,
		MonitoringUseLandController,
		SoilAlertsController,
	],
	providers: [
		MonitoringFireService,
		MonitoringWaterService,
		UploadMapConsumer,
		GeoserverService,
		GeoserverStyleService,
		IntersectionService,
		ShapefileProcessorService,
		MonitoringBurnService,
		MonitoringSoilDegradationService,
		MonitoringUseLandService,
		SoilAlertsService,
	],
	imports: [
		BullModule.registerQueue({ name: PROCESS_MONITORING_MAP_TOKEN }),
		GeoserverModule,
		MapIntersectionModule,
		MapProcessorModule,
	],
})
export class MonitoringModule {}
