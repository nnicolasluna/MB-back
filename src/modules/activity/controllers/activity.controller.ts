import { Controller, Get, Post, Body, Res, Param, Delete, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { ActivityService } from '../services/activity.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { SetMetadata } from '@nestjs/common';
@Controller('activity')
export class ActivityController {
	constructor(private readonly activityService: ActivityService) {}

	@Post()
	create(@Body() createActivityDto: any) {
		return this.activityService.create(createActivityDto);
	}

	@Get()
	findAll() {
		return this.activityService.findAll();
	}
	@Get('fechas')
	async findAllFechas() {
		console.log('Endpoint fechas called'); // Para verificar que se llama
		return await this.activityService.findAllFechas();
	}
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.activityService.findOne(+id);
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
		return this.activityService.update(+id, updateActivityDto);
	}
	@Put('acta/:id')
	updateacta(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
		return this.activityService.updateacta(+id, updateActivityDto);
	}
	@Put('list/:id')
	updatelist(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
		return this.activityService.updatelista(+id, updateActivityDto);
	}
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.activityService.remove(+id);
	}
	@Post('update-file')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads/TareaByFecha',
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
	@SetMetadata('isPublic', true)
	async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
		const filePath = path.join('./uploads/TareaByFecha', filename);

		// Verificar si el archivo existe
		if (!fs.existsSync(filePath)) {
			return res.status(404).json({ message: 'Archivo no encontrado' });
		}

		// Servir el archivo para descarga
		res.download(filePath, filename, (err) => {
			if (err) {
				console.error('Error al descargar archivo:', err);
				res.status(500).json({ message: 'Error al descargar el archivo' });
			}
		});
	}
	@Post('update-file-list')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads/TareaByFecha',
				filename: (req, file, cb) => {
					cb(null, file.originalname);
				},
			}),
		}),
	)
	async uploadFileList(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
		console.log('Archivo guardado como:', file.filename);

		return {
			message: 'Archivo subido correctamente',
			filename: file.filename,
		};
	}
	@Get('download-list/:filename')
	@SetMetadata('isPublic', true)
	async downloadFileList(@Param('filename') filename: string, @Res() res: Response) {
		const filePath = path.join('./uploads/TareaByFecha', filename);

		// Verificar si el archivo existe
		if (!fs.existsSync(filePath)) {
			return res.status(404).json({ message: 'Archivo no encontrado' });
		}

		// Servir el archivo para descarga
		res.download(filePath, filename, (err) => {
			if (err) {
				console.error('Error al descargar archivo:', err);
				res.status(500).json({ message: 'Error al descargar el archivo' });
			}
		});
	}
}
