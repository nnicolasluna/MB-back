import { Module } from '@nestjs/common';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';
import { WorkService } from './services/work.service';
import { WorkController } from './controllers/work.controller';

@Module({
	controllers: [GroupController, WorkController],
	providers: [GroupService, WorkService],
})
export class GroupModule {}
