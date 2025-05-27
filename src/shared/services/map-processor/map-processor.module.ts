import { Module } from '@nestjs/common';
import { DbModule } from 'src/shared/db/db.module';
import { ShapefileProcessorService } from './shapefile-processor.service';

@Module({
	providers: [ShapefileProcessorService],
	exports: [ShapefileProcessorService],
	imports: [DbModule],
})
export class MapProcessorModule {}
