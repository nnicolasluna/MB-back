import { Module } from '@nestjs/common';
import { RenderController } from './controllers/render.controller';
import { RenderService } from './services/render.service';
import { RoutesController } from './controllers/routes.controller';
import { GeoserverModule } from '@shared/services/geoserver/geoserver.modules';
import { GeoserverStyleService } from '@shared/services/geoserver/services/geoserver-styles.service';
import { MapIntersectionModule } from '@shared/services/map-intersector/map-intersection.module';
import { MapProcessorModule } from '@shared/services/map-processor/map-processor.module';

@Module({
	controllers: [RenderController, RoutesController],
	providers: [RenderService, GeoserverStyleService],
	imports: [GeoserverModule, MapIntersectionModule, MapProcessorModule],
})
export class DevModule {}
