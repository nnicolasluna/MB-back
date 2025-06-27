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
		console.log('hola mundo');
		const data = await this.db.subdocumentos.findMany();

		return {
			items: data,
			total: data.length,
		};
	}

	findOne(id: number) {
		return this.db.subdocumentos.findUnique({
			where: { id },
		});
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
