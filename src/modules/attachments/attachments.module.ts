import { Module } from '@nestjs/common';
import { AttachmentController } from './controllers/attachment.controller';
import { AttachmentService } from './services/attachment.service';

@Module({
	imports: [],
	exports: [AttachmentService],
	providers: [AttachmentService],
	controllers: [AttachmentController],
})
export class AttachmentsModule {}
