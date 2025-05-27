import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { SystemAccessRights } from '../interfaces';
import { SystemAccessService } from '../services/system-access/system-access.service';
import { SYSTEM_ACCESS_KEY } from '@shared/decorators';

@Injectable()
export class SystemAccessGuard implements CanActivate {
	public enableSystemPermission = this.configService.get('useSystemAccessPermission');

	constructor(
		private reflector: Reflector,
		private systemAccessService: SystemAccessService,
		private configService: ConfigService,
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		if (!this.enableSystemPermission) return true;

		const systemAccess = this.reflector.get<SystemAccessRights>(SYSTEM_ACCESS_KEY, context.getHandler());

		const request = context.switchToHttp().getRequest();

		const userData = request.user?.user;

		const isSuperAdmin = this.systemAccessService.isSuperAdmin(systemAccess.resource, userData);

		if (isSuperAdmin) return true;

		return this.systemAccessService[systemAccess.right](systemAccess.resource, userData);
	}
}
