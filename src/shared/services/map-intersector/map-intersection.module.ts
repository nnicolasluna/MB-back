import { Module } from '@nestjs/common';
import { DbModule } from 'src/shared/db/db.module';
import { IntersectionService } from './intersection-service.service';

@Module({
	providers: [IntersectionService],
	exports: [IntersectionService],
	imports: [DbModule],
})
export class MapIntersectionModule {}
