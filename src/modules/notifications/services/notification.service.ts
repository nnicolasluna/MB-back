import { Injectable, Logger } from '@nestjs/common';
import { NotificationGateway } from '../notification.gateway';

@Injectable()
export class NotificationService {
	private logger = new Logger(NotificationService.name);

	constructor(private readonly notificationGateway: NotificationGateway) {}

	emitJobUpdate(jobId: string | number, status: string) {
		//this.notificationGateway.emitJobUpdate(jobId.toString(), status);
		this.notificationGateway.server.emit(jobId.toString(), { jobId, status });
		this.logger.log(`Emitting job update for job ${jobId}`);
	}
}
