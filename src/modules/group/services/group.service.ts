import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';

@Injectable()
export class GroupService {
	constructor(private db: SimplePrismaService) {}

	async create(createGroupDto: any) {
		console.log(createGroupDto);
		const [periodo_inicio, periodo_fin] = createGroupDto.periodo;

		const grupo = await this.db.grupo.create({
			data: {
				nombre: createGroupDto.nombre,
				periodo_inicio: new Date(periodo_inicio),
				periodo_fin: new Date(periodo_fin),
				mesabosques: createGroupDto.mesabosques,
			},
		});

		const participantes = createGroupDto.participantes ?? [];

		await Promise.all(
			participantes.map((usuarioId: number) =>
				this.db.tareaUsuario.create({
					data: {
						grupoId: grupo.id,
						usuarioId: usuarioId,
					},
				}),
			),
		);

		return grupo;
	}

	async findAll() {
		const grupos = await this.db.grupo.findMany({
			include: {
				TareaUsuario: {
					include: {
						usuario: {
							select: {
								id: true,
								name: true,
								firstSurname: true,
								secondSurname: true,
							},
						},
					},
				},
			},
		});

		return {
			items: grupos,
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
