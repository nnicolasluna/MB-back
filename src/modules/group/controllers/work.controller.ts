import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { WorkService } from '../services/work.service';
import { TrackActivity } from '@shared/decorators';

@Controller('work')
export class WorkController {
	constructor(private readonly service: WorkService) { }

	@Post()
	@TrackActivity('Log [Creo Reunion]')
	create(@Body() createGroupDto: any) {
		return this.service.create(createGroupDto);
	}

	@Get()
	findAll() {
		return this.service.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.service.findByGrupoId(+id);
	}
	@TrackActivity('Log [Actualizo Reunion]')
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
		return this.service.update(+id, updateGroupDto);
	}

	@Delete(':id')
	@TrackActivity('Log [Borro Reunion]')
	remove(@Param('id') id: string) {
		return this.service.remove(+id);
	}
}
