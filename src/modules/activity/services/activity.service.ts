import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';

@Injectable()
export class ActivityService {
	constructor(private db: SimplePrismaService) { }

	async create(data: any) {
		const { actividad, tareas } = data;

		// 1. Crear Actividad
		const nuevaActividad = await this.db.actividad.create({
			data: {
				nombre: actividad.actividad,
				tipo: actividad.TipoActividad.name,
				grupoId: tareas[0].grupo.id,
			},
		});

		// 2. Crear las tareas asociadas
		for (const t of tareas) {
			const nuevaTarea = await this.db.tarea.create({
				data: {
					nombre: t.tarea,
					resultado: t.resultado,
					actividadId: nuevaActividad.id,
					responsableId: t.responsable.id,
				},
			});

			// 3. Crear fechas programadas
			await this.db.fechaProgramada.createMany({
				data: t.fechas.map((fecha) => ({
					fechaHora: new Date(fecha),
					tareaId: nuevaTarea.id,
				})),
			});

			// 4. Participantes (TareaUsuario)
			await this.db.tareaUsuario.createMany({
				data: t.participantes.map((p) => ({
					usuarioId: p.id,
					tareaId: nuevaTarea.id,
				})),
			});
		}

		return { message: 'Actividad y tareas registradas con éxito' };
	}
	async findAll() {
		const data = await this.db.actividad.findMany({
			include: {
				Tarea: {
					include: {
						FechaProgramada: true,
					},
				},
			},
		});
		return {
			items: data,
			total: data.length,
		};
	}

	findOne(id: number) {
		return `This action returns a #${id} activity`;
	}

	update(id: number, updateActivityDto: any) {
		return updateActivityDto;
	}

	remove(id: number) {
		return `This action removes a #${id} activity`;
	}
}
