import { Controller, Patch, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { WorkingService } from '../services/working.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { SetMetadata } from '@nestjs/common';
@Controller('working-docs')
export class WorkingController {
	constructor(private readonly Service: WorkingService) {}

	@Post()
	create(@Body() createGroupDto: any) {
		return this.Service.create(createGroupDto);
	}

	@Get()
	findAll() {
		return this.Service.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.Service.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
		return this.Service.update(+id, updateGroupDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.Service.remove(+id);
	}
	@Post('update-file')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads/documentosGrupos', // o cualquier ruta que uses
				filename: (req, file, cb) => {
					cb(null, file.originalname);
				},
			}),
		}),
	)
	async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
		return {
			message: 'Archivo subido correctamente',
			filename: file.filename,
		};
	}
	@Get('download/:filename')
	@SetMetadata('isPublic', true)
	async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
		const filePath = path.join('./uploads/documentosGrupos', filename);

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
