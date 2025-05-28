import { PrismaClient, Resources, Role } from '@prisma/client';
import { IBaseSeeder } from './seeder.interface';
import { RoleNames } from './data/roles';
import { SystemPermissions } from '../../src/shared/constants';

export class ResourceRolesSeeder implements IBaseSeeder {
	async seed(prisma: PrismaClient): Promise<void> {
		const resources = await prisma.resources.findMany();
		const roles = await prisma.role.findMany();
		for (const r of resources) {
			console.info('Seeding permission for resource: ', r.name, '...');
			await this.assignResourceToRole(r, roles, prisma);
		}
	}

	async assignResourceToRole(resource: Resources, roles: Role[], prisma: PrismaClient) {
		for (const role of roles) {
			switch (role.name) {
				// TODO: Add more roles and their specific permissions
				case RoleNames.SUPER_ADMIN:
					await this.addResourceRole(prisma, role.id, resource.id);
					break;
			}
		}
	}

	// INFO: Custom function to assign resources to users based on their roles
	async assignResourcesToUser(resource: Resources, roleId: number, prisma: PrismaClient) {
		const validResources: string[] = [];
		if (validResources.includes(resource.code)) {
			await this.addResourceRole(prisma, roleId, resource.id, SystemPermissions.RIGHT_READ);
		}
	}

	async addResourceRole(
		prisma: PrismaClient,
		roleId: number,
		resourceId: number,
		permission = SystemPermissions.RIGHT_SUPER_ADMIN,
	) {
		return prisma.resourceRoles.upsert({
			where: { idRole_idResource: { idRole: roleId, idResource: resourceId } },
			update: {
				permission,
			},
			create: {
				idRole: roleId,
				idResource: resourceId,
				permission: permission,
			},
		});
	}
}
