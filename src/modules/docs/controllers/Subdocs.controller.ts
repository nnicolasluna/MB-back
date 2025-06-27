import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { SubDocsService } from '../services/Subdocs.service';

@Controller('subdocs')
export class SubDocsController {
	constructor(private readonly service: SubDocsService) { }

	@Post()
	create(@Body() createDocDto: any) {
		return this.service.create(createDocDto);
	}

	@Get()
	findAll() {
		return this.service.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.service.findOne(+id);
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() updateDocDto: any) {
		return this.service.update(+id, updateDocDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.service.remove(+id);
	}
}
