import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { DocsService } from '../services/docs.service';
import { TrackActivity } from '@shared/decorators';
import { DocsFilter } from '../dto/docs.filter';

@Controller('docs')
export class DocsController {
	constructor(private readonly docsService: DocsService) { }

	@Post()
	@TrackActivity('Log [Creó una Documento]')
	create(@Body() create: any) {
		return this.docsService.create(create);
	}

	@Get()
	findAll(@Query() filter: DocsFilter) {
		return this.docsService.findAll(filter);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.docsService.findOne(+id);
	}

	@Put(':id')
	@TrackActivity('Log [Actualizo Documento]')
	update(@Param('id') id: string, @Body() updateDocDto: any) {
		return this.docsService.update(+id, updateDocDto);
	}

	@Delete(':id')
	@TrackActivity('Log [Borro documento]')
	remove(@Param('id') id: string) {
		return this.docsService.remove(+id);
	}
}
