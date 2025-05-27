import { SystemAccessGuard } from '../guards';
import { Rights, SystemAccessRights } from '../interfaces';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

export const SYSTEM_ACCESS_KEY = 'system-access';

export const SystemAccess = (permission: SystemAccessRights) =>
	applyDecorators(SetMetadata(SYSTEM_ACCESS_KEY, permission), UseGuards(SystemAccessGuard));

export const CanCreate = (resource: string | string[]) => SystemAccess({ resource, right: Rights.canCreate });

export const CanRead = (resource: string | string[]) => SystemAccess({ resource, right: Rights.canView });

export const CanUpdate = (resource: string | string[]) => SystemAccess({ resource, right: Rights.canUpdate });

export const CanDelete = (resource: string | string[]) => SystemAccess({ resource, right: Rights.canDelete });
