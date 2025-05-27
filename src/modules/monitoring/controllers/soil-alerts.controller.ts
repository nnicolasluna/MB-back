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
import { StadisticsFilter } from '../dto/stadistics.filter';
import { SoilAlertsService } from '../services/soil-alerts.service';
import { ListSoilAlertDto } from '../dto/soil-alerts/list-soil-alerts.dto';
import { SoilAlertFilter } from '../dto/soil-alerts/soil-alerts.filter';
import { SoilAlertEntity } from '../entities/soil-alert.entity';
import { FormSoilAlertDto } from '../dto/soil-alerts/form-soil-alerts.dto';

const RESOURCE_NAME = [ResourceTypes.MENU_MONITORING];

@Controller('soil-alerts')
@ApiBearerAuth()
@ApiTags('Soil Alerts')
export class SoilAlertsController {
	constructor(private readonly service: SoilAlertsService) {}

	@Get()
	@ApiOperation({ summary: 'Get list of Soil Alerts' })
	@ApiOkResponse({ type: ListSoilAlertDto })
	@CanRead(RESOURCE_NAME)
	async findAll(@Query() filter: SoilAlertFilter) {
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
	@ApiOperation({ summary: 'Get soil alert by id' })
	@ApiOkResponse({ type: SoilAlertEntity })
	@CanRead(RESOURCE_NAME)
	findOne(@Param('id') id: string) {
		return this.service.findOne(+id);
	}

	@Patch(':code/status')
	@TrackActivity('Log [Actualizó el estado de Alertas de Suelo]')
	@AuditRecord(AuditRecordOperationEnum.UPDATE)
	@ApiOperation({ summary: 'Update status' })
	@ApiOkResponse({ type: Boolean })
	updateStatus(@Param('code') code: string, @Body() dto: AuditFields & { status: string }) {
		return this.service.updateStatus(code, dto);
	}

	@Post()
	@TrackActivity('Log [Creó los datos de una alerta de suelo]')
	@AuditRecord(AuditRecordOperationEnum.CREATE)
	@ApiOperation({ summary: 'Create Alert Soil' })
	@ApiOkResponse({ type: SoilAlertEntity })
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
	create(@UploadedFile() file: Express.Multer.File, @Body() dto: FormSoilAlertDto) {
		dto.zipFile = file;
		return this.service.create(dto);
	}

	@Put(':id')
	@TrackActivity('Log [Actualizó los datos de una alerta de suelo]')
	@AuditRecord(AuditRecordOperationEnum.UPDATE)
	@ApiOperation({ summary: 'Update Alert Soil' })
	@ApiOkResponse({ type: SoilAlertEntity })
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
	update(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() dto: FormSoilAlertDto) {
		dto.zipFile = file;
		return this.service.update(+id, dto);
	}

	@Delete(':id')
	@TrackActivity('Log [Eliminó los datos de una alerta de suelo]')
	@AuditRecord(AuditRecordOperationEnum.DELETE)
	@ApiOperation({ summary: 'Delete Soil Alert' })
	@ApiOkResponse({ type: Boolean })
	@CanDelete(RESOURCE_NAME)
	delete(@Param('id') id: string, @Body() auditDeleteFields: AuditDeleteFields) {
		return this.service.remove(+id, auditDeleteFields);
	}
}
