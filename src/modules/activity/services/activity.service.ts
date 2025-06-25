import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';

@Injectable()
export class ActivityService {
	constructor(private db: SimplePrismaService) {}

	async create(data: any) {
		const actividad = await this.db.actividad.create({
			data: {
				nombre: data.actividad.actividad,
				tipo: data.actividad.TipoActividad.name,
				grupo: {
					connect: { id: data.actividad.grupo.id },
				},
			},
		});

		for (const tarea of data.tareas ?? []) {
			const nuevaTarea = await this.db.tarea.create({
				data: {
					nombre: tarea.tarea,
					resultado: tarea.resultado,
					responsableId: tarea.responsable.id,
					actividadId: actividad.id,
				},
			});

			for (const fecha of tarea.fechas ?? []) {
				await this.db.fechaProgramada.create({
					data: {
						fechaHora: new Date(fecha),
						tareaId: nuevaTarea.id,
					},
				});
			}
		}

		return { message: 'Actividad y tareas creadas correctamente' };
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
