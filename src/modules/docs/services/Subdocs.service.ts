import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';

@Injectable()
export class SubDocsService {
	constructor(private db: SimplePrismaService) {}
	async create(createDocDto: any) {
		const { tituloSub, nombreArchivo, documentosId } = createDocDto;

		return await this.db.subdocumentos.create({
			data: {
				tituloSub,
				nombreArchivo,
				documentos: {
					connect: {
						id: documentosId,
					},
				},
			},
		});
	}

	async findAll() {
		const data = await this.db.subdocumentos.findMany({
			include: {
				documentos: true,
			},
		});

		return {
			items: data,
			total: data.length,
		};
	}

	async findOne(id: number) {
		const data = await this.db.subdocumentos.findMany({
			where: { documentosId: id },
		});
		return {
			items: data,
			total: data.length,
		};
	}

	update(id: number, data: any) {
		const { tituloSub, nombreArchivo } = data;
		return this.db.subdocumentos.update({
			where: { id },
			data: {
				tituloSub,
				nombreArchivo,
			},
		});
	}
	remove(id: number) {
		return this.db.subdocumentos.delete({
			where: { id },
		});
	}
}
