import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';
import { folderFilter } from '../dto/folder.filter';

@Injectable()
export class FolderService {
	constructor(private db: SimplePrismaService) { }

	async create(data: any) {
		return this.db.folderByGrupo.create({
			data: {
				nombre: data.nombre,
				descripcion: data.descripcion,
				grupo: { connect: { id: data.grupoId } },
			},
		});
	}

	async findOne(id: number, filter: folderFilter) {
		const { pagination } = filter;
		const [items, total] = await this.db.$transaction([
			this.db.folderByGrupo.findMany({
				where: { grupoId: id },
				...pagination,
			}),
			this.db.folderByGrupo.count({ where: { grupoId: id } }),
		]);
		return {
			items: items,
			total: total,
		};
	}

	async update(id: number, data: any) {
		return this.db.folderByGrupo.update({
			where: { id },
			data: {
				nombre: data.nombre,
				descripcion: data.descripcion,
				...(data.grupoId && { grupo: { connect: { id: data.grupoId } } }),
			},
		});
	}

	remove(id: number) {
		return this.db.folderByGrupo.delete({
			where: { id },
		});
	}
}
