import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';
import { workingFilter } from '../dto/working.filter';

@Injectable()
export class WorkingService {
	constructor(private db: SimplePrismaService) {}

	async create(createGroupDto: any) {
		const { nombre, descripcion, nombreArchivo, grupoId } = createGroupDto;

		const grupo = await this.db.documentosGrupo.create({
			data: {
				nombre,
				descripcion,
				nombreArchivo,
				grupo: {
					connect: {
						id: grupoId,
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
				where: { grupoId: id },
				...pagination,
			}),
			this.db.documentosGrupo.count({ where: { grupoId: id } }),
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

	private formatDate(date: Date): string {
		return new Intl.DateTimeFormat('es-BO').format(date);
	}
}
