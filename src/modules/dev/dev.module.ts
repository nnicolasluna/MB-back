import { Module } from '@nestjs/common';
import { RenderController } from './controllers/render.controller';
import { RenderService } from './services/render.service';
import { RoutesController } from './controllers/routes.controller';

@Module({
	controllers: [RenderController, RoutesController],
	providers: [RenderService],
	imports: [],
})
export class DevModule {}
