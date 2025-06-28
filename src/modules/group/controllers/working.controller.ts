import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { WorkingService } from '../services/working.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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
}
