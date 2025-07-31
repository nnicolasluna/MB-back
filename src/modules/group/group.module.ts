import { Module } from '@nestjs/common';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';
import { WorkService } from './services/work.service';
import { WorkController } from './controllers/work.controller';
import { WorkingController } from './controllers/working.controller';
import { WorkingService } from './services/working.service';
import { FolderController } from './controllers/folder.controller';
import { FolderService } from './services/folder.service';

@Module({
	controllers: [GroupController, WorkController, WorkingController, FolderController],
	providers: [GroupService, WorkService, WorkingService, FolderService],
})
export class GroupModule { }
