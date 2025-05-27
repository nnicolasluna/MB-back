import { PrismaClient } from '@prisma/client';
import { IBaseSeeder } from './seeder.interface';
import { archeologicalSites } from './data/archeological-sites';

export class ArchelogicalSitesSeeder implements IBaseSeeder {
	async seed(prisma: PrismaClient): Promise<void> {
		for (const a of archeologicalSites) {
			await prisma.archeologicalSites.upsert({
				where: { id: a.id },
				update: a,
				create: a,
			});
		}
	}
}
