import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SubDocsService } from '../services/Subdocs.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('subdocs')
export class SubDocsController {
	constructor(private readonly service: SubDocsService) {}

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

	@Post('update-file')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads/Subcategorias',
				filename: (req, file, cb) => {
					cb(null, file.originalname);
				},
			}),
		}),
	)
	async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
		console.log('Archivo guardado como:', file.filename);

		return {
			message: 'Archivo subido correctamente',
			filename: file.filename,
		};
	}
}
