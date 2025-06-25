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

	update(id: number, updateDocDto: any) {
		return updateDocDto;
	}

	remove(id: number) {
		return `This action removes a #${id} doc`;
	}
}
