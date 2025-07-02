import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { GroupService } from '../services/group.service';
import { IsPublic, TrackActivity } from '@shared/decorators';

@Controller('group')
export class GroupController {
	constructor(private readonly groupService: GroupService) { }

	@Post()
	@TrackActivity('Log [Creó una Grupo]')
	create(@Body() createGroupDto: any) {
		return this.groupService.create(createGroupDto);
	}
	@IsPublic()
	@Get()
	findAll() {
		return this.groupService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.groupService.findOne(+id);
	}

	@Patch(':id')
	@TrackActivity('Log [Actualizo grupo]')
	update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
		return this.groupService.update(+id, updateGroupDto);
	}

	@Delete(':id')
	@TrackActivity('Log [Borro Grupo]')
	remove(@Param('id') id: string) {
		return this.groupService.remove(+id);
	}
}
