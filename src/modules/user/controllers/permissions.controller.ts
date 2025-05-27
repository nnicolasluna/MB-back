import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBasicAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResourceTypes } from 'src/shared/constants';
import { AuditRecord, CanCreate, CanDelete, CanRead, CanUpdate, TrackActivity } from 'src/shared/decorators';
import { AuditRecordOperationEnum } from 'src/shared/interceptors';
import { PermissionService } from '../services/permission.service';
import { ListPermissionDto } from '../dto/permission/list-permission.dto';
import { PermissionsFilter } from '../dto/permission/permission.filter';
import { PermissionResponse } from '../dto/permission/permission-response.dto';
import { FormPermissionDto } from '../dto/permission/form-permission.dto';
import { ResourceEntity } from '../entities/resource.entity';

const RESOURCE_NAME = [ResourceTypes.SYSTEM_PERMISSIONS];

@Controller('permissions')
@ApiBasicAuth()
@ApiTags('Permissions')
export class PermissionController {
	constructor(private readonly permissionService: PermissionService) {}

	@Get()
	@ApiOperation({ summary: 'Get all permissions' })
	@ApiOkResponse({ type: ListPermissionDto })
	@CanRead(RESOURCE_NAME)
	findAll(@Query() filter: PermissionsFilter) {
		return this.permissionService.findAll(filter);
	}

	@Get('resources')
	@ApiOperation({ summary: 'Get all resources' })
	@ApiOkResponse({ type: ResourceEntity, isArray: true })
	@CanRead(RESOURCE_NAME)
	findAllResources(@Query('idRole') idRole: number) {
		return this.permissionService.findAllResources(idRole);
	}

	@Get(':roleId/:resourceId')
	@ApiOperation({ summary: 'Get permission by id role and resource id' })
	@ApiOkResponse({ type: PermissionResponse })
	@CanRead(RESOURCE_NAME)
	findOne(@Param('roleId') roleId: string, @Param('resourceId') resourceId: string) {
		return this.permissionService.findOne(+roleId, +resourceId);
	}

	@Post()
	@TrackActivity('Log [Creó un permiso]')
	@AuditRecord(AuditRecordOperationEnum.CREATE)
	@ApiOperation({ summary: 'Create role' })
	@ApiOkResponse({ type: PermissionResponse })
	@CanCreate(RESOURCE_NAME)
	create(@Body() formRoleDto: FormPermissionDto) {
		return this.permissionService.create(formRoleDto);
	}

	@Put()
	@TrackActivity('Log [Actualizó un permission]')
	@AuditRecord(AuditRecordOperationEnum.UPDATE)
	@ApiOperation({ summary: 'Update permission' })
	@ApiOkResponse({ type: PermissionResponse })
	@CanUpdate(RESOURCE_NAME)
	update(@Body() formRoleDto: FormPermissionDto) {
		return this.permissionService.update(formRoleDto);
	}

	@Delete(':roleId/:resourceId')
	@TrackActivity('Log [Eliminó un permiso]')
	@ApiOperation({ summary: 'Delete permission' })
	@ApiOkResponse({ type: Boolean })
	@CanDelete(RESOURCE_NAME)
	delete(@Param('roleId') roleId: string, @Param('resourceId') resourceId: string) {
		return this.permissionService.delete(+roleId, +resourceId);
	}
}
