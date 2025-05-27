import {
	Body,
	Controller,
	Get,
	Logger,
	Param,
	Post,
	Query,
	Res,
	StreamableFile,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CanCreate, IsPublic, TrackActivity } from '@shared/decorators';
import { AttachmentService } from '../services/attachment.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { AttachmentEntity } from '../entities/attachment.entity';
import { AttachmentDto } from '../dto/attachment.dto';
import { ATTACHMENT_FOLDER, Resources } from '@shared/constants';
import { v4 as uuid } from 'uuid';
import { Response } from 'express';

const RESOURCE_NAME = Resources.map((r) => r.code);

@Controller('attachments')
@ApiBearerAuth()
@ApiTags('Attachments')
export class AttachmentController {
	private logger: Logger = new Logger(AttachmentController.name);

	constructor(private readonly service: AttachmentService) {}

	@Post('/upload')
	@ApiOperation({
		summary: 'Upload files',
		requestBody: {
			content: {
				'multipart/form-data': {
					schema: {
						type: 'object',
						properties: {
							files: {
								type: 'array',
								items: {
									type: 'string',
									format: 'binary',
								},
							},
						},
					},
				},
			},
		},
	})
	@TrackActivity('Log [Subió archivos]')
	@ApiOkResponse({ type: [AttachmentEntity] })
	@CanCreate(RESOURCE_NAME)
	@UseInterceptors(
		FilesInterceptor('files[]', 20, {
			storage: diskStorage({
				destination: ATTACHMENT_FOLDER,
				filename(_, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
					const filenameSplit = file.originalname.split('.');
					const fileExt = filenameSplit[filenameSplit.length - 1];
					file['key'] = uuid();
					callback(null, `${file['key']}.${fileExt}`);
				},
			}),
		}),
	)
	async uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Body() body: any): Promise<AttachmentEntity[]> {
		this.logger.log('Uploading attachments...');
		const dto = new AttachmentDto({ files, ...body });
		return this.service.create(dto);
	}

	@IsPublic()
	@Get(':key')
	@ApiOperation({ summary: 'Get File by uuid' })
	@ApiOkResponse({ type: StreamableFile })
	async get(
		@Param('key') key: string,
		@Query('download') download: boolean = false,
		@Res({ passthrough: true }) res: Response,
	) {
		this.logger.log(`Get Attachment ${key}`);
		const attachment = await this.service.getByKey(key);

		res.set({ 'Content-Type': attachment.contentType });
		res.set({ 'Content-Length': attachment.sizeBytes.toString() });

		if (download) res.set({ 'Content-Disposition': `attachment; filename="${attachment.filename}"` });

		const file = createReadStream(attachment.publicUrl);
		return new StreamableFile(file);
	}
}
