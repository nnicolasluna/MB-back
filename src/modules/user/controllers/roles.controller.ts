import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBasicAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResourceTypes } from 'src/shared/constants';
import { AuditRecord, CanCreate, CanDelete, CanRead, CanUpdate, TrackActivity } from 'src/shared/decorators';
import { AuditDeleteFields, ExistsQuery } from 'src/shared/interfaces';
import { AuditRecordOperationEnum } from 'src/shared/interceptors';
import { RoleEntity } from '../entities/role.entity';
import { ListRoleDto } from '../dto/role/list-role.dto';
import { RolesFilter } from '../dto/role/role.filter';
import { FormRoleDto } from '../dto/role/form-role.dto';
import { RoleService } from '../services/role.service';

const RESOURCE_NAME = [ResourceTypes.ROLES, ResourceTypes.USERS, ResourceTypes.SYSTEM_PERMISSIONS];

@Controller('roles')
@ApiBasicAuth()
@ApiTags('Roles')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Get()
	@ApiOperation({ summary: 'Get all roles' })
	@ApiOkResponse({ type: ListRoleDto })
	@CanRead(RESOURCE_NAME)
	findAll(@Query() filter: RolesFilter) {
		return this.roleService.findAll(filter);
	}

	@Get('exists')
	@ApiOperation({ summary: 'Check if role exists' })
	@ApiOkResponse({ type: Boolean })
	@CanRead(RESOURCE_NAME)
	async checkIfExists(@Query() existsQuery: ExistsQuery) {
		return this.roleService.checkIfExists(existsQuery);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get role by id' })
	@ApiOkResponse({ type: RoleEntity })
	@CanRead(RESOURCE_NAME)
	findOne(@Param('id') id: string) {
		return this.roleService.findOne(+id);
	}

	@Post()
	@TrackActivity('Log [Creó un rol]')
	@AuditRecord(AuditRecordOperationEnum.CREATE)
	@ApiOperation({ summary: 'Create role' })
	@ApiOkResponse({ type: RoleEntity })
	@CanCreate(RESOURCE_NAME)
	create(@Body() formRoleDto: FormRoleDto) {
		return this.roleService.create(formRoleDto);
	}

	@Put(':id')
	@TrackActivity('Log [Actualizó un rol]')
	@AuditRecord(AuditRecordOperationEnum.UPDATE)
	@ApiOperation({ summary: 'Update role' })
	@ApiOkResponse({ type: RoleEntity })
	@CanUpdate(RESOURCE_NAME)
	update(@Param('id') id: string, @Body() formRoleDto: FormRoleDto) {
		return this.roleService.update(+id, formRoleDto);
	}

	@Delete(':id')
	@TrackActivity('Log [Eliminó un rol]')
	@AuditRecord(AuditRecordOperationEnum.DELETE)
	@ApiOperation({ summary: 'Delete role' })
	@ApiOkResponse({ type: Boolean })
	@CanDelete(RESOURCE_NAME)
	delete(@Param('id') id: string, @Body() auditDeleteFields: AuditDeleteFields) {
		return this.roleService.delete(+id, auditDeleteFields);
	}
}
