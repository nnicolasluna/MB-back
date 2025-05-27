import { Module } from '@nestjs/common';
import { GeovisorController } from './controllers/geovisor.controller';
import { GeovisorService } from './services/geovisor.service';
import { GeoserverModule } from '@shared/services/geoserver/geoserver.modules';
import { GeoserverService } from '@shared/services/geoserver/services/geoserver.service';
import { GeoserverStyleService } from '@shared/services/geoserver/services/geoserver-styles.service';
import { MonitoringModule } from '@modules/monitoring/monitoring.module';
import { MapDataModule } from '@modules/map-data/map-data.module';

@Module({
	controllers: [GeovisorController],
	providers: [GeovisorService, GeoserverService, GeoserverStyleService],
	imports: [GeoserverModule, MonitoringModule, MapDataModule],
})
export class GeovisorModule {}
