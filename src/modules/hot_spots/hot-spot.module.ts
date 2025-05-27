import { Module } from '@nestjs/common';
import { HotSpotService } from './services/hot-spot.service';
import { DbModule } from 'src/shared/db/db.module';
import { HotSpotController } from './controllers/hot-spot.controller';
import { MapProcessorModule } from '@shared/services/map-processor/map-processor.module';
import { MapIntersectionModule } from '@shared/services/map-intersector/map-intersection.module';
import { ShapefileProcessorService } from '@shared/services/map-processor/shapefile-processor.service';
import { IntersectionService } from '@shared/services/map-intersector/intersection-service.service';
import { TaskHotSpotService } from './services/task-hot-spot.service';

@Module({
	imports: [DbModule, MapProcessorModule, MapIntersectionModule],
	providers: [HotSpotService, ShapefileProcessorService, IntersectionService, TaskHotSpotService],
	controllers: [HotSpotController],
})
export class HotSpotModule {}
