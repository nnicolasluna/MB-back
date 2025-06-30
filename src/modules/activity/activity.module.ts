import { Module } from '@nestjs/common';
import { ActivityController } from './controllers/activity.controller';
import { ActivityService } from './services/activity.service';
import { SimplePrismaService } from '@shared/db/prisma.simple';
@Module({
	controllers: [ActivityController],
	providers: [ActivityService, SimplePrismaService],
})
export class ActivityModule {}
