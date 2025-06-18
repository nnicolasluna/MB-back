import { Module } from '@nestjs/common';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';

@Module({
	controllers: [GroupController],
	providers: [GroupService],
})
export class GroupModule {}
