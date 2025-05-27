import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResourceTypes } from 'src/shared/constants';
import { UserService } from '../services/user.service';
import { AuditRecord, CanCreate, CanDelete, CanRead, CanUpdate, TrackActivity } from 'src/shared/decorators';
import { UsersFilter } from '../dto/user/user.filter';
import { FormUserDto } from '../dto/user/form-user.dto';
import { ListUserDto } from '../dto/user/list-user.dto';
import { AuditDeleteFields, ExistsQuery } from 'src/shared/interfaces';
import { AuditRecordOperationEnum } from 'src/shared/interceptors';
import { UpdateStatusDto } from '../dto/user/update-status.dto';
import { UserResponse } from '../dto/user/user-response.dto';

const RESOURCE_NAME = ResourceTypes.USERS;

@Controller('users')
@ApiBearerAuth()
@ApiTags('Users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@ApiOperation({ summary: 'Get all users' })
	@ApiOkResponse({ type: ListUserDto })
	@CanRead(RESOURCE_NAME)
	findAll(@Query() filter: UsersFilter) {
		return this.userService.findAll(filter);
	}

	@Get('exists')
	@ApiOperation({ summary: 'Check if user exists' })
	@ApiOkResponse({ type: Boolean })
	@CanRead(RESOURCE_NAME)
	async checkIfExists(@Query() existsQuery: ExistsQuery) {
		return this.userService.checkIfExists(existsQuery);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by id' })
	@ApiOkResponse({ type: UserResponse })
	@CanRead(RESOURCE_NAME)
	findOne(@Param('id') id: string) {
		return this.userService.findOne(+id);
	}

	@Post()
	@TrackActivity('Log [Creó un usuario]')
	@AuditRecord(AuditRecordOperationEnum.CREATE)
	@ApiOperation({ summary: 'Create user' })
	@ApiOkResponse({ type: UserResponse })
	@CanCreate(RESOURCE_NAME)
	create(@Body() formUserDto: FormUserDto) {
		return this.userService.create(formUserDto);
	}

	@Post(':code/send-verification')
	@TrackActivity('Log [Envio de correo de verificación]')
	@AuditRecord(AuditRecordOperationEnum.CREATE)
	@ApiOperation({ summary: 'Send user email verification' })
	@ApiOkResponse({ type: Boolean })
	sendVerification(@Param('code') code: string) {
		return this.userService.sendVerificationEmail(code);
	}

	@Put(':id')
	@TrackActivity('Log [Actualizó un usuario]')
	@AuditRecord(AuditRecordOperationEnum.UPDATE)
	@ApiOperation({ summary: 'Update user' })
	@ApiOkResponse({ type: UserResponse })
	@CanUpdate(RESOURCE_NAME)
	update(@Param('id') id: string, @Body() formUserDto: FormUserDto) {
		return this.userService.update(+id, formUserDto);
	}

	@Delete(':id')
	@TrackActivity('Log [Eliminó un usuario]')
	@AuditRecord(AuditRecordOperationEnum.DELETE)
	@ApiOperation({ summary: 'Delete user' })
	@ApiOkResponse({ type: Boolean })
	@CanDelete(RESOURCE_NAME)
	delete(@Param('id') id: string, @Body() auditDeleteFields: AuditDeleteFields) {
		return this.userService.delete(+id, auditDeleteFields);
	}

	@Patch('update-status')
	@ApiOperation({ summary: 'Update the user status' })
	@CanUpdate(RESOURCE_NAME)
	@TrackActivity('Log [Actualizacion de estado de usuario]')
	@AuditRecord(AuditRecordOperationEnum.UPDATE)
	async updateStatus(@Body() updateStatusDto: UpdateStatusDto) {
		return this.userService.updateStatus(updateStatusDto);
	}
}
