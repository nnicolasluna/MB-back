import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';
import { workingFilter } from '../dto/working.filter';

@Injectable()
export class WorkingService {
	constructor(private db: SimplePrismaService) { }

	async create(createGroupDto: any) {
		const { nombre, descripcion, nombreArchivo, folderId } = createGroupDto;

		const grupo = await this.db.documentosGrupo.create({
			data: {
				nombre,
				descripcion,
				nombreArchivo,
				FolderByGrupo: {
					connect: {
						id: folderId,
					},
				},
			},
		});
		return grupo;
	}

	async findAll() {
		const grupos = await this.db.documentosGrupo.findMany();

		return {
			items: grupos,
			total: grupos.length,
		};
	}

	async findOne(id: number, filter: workingFilter) {
		/* return this.db.documentosGrupo.findUnique({
			where: { id },
		}); */
		const { pagination } = filter;
		const [items, total] = await this.db.$transaction([
			this.db.documentosGrupo.findMany({
				where: { FolderbyGrupoId: id },
				...pagination,
			}),
			this.db.documentosGrupo.count({ where: { FolderbyGrupoId: id } }),
		]);
		return {
			items: items,
			total: total,
		};
	}

	update(id: number, data: any) {
		const { nombre, descripcion, nombreArchivo } = data;
		return this.db.documentosGrupo.update({
			where: { id },
			data: {
				nombre,
				descripcion,
				nombreArchivo,
			},
		});
	}

	remove(id: number) {
		return this.db.documentosGrupo.delete({
			where: { id },
		});
	}
}
