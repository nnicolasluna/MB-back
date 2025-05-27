import { PrismaClient } from '@prisma/client';

export interface IBaseSeeder {
	seed(prisma: PrismaClient): Promise<void>;
}
