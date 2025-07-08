import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';
import { SubDocsFilter } from '../dto/Subdocs.filter';

@Injectable()
export class SubDocsService {
	constructor(private db: SimplePrismaService) { }
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

	async findAll(filter: SubDocsFilter) {
		const { where, pagination } = filter;
		const [items, total] = await this.db.$transaction([
			this.db.subdocumentos.findMany({
				include: {
					documentos: true,
				},
				...pagination,
			}),
			this.db.subdocumentos.count({ where }),
		]);
		return {
			items: items,
			total: total,
		};
	}

	async findOne(id: number, filter: SubDocsFilter) {
		/* const data = await this.db.subdocumentos.findMany({
			where: { documentosId: id },
		});
		return {
			items: data,
			total: data.length,
		}; */
		const { pagination } = filter;
		const [items, total] = await this.db.$transaction([
			this.db.subdocumentos.findMany({
				where: { documentosId: id },
				...pagination,
			}),
			this.db.subdocumentos.count({ where: { documentosId: id } }),
		]);
		return {
			items: items,
			total: total,
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
