import { PrismaClient } from '@prisma/client';
import { RolesSeeder, ResourcesSeeder, UsersSeeder, ResourceRolesSeeder } from './seeders';

const prisma = new PrismaClient();

async function main() {
	const seeders = [new RolesSeeder(), new ResourcesSeeder(), new ResourceRolesSeeder(), new UsersSeeder()];

	for (const seeder of seeders) {
		await seeder.seed(prisma);
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
