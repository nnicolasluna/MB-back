import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { DocsService } from '../services/docs.service';

@Controller('docs')
export class DocsController {
	constructor(private readonly docsService: DocsService) {}

	@Post()
	create(@Body() create: any) {
		return this.docsService.create(create);
	}

	@Get()
	findAll() {
		return this.docsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.docsService.findOne(+id);
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() updateDocDto: any) {
		return this.docsService.update(+id, updateDocDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.docsService.remove(+id);
	}
}
