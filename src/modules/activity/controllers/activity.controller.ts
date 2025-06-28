import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { ActivityService } from '../services/activity.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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
}
