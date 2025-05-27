export class AttachmentDto {
	files: Express.Multer.File[];

	constructor(partial: Partial<AttachmentDto>) {
		Object.assign(this, partial);
	}
}
