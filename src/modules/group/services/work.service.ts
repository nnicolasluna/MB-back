import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';

@Injectable()
export class WorkService {
	constructor(private db: SimplePrismaService) {}

	create(createDto: any) {
		return this.db.reuniones.create({
			data: {
				nombreReunion: createDto.nombreReunion,
				fechaReunion: createDto.fechaReunion,
				modalidad: createDto.modalidad,
				fechaSegundaReunion: createDto.fechaSegundaReunion,
				link: createDto.link,
				grupoId: createDto.grupoId,
			},
		});
	}

	async findAll() {
		const reuniones = await this.db.reuniones.findMany();

		return {
			items: reuniones,
			total: reuniones.length,
		};
	}

	findOne(id: number) {
		return this.db.reuniones.findUnique({
			where: {
				id,
			},
		});
	}
	async findByGrupoId(grupoId: number) {
		const work = await this.db.reuniones.findMany({
			where: {
				grupoId: grupoId,
			},
		});
		return {
			items: work,
			total: work.length,
		};
	}
	update(id: number, updateDto: any) {
		return this.db.reuniones.update({
			where: { id },
			data: {
				nombreReunion: updateDto.nombreReunion,
				fechaReunion: updateDto.fechaReunion ? new Date(updateDto.fechaReunion) : undefined,
				fechaSegundaReunion: updateDto.fechaSegundaReunion ? new Date(updateDto.fechaSegundaReunion) : undefined,
				grupoId: updateDto.grupoid,
			},
		});
	}

	remove(id: number) {
		return this.db.reuniones.delete({
			where: { id },
		});
	}

	private formatDate(date: Date): string {
		return new Intl.DateTimeFormat('es-BO').format(date);
	}
}
