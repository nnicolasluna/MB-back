import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SystemPermissions } from 'src/shared/constants';
import { DBConnection } from 'src/shared/db/prisma';
import { parseRight } from 'src/shared/utils';

@Injectable()
export class SystemAccessService {
	public enableSystemPermission = this.configService.get('useSystemAccessPermission');

	constructor(
		public readonly db: DBConnection,
		private readonly configService: ConfigService,
	) {}

	public isSuperAdmin(resource: string | string[], user: any): boolean {
		return this.verify(user, SystemPermissions.RIGHT_SUPER_ADMIN, resource);
	}

	public isAdmin(resource: string | string[], user: any): boolean {
		return this.verify(user, SystemPermissions.RIGHT_ADMIN, resource);
	}

	public canView(resource: string | string[], user: any): boolean {
		return this.verify(user, SystemPermissions.RIGHT_READ, resource);
	}

	public canUpdate(resource: string | string[], user: any): boolean {
		return this.verify(user, SystemPermissions.RIGHT_UPDATE, resource);
	}

	public canCreate(resource: string | string[], user: any): boolean {
		return this.verify(user, SystemPermissions.RIGHT_CREATE, resource);
	}

	public canDelete(resource: string | string[], user: any): boolean {
		return this.verify(user, SystemPermissions.RIGHT_DELETE, resource);
	}

	private verify(user: any, permission: any, resource: string | string[]) {
		if (!this.enableSystemPermission) return true;

		if (!Array.isArray(resource)) return parseRight(user, permission, resource);

		let hasAccess = false;
		for (const r of resource) {
			const userAccessTo = parseRight(user, permission, r);
			if (!userAccessTo) {
				hasAccess = false;
			} else {
				hasAccess = !!userAccessTo;
				break;
			}
		}
		return hasAccess;
	}
}
