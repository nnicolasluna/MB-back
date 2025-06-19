import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';

@Injectable()
export class GroupService {
	constructor(private db: SimplePrismaService) {}

	create(createGroupDto: any) {
		const [periodo_inicio, periodo_fin] = createGroupDto.periodo;
		return this.db.grupo.create({
			data: {
				nombre: createGroupDto.nombre,
				periodo_inicio: new Date(periodo_inicio),
				periodo_fin: new Date(periodo_fin),
			},
		});
	}

	async findAll() {
		/* return this.db.grupo.findMany(); */
		const grupos = await this.db.grupo.findMany();

		return {
			items: grupos, // mantiene los campos tal cual: id, nombre, periodo_inicio, periodo_fin
			total: grupos.length,
		};
	}

	findOne(id: number) {
		return this.db.grupo.findUnique({
			where: { id },
		});
	}

	update(id: number, updateGroupDto: any) {
		const { nombre, periodo } = updateGroupDto;
		const [periodo_inicio, periodo_fin] = periodo || [null, null];

		return this.db.grupo.update({
			where: { id },
			data: {
				nombre,
				periodo_inicio: periodo_inicio ? new Date(periodo_inicio) : undefined,
				periodo_fin: periodo_fin ? new Date(periodo_fin) : undefined,
				fecha_modifica: new Date(),
			},
		});
	}

	remove(id: number) {
		return this.db.grupo.delete({
			where: { id },
		});
	}

	private formatDate(date: Date): string {
		return new Intl.DateTimeFormat('es-BO').format(date);
	}
}
