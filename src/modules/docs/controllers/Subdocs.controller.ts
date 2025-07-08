import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Res, Query } from '@nestjs/common';
import { SubDocsService } from '../services/Subdocs.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { SetMetadata } from '@nestjs/common';
import { IsPublic, TrackActivity } from '@shared/decorators';
import { SubDocsFilter } from '../dto/Subdocs.filter';
@Controller('subdocs')
export class SubDocsController {
	constructor(private readonly service: SubDocsService) { }

	@Post()
	@TrackActivity('Log [Creó Sub Documento]')
	create(@Body() createDocDto: any) {
		return this.service.create(createDocDto);
	}

	@Get()
	@IsPublic()
	findAll(@Query() filter: SubDocsFilter) {
		return this.service.findAll(filter);
	}

	@Get(':id')
	findOne(@Param('id') id: string, @Query() filter: SubDocsFilter) {
		return this.service.findOne(+id, filter);
	}

	@Put(':id')
	@TrackActivity('Log [Actualizo Sub Documento]')
	update(@Param('id') id: string, @Body() updateDocDto: any) {
		return this.service.update(+id, updateDocDto);
	}

	@Delete(':id')
	@TrackActivity('Log [Borro Sub Documento]')
	remove(@Param('id') id: string) {
		return this.service.remove(+id);
	}

	@Post('update-file')
	@TrackActivity('Log [Subio Documento]')
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
	@Get('download/:filename')
	@TrackActivity('Log [Descargo Documento]')
	@SetMetadata('isPublic', true)
	async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
		const filePath = path.join('./uploads/Subcategorias', filename);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({ message: 'Archivo no encontrado' });
		}

		res.download(filePath, filename, (err) => {
			if (err) {
				console.error('Error al descargar archivo:', err);
				res.status(500).json({ message: 'Error al descargar el archivo' });
			}
		});
	}
	@Get('download-externo/:filename')
	@IsPublic()
	async downloadFileexterno(@Param('filename') filename: string, @Res() res: Response) {
		const filePath = path.join('./uploads/Subcategorias', filename);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({ message: 'Archivo no encontrado' });
		}

		res.download(filePath, filename, (err) => {
			if (err) {
				console.error('Error al descargar archivo:', err);
				res.status(500).json({ message: 'Error al descargar el archivo' });
			}
		});
	}
}
