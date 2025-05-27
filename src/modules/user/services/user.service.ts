import { ConflictException, HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersFilter } from '../dto/user/user.filter';
import { DBConnection } from 'src/shared/db/prisma';
import { FormUserDto } from '../dto/user/form-user.dto';
import { ListUserDto } from '../dto/user/list-user.dto';
import { AuditDeleteFields, ExistsQuery } from 'src/shared/interfaces';
import { UserStatus } from '@prisma/client';
import { UpdateStatusDto } from '../dto/user/update-status.dto';
import { EmailService } from '@shared/services/email/email.service';
import * as dayjs from 'dayjs';
import { AuthService } from '@modules/auth/services/auth.service';
import { UserResponse } from '../dto/user/user-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
	private logger = new Logger(UserService.name);

	constructor(
		private readonly db: DBConnection,
		private readonly emailService: EmailService,
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	async findAll(filter: UsersFilter) {
		this.logger.log(`Finding all users, with filter: ${filter}`);

		const { where, pagination } = filter;

		const [users, total] = await this.db.$transaction([
			this.db.user.findMany({
				where,
				include: { role: true, image: true },
				...pagination,
			}),
			this.db.user.count({ where }),
		]);

		return new ListUserDto(users, total);
	}

	async findOne(id: number) {
		this.logger.log(`Finding user with id: ${id}`);
		const user = await this.db.user.findUnique({ where: { id }, include: { role: true, image: true } });

		if (!user) throw new NotFoundException('User not found');

		return new UserResponse(user);
	}

	async create(dto: FormUserDto) {
		this.logger.log(`Creating user`);

		const existsUser = await this.db.user.exists({
			OR: [{ email: dto.email }, { username: dto.username }, { ci: dto.ci }],
		});

		if (existsUser) throw new ConflictException('User already exists');

		const existsRole = await this.db.role.exists({ id: dto.idRole });

		if (!existsRole) throw new NotFoundException('Role not found');

		dto.expirationAccount = dayjs(dto.expirationAccount).toDate();

		const user = await this.db.user.create({
			data: dto,
			include: { role: true, image: true },
		});

		return new UserResponse(user);
	}

	async update(id: number, dto: FormUserDto) {
		this.logger.log(`Updating user with id: ${id}`);

		const user = await this.db.user.update({
			where: { id },
			data: dto,
			include: { role: true, image: true },
		});

		return new UserResponse(user);
	}

	async delete(id: number, auditFields: AuditDeleteFields) {
		this.logger.log(`Deleting user with id: ${id}`);

		const user = await this.db.user.findFirst({ where: { id } });

		if (!user) throw new NotFoundException('User not found');

		await this.db.user.update({
			where: { id },
			data: {
				...auditFields,
				state: false,
				email: `${new Date().getTime()}_${user.email}`,
				username: `${new Date().getTime()}_${user.username}`,
			},
		});

		return true;
	}

	async checkIfExists({ value, field }: ExistsQuery) {
		try {
			this.logger.log(`Checking if user exists with ${field}: ${value}`);
			return this.db.user.exists({ [field]: value });
		} catch (error) {
			this.logger.error(`Error checking if user exists: ${error}`);
			return false;
		}
	}

	private async aprove(id: number) {
		const user = await this.db.user.findUnique({ where: { id } });
		const verification = {
			verificationCode: await this.authService.generateAccessToken(user, this.configService.get('jwt.expiresEmailIn')),
			expirationVerificationCode: dayjs().add(1, 'day').toDate(),
		};
		return verification;
	}

	private async disable() {
		return {
			password: null,
			verificationCode: null,
			userStatus: UserStatus.DISABLED,
			secondFactor: undefined,
			expirationVerificationCode: null,
			reviwedVerificationCode: false,
		};
	}

	async sendVerificationEmail(code: string) {
		this.logger.log(`Sending verification email to user with uuid: ${code}`);

		const user = await this.db.user.findUnique({ where: { uuid: code, reviwedVerificationCode: false } });

		if (!user) throw new NotFoundException('User not found');

		try {
			await this.emailService.sendVerificationEmail(user);
			return true;
		} catch (error) {
			this.logger.error(`Error sending verification email: ${error}`);
			throw new HttpException('Error sending verification email', 500);
		}
	}

	async updateStatus({ id, status }: UpdateStatusDto) {
		this.logger.log(`Updating user status with id: ${id} and status: ${status}`);

		let isAproved = false;

		let data = { userStatus: status };

		switch (status) {
			case UserStatus.APROVE:
				isAproved = true;
				const verification = await this.aprove(id);
				data = {
					...data,
					...verification,
				};
				break;
			case UserStatus.DISABLED:
				const newData = await this.disable();
				data = {
					...data,
					...newData,
				};
				break;
		}

		const updateUser = await this.db.user.update({
			where: { id },
			data,
			include: { role: true, image: true },
		});

		if (isAproved) await this.emailService.sendVerificationEmail(updateUser);

		return new UserResponse(updateUser);
	}
}
