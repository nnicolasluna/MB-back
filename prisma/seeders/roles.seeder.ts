import { PrismaClient } from '@prisma/client';
import { IBaseSeeder } from './seeder.interface';
import { Roles } from './data/roles';

export class RolesSeeder implements IBaseSeeder {
	async seed(prisma: PrismaClient): Promise<void> {
		for (const role of Roles) {
			await prisma.role.upsert({
				where: { name: role.name },
				update: {
					description: role.description,
				},
				create: {
					name: role.name,
					description: role.description,
					idCreatedBy: 1,
					createdDate: new Date(),
					state: true,
				},
			});
		}
	}
}
