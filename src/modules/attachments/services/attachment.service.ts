import { Injectable } from '@nestjs/common';
import { DBConnection } from '@shared/db/prisma';
import { AttachmentDto } from '../dto/attachment.dto';
import { AttachmentEntity } from '../entities/attachment.entity';

@Injectable()
export class AttachmentService {
	constructor(private readonly db: DBConnection) {}

	async create(dto: AttachmentDto) {
		const response: AttachmentEntity[] = [];
		const ids = [];
		const { files, ...rest } = dto;
		for (const file of files) {
			const newAttachment = new AttachmentEntity({
				filename: file.originalname,
				contentType: file.mimetype,
				publicUrl: file.path,
				sizeBytes: file.size,
				...rest,
			});

			const storedData = await this.db.attachment.create({
				data: newAttachment,
			});

			ids.push(storedData.id);
			response.push(storedData);
		}

		return response;
	}

	async getByKey(key: string) {
		return this.db.attachment.findUnique({
			where: { uuid: key },
		});
	}
}
