import { Controller, Get, Param, Res, StreamableFile, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Controller('uploads')
export class FilesController {
	@Get(':folder/:filename')
	@ApiBearerAuth()
	async getFile(
		@Param('folder') folder: string,
		@Param('filename') filename: string,
		@Res({ passthrough: true }) res: Response,
	): Promise<StreamableFile> {
		const filePath = join(process.cwd(), 'uploads', folder, filename);

		console.log('Buscando archivo en:', filePath); // Para debug

		// Verificar si el archivo existe
		if (!existsSync(filePath)) {
			console.log('Archivo no encontrado:', filePath); // Para debug
			throw new NotFoundException(`Archivo no encontrado: ${folder}/${filename}`);
		}

		const file = createReadStream(filePath);

		res.set({
			'Content-Type': 'application/pdf',
			'Content-Disposition': `inline; filename="${filename}"`,
			'Cache-Control': 'no-cache',
		});

		return new StreamableFile(file);
	}
}
