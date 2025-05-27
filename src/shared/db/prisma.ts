import { INestApplication, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

const modelsWithOutAuditFields = ['LogActivity', 'Resources', 'HotSpot', 'ArcheologicalSites'];

function extendPrismaClient() {
	const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

	return prisma.$extends({
		client: {
			async onModuleInit() {
				await Prisma.getExtensionContext(this).$connect();
			},
			async enableShutdownHooks(app: INestApplication) {
				Prisma.getExtensionContext(prisma).$on('beforeExit' as never, async () => {
					await app.close();
				});
			},
		},
		query: {
			$allModels: {
				$allOperations({ model, operation, args, query }) {
					if (['findUnique', 'create', 'createMany', 'createManyAndReturn'].includes(operation)) return query(args);

					if (!modelsWithOutAuditFields.includes(model)) {
						(args as any).where.deletedDate = null;
						(args as any).where.idDeletedBy = null;
					}

					return query(args);
				},
			},
		},
		model: {
			$allModels: {
				async exists<T>(this: T, where: Prisma.Args<T, 'findFirst'>['where']): Promise<boolean> {
					const context = Prisma.getExtensionContext(this);

					const result = await (context as any).findFirst({ where });
					return result !== null;
				},
			},
		},
	});
}

const ExtendedPrismaClient = class {
	constructor() {
		return extendPrismaClient();
	}
} as new () => ReturnType<typeof extendPrismaClient>;

@Injectable()
export class DBConnection extends ExtendedPrismaClient {}
