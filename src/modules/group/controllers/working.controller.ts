import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseInterceptors,
	UploadedFile,
	Res,
	Query,
	Put,
} from '@nestjs/common';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { WorkingService } from '../services/working.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { SetMetadata } from '@nestjs/common';
import { TrackActivity } from '@shared/decorators';
import { workingFilter } from '../dto/working.filter';
@Controller('working-docs')
export class WorkingController {
	constructor(private readonly Service: WorkingService) {}

	@Post()
	@TrackActivity('Log [Creó una Documento por Grupo]')
	create(@Body() createGroupDto: any) {
		return this.Service.create(createGroupDto);
	}

	@Get()
	findAll() {
		return this.Service.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string, @Query() filter: workingFilter) {
		return this.Service.findOne(+id, filter);
	}

	@Put(':id')
	@TrackActivity('Log [Actualizo documento por grupo]')
	update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
		return this.Service.update(+id, updateGroupDto);
	}

	@Delete(':id')
	@TrackActivity('Log [Borro Documento por grupo]')
	remove(@Param('id') id: string) {
		return this.Service.remove(+id);
	}
	@Post('update-file')
	@TrackActivity('Log [Subio Documento por grupo]')
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
	@TrackActivity('Log [Descargo Documento por grupo]')
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
