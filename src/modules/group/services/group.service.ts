import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';
import { GroupsFilter } from '../dto/group.filter';
import { ListGroupDto } from '../dto/list-group.dto';

@Injectable()
export class GroupService {
	constructor(private db: SimplePrismaService) { }

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

	async findAll(filter: GroupsFilter) {
		const { where, pagination } = filter;

		const [items, total] = await this.db.$transaction([
			this.db.grupo.findMany({
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
					Actividad: {
						include: {
							Tarea: true,
						},
					},
				},
				...pagination,
			}),
			this.db.grupo.count({ where }),
		]);

		return new ListGroupDto(items, total);
	}

	findOne(id: number) {
		return this.db.grupo.findUnique({
			where: { id },
		});
	}

	async update(id: number, updateGroupDto: any) {
		const { nombre, periodo, mesabosques, participantes } = updateGroupDto;
		const [periodo_inicio, periodo_fin] = periodo || [null, null];

		const grupo = await this.db.grupo.update({
			where: { id },
			data: {
				nombre,
				mesabosques,
				periodo_inicio: periodo_inicio ? new Date(periodo_inicio) : undefined,
				periodo_fin: periodo_fin ? new Date(periodo_fin) : undefined,
				fecha_modifica: new Date(),
			},
		});

		await this.db.tareaUsuario.deleteMany({
			where: {
				grupoId: id,
			},
		});

		if (Array.isArray(participantes) && participantes.length > 0) {
			await Promise.all(
				participantes.map((usuarioId: number) =>
					this.db.tareaUsuario.create({
						data: {
							grupoId: id,
							usuarioId,
						},
					}),
				),
			);
		}

		return grupo;
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
