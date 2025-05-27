import { PrismaClient, UserStatus } from '@prisma/client';
import { IBaseSeeder } from './seeder.interface';
import * as bcrypt from 'bcryptjs';

export class UsersSeeder implements IBaseSeeder {
	async seed(prisma: PrismaClient): Promise<void> {
		await prisma.user.upsert({
			where: {
				username_email: {
					email: 'admin@admin.com',
					username: 'admin',
				},
			},
			update: {
				// password: bcrypt.hashSync('sample', 10),
			},
			create: {
				address: 'test',
				email: 'admin@admin.com',
				username: 'admin',
				name: 'Administrador Master',
				firstSurname: 'Admin',
				secondSurname: 'M.',
				ci: '1234567',
				password: bcrypt.hashSync('sample', 10),
				phone: '12345678',
				verificationCode: '8c73a392-f5d7-475e-b888-5c9faaf7aadc',
				idCreatedBy: 1,
				createdDate: new Date(),
				state: true,
				reviwedVerificationCode: true,
				userStatus: UserStatus.APROVE,
				idRole: 1,
			},
		});
	}
}
