import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { MapDataService } from '../services/map-data.service';
import { AuditRecord, CanCreate, CanDelete, CanRead, CanUpdate, IsPublic, TrackActivity } from '@shared/decorators';
import { ResourceTypes, UPLOAD_FOLDER } from '@shared/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MapDataFilter } from '../dto/map-data/map-data.filter';
import { ListMapDataDto } from '../dto/map-data/list-map-data.dto';
import { MapDataEntity } from '../entities/map-data.entity';
import { AuditRecordOperationEnum } from '@shared/interceptors';
import { FormMapDataDto } from '../dto/map-data/form-map-data.dto';
import { AuditDeleteFields } from '@shared/interfaces';
import { GetLayerData } from '../dto/map-data/get-map-data.dto';

const RESOURCE_NAME = [ResourceTypes.CARTOGRAPHIC_RESOURCES, ResourceTypes.CARTOGRAPHIC_STYLES];

@Controller('map-data')
@ApiSecurity('basic')
@ApiTags('Cartographic data')
export class MapDataController {
	constructor(private readonly mapDataService: MapDataService) {}

	@Get()
	@ApiOperation({ summary: 'Get list of map data' })
	@ApiOkResponse({ type: ListMapDataDto })
	@CanRead(RESOURCE_NAME)
	async findAll(@Query() filter: MapDataFilter) {
		return this.mapDataService.findAll(filter);
	}

	@Get('public')
	@ApiOperation({ summary: 'Get list of public map data' })
	@ApiOkResponse({ type: ListMapDataDto })
	@IsPublic()
	async findAllPublic(@Query() filter: MapDataFilter) {
		filter.isPublic = true;
		return this.mapDataService.findAll(filter);
	}

	@Get('public/data')
	@ApiOperation({ summary: 'Get public map data' })
	// @ApiOkResponse({ type: ListMapDataDto })
	@IsPublic()
	async findLayerData(@Query() dto: GetLayerData) {
		return this.mapDataService.findLayerData(dto);
	}

	@Get('export/:code')
	@ApiOperation({ summary: 'Export Shape to zip for download' })
	@CanRead(RESOURCE_NAME)
	async downloadFile(@Param('code') id: string) {
		return this.mapDataService.exportShpToZip(id);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get map data by id' })
	@ApiOkResponse({ type: MapDataEntity })
	@CanRead(RESOURCE_NAME)
	findOne(@Param('id') id: string) {
		return this.mapDataService.findOne(+id);
	}

	@Post()
	@TrackActivity('Log [Creó los datos de un mapa]')
	@AuditRecord(AuditRecordOperationEnum.CREATE)
	@ApiOperation({ summary: 'Create map data' })
	@ApiOkResponse({ type: MapDataEntity })
	@CanCreate(RESOURCE_NAME)
	create(@Body() dto: FormMapDataDto) {
		return this.mapDataService.create(dto);
	}

	@Put(':id')
	@TrackActivity('Log [Actualizó los datos de un mapa]')
	@AuditRecord(AuditRecordOperationEnum.UPDATE)
	@ApiOperation({ summary: 'Update map data' })
	@ApiOkResponse({ type: MapDataEntity })
	@CanUpdate(RESOURCE_NAME)
	update(@Param('id') id: string, @Body() dto: FormMapDataDto) {
		return this.mapDataService.update(+id, dto);
	}

	@Post('upload')
	@ApiOperation({ summary: 'Upload map zip file' })
	@TrackActivity('Log [Subió un archivo de mapa]')
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
	async uploadMap(@UploadedFile() file: Express.Multer.File, @Body() body: { uuid: string }) {
		return this.mapDataService.uploadMap(body.uuid, file);
	}

	@Delete(':id')
	@TrackActivity('Log [Eliminó los datos de un mapa]')
	@AuditRecord(AuditRecordOperationEnum.DELETE)
	@ApiOperation({ summary: 'Delete map data by id' })
	@ApiOkResponse({ type: Boolean })
	@CanDelete(RESOURCE_NAME)
	delete(@Param('id') id: string, @Body() auditDeleteFields: AuditDeleteFields) {
		return this.mapDataService.remove(+id, auditDeleteFields);
	}

	@Delete('satellite-image/:id')
	@TrackActivity('Log [Eliminación de capa]')
	@AuditRecord(AuditRecordOperationEnum.DELETE)
	@ApiOperation({
		summary: 'Delete image satellite',
	})
	@CanDelete(RESOURCE_NAME)
	removeSatellite(@Param('id') id: string, @Body() body: any) {
		return this.mapDataService.removeSatellite(+id, body);
	}

	@Post('upload-satellite-image')
	@CanCreate(RESOURCE_NAME)
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: UPLOAD_FOLDER,
				filename: (_, file, cb) => {
					cb(null, Date.now() + file.originalname);
				},
			}),
		}),
	)
	async uploadSatelliteImage(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
		try {
			await this.mapDataService.importGeoTiff(Number(body.id), file.filename);

			return {
				success: true,
				message: 'Se subio correctamente el archivo tiff',
			};
		} catch (error) {
			return {
				success: false,
				message: 'Error al subir el archivo tiff',
			};
		}
	}
}
