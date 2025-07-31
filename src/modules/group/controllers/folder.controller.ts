import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { TrackActivity } from '@shared/decorators';
import { FolderService } from '../services/folder.service';
import { folderFilter } from '../dto/folder.filter';

@Controller('folder')
export class FolderController {
	constructor(private readonly Service: FolderService) { }

	@Post()
	@TrackActivity('Log [Creó una Carpeta]')
	create(@Body() data: any) {
		return this.Service.create(data);
	}
	@Get(':id')
	findOne(@Param('id') id: string, @Query() filter: folderFilter) {
		return this.Service.findOne(+id, filter);
	}
	@Put(':id')
	@TrackActivity('Log [Actualizo una Carpeta]')
	update(@Param('id') id: string, @Body() updateDto: any) {
		return this.Service.update(+id, updateDto);
	}
	@Delete(':id')
	@TrackActivity('Log [Borro una Carpeta]')
	remove(@Param('id') id: string) {
		return this.Service.remove(+id);
	}
}
