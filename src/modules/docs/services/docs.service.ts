import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';

@Injectable()
export class DocsService {
	constructor(private db: SimplePrismaService) {}
	async create(createDocDto: any) {
		const { titulo, visualizacion } = createDocDto;

		return await this.db.documentos.create({
			data: {
				titulo,
				tipoVizualizacion: visualizacion,
			},
		});
	}

	async findAll() {
		const data = await this.db.documentos.findMany();

		return {
			items: data,
			total: data.length,
		};
	}

	findOne(id: number) {
		return this.db.documentos.findUnique({
			where: { id },
		});
	}

	async update(id: number, data: any) {
		const { titulo, visualizacion } = data;
		return this.db.documentos.update({
			where: { id },
			data: {
				titulo,
				tipoVizualizacion: visualizacion,
			},
		});
	}

	remove(id: number) {
		return this.db.documentos.delete({
			where: { id },
		});
	}
}
