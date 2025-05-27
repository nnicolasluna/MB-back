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
import { MonitoringBurnService } from '../services/monitoring-burn.service';
import { MonitoringBurnEntity } from '../entities/monitoring-burn.entity';
import { FormMonitoringBurnDto } from '../dto/monitoring-burn/form-monitoring-burn.dto';
import { MonitoringBurnFilter } from '../dto/monitoring-burn/monitoring-burn.filter';
import { ListMonitoringBurnDto } from '../dto/monitoring-burn/list-monitoring-burn.dto';
import { StadisticsFilter } from '../dto/stadistics.filter';

const RESOURCE_NAME = [ResourceTypes.MENU_MONITORING];

@Controller('monitoring-burn')
@ApiBearerAuth()
@ApiTags('Monitoring burn')
export class MonitoringBurnController {
	constructor(private readonly service: MonitoringBurnService) {}

	@Get()
	@ApiOperation({ summary: 'Get list of monitoring fire' })
	@ApiOkResponse({ type: ListMonitoringBurnDto })
	@CanRead(RESOURCE_NAME)
	async findAll(@Query() filter: MonitoringBurnFilter) {
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

	@Get('export/:code')
	@ApiOperation({ summary: 'Export Shape to zip for download' })
	@IsPublic()
	async downloadFile(@Param('code') id: string) {
		return this.service.exportShpToZip(id);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get monitoring fire by id' })
	@ApiOkResponse({ type: MonitoringBurnEntity })
	@CanRead(RESOURCE_NAME)
	findOne(@Param('id') id: string) {
		return this.service.findOne(+id);
	}

	@Patch(':code/status')
	@TrackActivity('Log [Actualizó el estado de un monitoreo de cuerpos de agua]')
	@AuditRecord(AuditRecordOperationEnum.UPDATE)
	@ApiOperation({ summary: 'Update status monitoring fire' })
	@ApiOkResponse({ type: Boolean })
	updateStatus(@Param('code') code: string, @Body() dto: AuditFields & { status: string }) {
		return this.service.updateStatus(code, dto);
	}

	@Post()
	@TrackActivity('Log [Creó los datos de un monitoreo de cuerpos de agua]')
	@AuditRecord(AuditRecordOperationEnum.CREATE)
	@ApiOperation({ summary: 'Create monitoring fire' })
	@ApiOkResponse({ type: MonitoringBurnEntity })
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
	create(@UploadedFile() file: Express.Multer.File, @Body() dto: FormMonitoringBurnDto) {
		dto.zipFile = file;
		return this.service.create(dto);
	}

	@Put(':id')
	@TrackActivity('Log [Actualizó los datos de un monitoreo de cuerpos de agua]')
	@AuditRecord(AuditRecordOperationEnum.UPDATE)
	@ApiOperation({ summary: 'Update monitoring fire' })
	@ApiOkResponse({ type: MonitoringBurnEntity })
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
	update(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() dto: FormMonitoringBurnDto) {
		dto.zipFile = file;
		return this.service.update(+id, dto);
	}

	@Delete(':id')
	@TrackActivity('Log [Eliminó los datos de un monitoreo de cuerpos de agua]')
	@AuditRecord(AuditRecordOperationEnum.DELETE)
	@ApiOperation({ summary: 'Delete monitoring fire by id' })
	@ApiOkResponse({ type: Boolean })
	@CanDelete(RESOURCE_NAME)
	delete(@Param('id') id: string, @Body() auditDeleteFields: AuditDeleteFields) {
		return this.service.remove(+id, auditDeleteFields);
	}
}
