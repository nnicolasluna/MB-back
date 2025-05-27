import { MapUploadStatus } from '@modules/map-data/lib/constants';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationGateway } from '../notification.gateway';

@Injectable()
export class MapNotificationService {
	private logger = new Logger(MapNotificationService.name);

	constructor(private readonly notificationGateway: NotificationGateway) {}

	private emitProgress(mapCode: string, progress: MapUploadStatus) {
		this.logger.verbose(`Emitting progress for map ${mapCode}: ${progress}`);
		this.notificationGateway.server.emit(mapCode, { mapCode, progress });
	}

	public emitComplete(mapCode: string) {
		this.emitProgress(mapCode, MapUploadStatus.COMPLETED);
	}

	public emitFailed(mapCode: string) {
		this.emitProgress(mapCode, MapUploadStatus.FAILED);
	}

	public emitDecompression(mapCode: string) {
		this.emitProgress(mapCode, MapUploadStatus.DECOMPRESSION);
	}

	public emitProcessing(mapCode: string) {
		this.emitProgress(mapCode, MapUploadStatus.PROCESSING);
	}
}
