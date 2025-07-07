import { Controller, Get, Post, Body, Res, Param, Delete, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { ActivityService } from '../services/activity.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { SetMetadata } from '@nestjs/common';
import { IsPublic, TrackActivity } from '@shared/decorators';
@Controller('activity')
export class ActivityController {
	constructor(private readonly activityService: ActivityService) {}
	@TrackActivity('Log [Creó una Actividad]')
	@Post()
	create(@Body() createActivityDto: any) {
		return this.activityService.create(createActivityDto);
	}

	@Get()
	findAll() {
		return this.activityService.findAll();
	}
	@Get('fechas')
	@IsPublic()
	async findAllFechas() {
		return await this.activityService.findAllFechas();
	}
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.activityService.findOne(+id);
	}
	@TrackActivity('Log [Actualizo Actividad]')
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
	@TrackActivity('Log [Borro una Actividad]')
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.activityService.remove(+id);
	}
	@Post('update-file')
	@TrackActivity('Log [Subio Acta]')
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
	@TrackActivity('Log [Descargo Acta]')
	@SetMetadata('isPublic', true)
	async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
		const filePath = path.join('./uploads/TareaByFecha', filename);
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
	@Post('update-file-list')
	@TrackActivity('Log [Subio Lista de participante]')
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
	@TrackActivity('Log [Descargo lista de participantes]')
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
	@Get('download-externo/:filename')
	@IsPublic()
	async downloadFileexterno(@Param('filename') filename: string, @Res() res: Response) {
		const filePath = path.join('./uploads/TareaByFecha', filename);

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
/* download-externo */
/* const filePath = path.join('./uploads/TareaByFecha', filename); */
