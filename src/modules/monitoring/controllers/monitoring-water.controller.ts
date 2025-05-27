import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditRecord, CanCreate, CanDelete, CanRead, CanUpdate, IsPublic, TrackActivity } from '@shared/decorators';
import { ResourceTypes, UPLOAD_FOLDER } from '@shared/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuditRecordOperationEnum } from '@shared/interceptors';
import { AuditDeleteFields, AuditFields } from '@shared/interfaces';
import { MonitoringWaterService } from '../services/monitoring-water.service';
import { MonitoringWaterEntity } from '../entities/monitoring-water.entity';
import { FormMonitoringWaterDto } from '../dto/monitoring-water/form-monitoring-water.dto';
import { MonitoringWaterFilter } from '../dto/monitoring-water/monitoring-water.filter';
import { ListMonitoringWaterDto } from '../dto/monitoring-water/list-monitoring-water.dto';
import { StadisticsFilter } from '../dto/stadistics.filter';

const RESOURCE_NAME = [ResourceTypes.MENU_MONITORING];

@Controller('monitoring-water')
@ApiBearerAuth()
@ApiTags('Monitoring Water')
export class MonitoringWaterController {
	constructor(private readonly service: MonitoringWaterService) {}

	@Get()
	@ApiOperation({ summary: 'Get list of monitoring water' })
	@ApiOkResponse({ type: ListMonitoringWaterDto })
	@CanRead(RESOURCE_NAME)
	async findAll(@Query() filter: MonitoringWaterFilter) {
		return this.service.findAll(filter);
	}

	// @Get('public/data')
	// @ApiOperation({ summary: 'Get public coverage data' })
	// @IsPublic()
	// async findLayerData(@Query() dto: GetLayerData) {
	// 	return this.service.findLayerData(dto);
	// }

	@Get('stadistics')
	@ApiOperation({ summary: 'Get stadistics' })
	// @ApiOkResponse
	@IsPublic()
	async getStadistics(@Query() q: StadisticsFilter) {
		return this.service.getStadistics(q);
	}

	@Get('difference/:m1/:m2')
	@ApiOperation({ summary: 'Get stadistics' })
	// @ApiOkResponse
	@IsPublic()
	async getSymDifference(@Param('m1') uuid1: string, @Param('m2') uuid2: string) {
		return this.service.getSymDifference(uuid1, uuid2);
	}

	@Get('resume-years')
	@ApiOperation({ summary: 'Get stadistics' })
	// @ApiOkResponse
	@IsPublic()
	async getResumeYears() {
		return this.service.getResumeYears();
	}

	@Get('export/:code')
	@ApiOperation({ summary: 'Export Shape to zip for download' })
	@IsPublic()
	async downloadFile(@Param('code') id: string) {
		return this.service.exportShpToZip(id);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get monitoring water by id' })
	@ApiOkResponse({ type: MonitoringWaterEntity })
	@CanRead(RESOURCE_NAME)
	findOne(@Param('id') id: string) {
		return this.service.findOne(+id);
	}

	@Patch(':code/status')
	@TrackActivity('Log [Actualizó el estado de un monitoreo de cuerpos de agua]')
	@AuditRecord(AuditRecordOperationEnum.UPDATE)
	@ApiOperation({ summary: 'Update status monitoring water' })
	@ApiOkResponse({ type: Boolean })
	updateStatus(@Param('code') code: string, @Body() dto: AuditFields & { status: string }) {
		return this.service.updateStatus(code, dto);
	}

	@Post()
	@TrackActivity('Log [Creó los datos de un monitoreo de cuerpos de agua]')
	@AuditRecord(AuditRecordOperationEnum.CREATE)
	@ApiOperation({ summary: 'Create monitoring water' })
	@ApiOkResponse({ type: MonitoringWaterEntity })
	@CanCreate(RESOURCE_NAME)
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: UPLOAD_FOLDER,
				filename: (_req, file, cb) => {
					cb(null, Date.now() + file.originalname);
				},
			}),
		}),
	)
	create(@UploadedFile() file: Express.Multer.File, @Body() dto: FormMonitoringWaterDto) {
		dto.zipFile = file;
		return this.service.create(dto);
	}

	@Put(':id')
	@TrackActivity('Log [Actualizó los datos de un monitoreo de cuerpos de agua]')
	@AuditRecord(AuditRecordOperationEnum.UPDATE)
	@ApiOperation({ summary: 'Update monitoring water' })
	@ApiOkResponse({ type: MonitoringWaterEntity })
	@CanUpdate(RESOURCE_NAME)
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: UPLOAD_FOLDER,
				filename: (_req, file, cb) => {
					cb(null, Date.now() + file.originalname);
				},
			}),
		}),
	)
	update(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() dto: FormMonitoringWaterDto) {
		dto.zipFile = file;
		return this.service.update(+id, dto);
	}

	@Delete(':id')
	@TrackActivity('Log [Eliminó los datos de un monitoreo de cuerpos de agua]')
	@AuditRecord(AuditRecordOperationEnum.DELETE)
	@ApiOperation({ summary: 'Delete monitoring water by id' })
	@ApiOkResponse({ type: Boolean })
	@CanDelete(RESOURCE_NAME)
	delete(@Param('id') id: string, @Body() auditDeleteFields: AuditDeleteFields) {
		return this.service.remove(+id, auditDeleteFields);
	}
}
