import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Attachment } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AttachmentEntity implements Attachment {
	@ApiProperty({ type: 'string', description: 'Key of the file' })
	uuid: string;

	@ApiProperty({ type: 'number', description: 'ID of the file' })
	id: number;

	@ApiProperty({ type: 'string', description: 'Original name of the file' })
	filename: string;

	@ApiProperty({ type: 'string', description: 'MIME type of the file' })
	contentType: string;

	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	publicUrl: string;

	@ApiProperty({ type: 'number', description: 'Size of the file in bytes' })
	sizeBytes: number;

	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	state: boolean;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	idCreatedBy: number;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	createdDate: Date;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	updatedDate: Date;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	idUpdatedBy: number;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	idDeletedBy: number;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	deletedDate: Date;

	constructor(partial: Partial<AttachmentEntity>) {
		Object.assign(this, partial);
	}
}
