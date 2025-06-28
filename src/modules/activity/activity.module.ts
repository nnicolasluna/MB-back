import { Module } from '@nestjs/common';
import { ActivityController } from './controllers/activity.controller';
import { ActivityService } from './services/activity.service';
import { SimplePrismaService } from '@shared/db/prisma.simple';
import { FilesController } from './controllers/FilesController.controller';

@Module({
	controllers: [ActivityController, FilesController],
	providers: [ActivityService, SimplePrismaService],
})
export class ActivityModule {}
