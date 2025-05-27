import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResourceTypes } from '@shared/constants';
import { AuditRecord, CanCreate, CanDelete, CanRead, CanUpdate, TrackActivity } from '@shared/decorators';
import { StyleService } from '../services/style.service';
import { StyleFilter } from '../dto/style/style.filter';
import { ListStyleDto } from '../dto/style/list-style.dto';
import { AuditRecordOperationEnum } from '@shared/interceptors';
import { StyleEntity } from '../entities/style.entity';
import { FormStyleDto } from '../dto/style/form-style.dto';
import { AuditDeleteFields, ExistsQuery } from '@shared/interfaces';

const RESOURCE_NAME = [ResourceTypes.CARTOGRAPHIC_STYLES, ResourceTypes.CARTOGRAPHIC_RESOURCES];

@ApiTags('Cartographic styles')
@ApiBearerAuth()
@Controller('map-styles')
export class MapStylesController {
	constructor(private readonly mapStylesServices: StyleService) {}

	@Get()
	@ApiOperation({ summary: 'Get list of styles' })
	@ApiOkResponse({ type: ListStyleDto })
	@CanRead(RESOURCE_NAME)
	async findAll(@Query() filter: StyleFilter) {
		return this.mapStylesServices.findAll(filter);
	}

	@Get('exists')
	@ApiOperation({ summary: 'Check if style exists' })
	@ApiOkResponse({ type: Boolean })
	@CanRead(RESOURCE_NAME)
	async checkIfExists(@Query() existsQuery: ExistsQuery) {
		return this.mapStylesServices.checkIfExists(existsQuery);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get style by id' })
	@ApiOkResponse({ type: StyleEntity })
	@CanRead(RESOURCE_NAME)
	findOne(@Param('id') id: string) {
		return this.mapStylesServices.findOne(+id);
	}

	@Post()
	@TrackActivity('Log [Creó un estilo de mapa]')
	@AuditRecord(AuditRecordOperationEnum.CREATE)
	@ApiOperation({ summary: 'Create style' })
	@ApiOkResponse({ type: StyleEntity })
	@CanCreate(RESOURCE_NAME)
	create(@Body() dto: FormStyleDto) {
		return this.mapStylesServices.create(dto);
	}

	@Put(':id')
	@TrackActivity('Log [Actualizó un estilo]')
	@AuditRecord(AuditRecordOperationEnum.UPDATE)
	@ApiOperation({ summary: 'Update style' })
	@ApiOkResponse({ type: StyleEntity })
	@CanUpdate(RESOURCE_NAME)
	update(@Param('id') id: string, @Body() dto: FormStyleDto) {
		return this.mapStylesServices.update(+id, dto);
	}

	@Delete(':id')
	@TrackActivity('Log [Eliminó un estilo]')
	@AuditRecord(AuditRecordOperationEnum.DELETE)
	@ApiOperation({ summary: 'Delete style by id' })
	@ApiOkResponse({ type: Boolean })
	@CanDelete(RESOURCE_NAME)
	delete(@Param('id') id: string, @Body() auditDeleteFields: AuditDeleteFields) {
		return this.mapStylesServices.delete(+id, auditDeleteFields);
	}
}
