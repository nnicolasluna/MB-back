import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { WorkService } from '../services/work.service';

@Controller('work')
export class WorkController {
	constructor(private readonly service: WorkService) {}

	@Post()
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
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
		return this.service.update(+id, updateGroupDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.service.remove(+id);
	}
}
