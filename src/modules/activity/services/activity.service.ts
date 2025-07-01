import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';

@Injectable()
export class ActivityService {
	constructor(private db: SimplePrismaService) { }

	async create(data: any) {
		const actividad = await this.db.actividad.create({
			data: {
				nombre: data.actividad.actividad,
				tipo: data.actividad.TipoActividad?.name ?? null,
				grupo: {
					connect: { id: data.actividad.grupo },
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
	async update(id: number, data: any) {
		// Actualizamos la actividad
		const actividad = await this.db.actividad.update({
			where: { id },
			data: {
				nombre: data.actividad.actividad,
				tipo: data.actividad.TipoActividad?.name ?? null,
				grupo: {
					connect: { id: data.actividad.grupo },
				},
			},
		});

		// Obtener tareas actuales en la base de datos
		const tareasExistentes = await this.db.tarea.findMany({
			where: { actividadId: id },
			select: { id: true },
		});

		const idsTareasEnviadas = (data.tareas ?? []).filter(t => t.id).map(t => t.id);

		// Eliminar tareas que ya no están
		const tareasAEliminar = tareasExistentes.filter(
			t => !idsTareasEnviadas.includes(t.id)
		);

		for (const tarea of tareasAEliminar) {
			await this.db.fechaProgramada.deleteMany({ where: { tareaId: tarea.id } });
			await this.db.tarea.delete({ where: { id: tarea.id } });
		}

		// Procesar tareas nuevas y actualizadas
		for (const tarea of data.tareas ?? []) {
			let tareaActualizada;

			if (tarea.id) {
				// Actualizar tarea existente
				tareaActualizada = await this.db.tarea.update({
					where: { id: tarea.id },
					data: {
						nombre: tarea.tarea,
						resultado: tarea.resultado,
						responsableId: tarea.responsable.id,
					},
				});

				// Eliminar fechas anteriores
				await this.db.fechaProgramada.deleteMany({
					where: { tareaId: tarea.id },
				});
			} else {
				// Crear nueva tarea
				tareaActualizada = await this.db.tarea.create({
					data: {
						nombre: tarea.tarea,
						resultado: tarea.resultado,
						responsableId: tarea.responsable.id,
						actividadId: actividad.id,
					},
				});
			}

			// Agregar nuevas fechas
			for (const fecha of tarea.fechas ?? []) {
				if (fecha) {
					await this.db.fechaProgramada.create({
						data: {
							fechaHora: new Date(fecha),
							tareaId: tareaActualizada.id,
						},
					});
				}
			}
		}

		return { message: 'Actividad y tareas actualizadas correctamente' };
	}

	async findAll() {
		const data = await this.db.actividad.findMany({
			include: {
				grupo: true,
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

	async findOne(id: number) {
		const data = await this.db.actividad.findMany({
			where: {
				grupoId: id,
			},
			include: {
				grupo: {
					include: {
						TareaUsuario: {
							include: {
								usuario: {
									select: {
										name: true,
										firstSurname: true,
										secondSurname: true,
									},
								},
							},
						},
					},
				},
				Tarea: {
					include: {
						FechaProgramada: true,
						usuario: {
							select: {
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
			items: data,
			total: data.length,
		};
	}

	updateacta(id: number, updateDto: any) {
		return this.db.tarea.update({
			where: { id },
			data: {
				acta: updateDto.acta,
			},
		});
	}
	updatelista(id: number, updateDto: any) {
		return this.db.tarea.update({
			where: { id },
			data: {
				listParty: updateDto.acta,
			},
		});
	}
	remove(id: number) {
		return this.db.actividad.delete({
			where: { id },
		});
	}
	async findAllFechas() {
		const data = await this.db.fechaProgramada.findMany({
			include: {
				Tarea: {
					include: {
						Actividad: {
							include: {
								grupo: true,
							},
						},
					},
				},
			},
		});

		return {
			items: data,
			total: data.length,
		};
	}
}
