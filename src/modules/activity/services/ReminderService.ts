import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { addDays, differenceInDays, format } from 'date-fns';
import { SimplePrismaService } from '@shared/db/prisma.simple';
import { EmailService } from '@shared/services/email/email.service';

@Injectable()
export class ReminderService {
	private readonly logger = new Logger(ReminderService.name);

	constructor(
		private readonly db: SimplePrismaService,
		private readonly emailService: EmailService,
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_8AM)
	async checkDeadlines() {
		this.logger.log('Revisando fechas programadas...');

		try {
			const hoy = new Date();

			const diasParaRecordar = [5, 4];

			for (const dias of diasParaRecordar) {
				const fechaObjetivo = addDays(hoy, dias);

				const fechaInicio = new Date(fechaObjetivo);
				fechaInicio.setHours(0, 0, 0, 0);

				const fechaFin = new Date(fechaObjetivo);
				fechaFin.setHours(23, 59, 59, 999);

				// Buscar fechas programadas que sean dentro de X días exactos
				const fechas = await this.db.fechaProgramada.findMany({
					where: {
						fechaHora: {
							gte: fechaInicio,
							lt: fechaFin,
						},
						// Opcional: evitar enviar el mismo recordatorio múltiples veces
						// recordatorioEnviado: false
					},
					include: {
						Tarea: {
							include: {
								usuario: true, // para obtener email y nombre
							},
						},
					},
				});

				for (const f of fechas) {
					const responsable = f.Tarea.usuario;
					if (!responsable?.email) continue;

					try {
						// Formatear la fecha en español
						const fechaFormateada = format(f.fechaHora, "dd 'de' MMMM 'de' yyyy");

						// Determinar urgencia del mensaje
						let urgencia = '';
						if (dias === 1) urgencia = '¡URGENTE! ';
						else if (dias === 3) urgencia = '¡IMPORTANTE! ';

						await this.emailService.sendEmail(
							responsable.email,
							`${urgencia}Recordatorio: tarea "${f.Tarea.nombre}" vence ${dias === 1 ? 'mañana' : `en ${dias} días`}`,
							`Hola ${responsable.name}, recuerda que la tarea "${f.Tarea.nombre}" vence el ${fechaFormateada}.`,
							'reminder-task', // Usar la plantilla
							{
								name: responsable.name,
								tarea: f.Tarea.nombre,
								fecha: fechaFormateada,
								diasRestantes: dias,
								mainColor: this.emailService.mainColor, // Usar el color del servicio
								logo: this.emailService.logoUrl, // Usar el logo del servicio
								sistemaUrl: this.emailService.clientUrl, // URL del sistema
							},
						);

						// Opcional: marcar como enviado para evitar duplicados
						// await this.db.fechaProgramada.update({
						//   where: { id: f.id },
						//   data: { recordatorioEnviado: true }
						// });

						this.logger.log(`Recordatorio enviado a ${responsable.email} para tarea que vence en ${dias} días`);
					} catch (emailError) {
						this.logger.error(`Error enviando correo a ${responsable.email}: ${emailError.message}`);
					}
				}

				if (fechas.length > 0) {
					this.logger.log(`Se procesaron ${fechas.length} tareas que vencen en ${dias} días`);
				}
			}
		} catch (error) {
			this.logger.error(`Error en checkDeadlines: ${error.message}`);
		}
	}
}
