import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';
import { DocsFilter } from '../dto/docs.filter';

@Injectable()
export class DocsService {
	constructor(private db: SimplePrismaService) { }
	async create(createDocDto: any) {
		const { titulo, visualizacion } = createDocDto;

		return await this.db.documentos.create({
			data: {
				titulo,
				tipoVizualizacion: visualizacion,
			},
		});
	}

	async findAll(filter: DocsFilter) {
		const { where, pagination } = filter;
		const [items, total] = await this.db.$transaction([
			this.db.documentos.findMany({
				include: {
					subdocumentos: true,
				},
				...pagination,
			}),
			this.db.documentos.count({ where }),
		]);
		return {
			items: items,
			total: total,
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
