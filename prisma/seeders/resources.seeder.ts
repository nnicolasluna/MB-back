import { PrismaClient } from '@prisma/client';
import { IBaseSeeder } from './seeder.interface';
import { Resources } from '../../src/shared/constants';

export class ResourcesSeeder implements IBaseSeeder {
	async seed(prisma: PrismaClient): Promise<void> {
		for (const r of Resources) {
			await prisma.resources.upsert({
				where: { code: r.code },
				update: {
					name: r.name,
					type: r.type,
				},
				create: r,
			});
		}
	}
}
