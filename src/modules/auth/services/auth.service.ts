import {
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DBConnection } from 'src/shared/db/prisma';
import { BasicLoginDto } from '../dto/basic-login.dto';
import { Prisma, UserStatus } from '@prisma/client';
import { compare } from 'bcryptjs';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { BasicLoginResponseDto } from '../dto/basic-login-response.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { EmailService } from 'src/shared/services/email/email.service';
import { ConfirmAccountDto } from '../dto/confirm-account.dto';
import { hashText } from 'src/shared/utils';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UserResponse } from '@modules/user/dto/user/user-response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {
	private logger = new Logger(AuthService.name);

	constructor(
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		private readonly db: DBConnection,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly emailService: EmailService,
	) {}

	public async getUser(where: Prisma.UserWhereInput) {
		return this.db.user.findFirst({
			where,
			include: {
				role: {
					include: {
						resourceRoles: {
							include: {
								resource: true,
							},
						},
					},
				},
			},
		});
	}

	public async verifyToken(token: string) {
		return this.jwtService.verifyAsync(token, {
			ignoreExpiration: false,
		});
	}

	public async getLoggedUserInfo(token: string) {
		return this.jwtService.decode(token);
	}

	public async generateAccessToken(user: UserEntity, expirationTime: string | number) {
		const payload = {
			email: user.email,
			id: user.id,
			user: user.username,
		};
		return this.jwtService.signAsync(payload, {
			expiresIn: expirationTime,
		});
	}

	public async basicLogin({ username, password, remember }: BasicLoginDto) {
		const user = await this.getUser({
			OR: [{ username }, { email: username }],
			state: true,
			userStatus: UserStatus.APROVE,
			reviwedVerificationCode: true,
		});

		// Basic Checks of user status
		if (!user) throw new UnauthorizedException();

		if (user.expirationAccount && user.expirationAccount < new Date()) throw new UnauthorizedException();

		if (user.blockedUntil > new Date()) throw new HttpException('Account Banned', HttpStatus.FORBIDDEN);
		else await this.db.user.update({ where: { id: user.id }, data: { blockedUntil: null } });

		// User Login tries
		/* const loginTries: number = (await this.cacheManager.get(user.username)) ?? 0;

		const validatePassword = await compare(password, user.password);

		if (!validatePassword) {
			this.logger.verbose(`User: ${user.username} have: ${loginTries} tries.`);

			if (loginTries === 2) {
				this.logger.verbose(`User ${user.username} was banned`);
				const blockedUntil = dayjs(Date.now()).add(86400, 'seconds').toDate(); // .format('YYYY-MM-DD HH:mm:ss');
				await this.db.user.update({
					where: { id: user.id },
					data: { blockedUntil },
				});
				await this.cacheManager.del(user.username);

				throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
			}

			await this.cacheManager.set(user.username, loginTries + 1);

			throw new UnauthorizedException();
		}

		await this.cacheManager.del(user.username);
 */
		const tmpPermisos = user.role;
		const accessTo = {};

		tmpPermisos.resourceRoles.forEach((v) => {
			accessTo[v.resource.code] = {
				resource: v.resource.name,
				code: v.resource.code,
				permission: v.permission,
			};
		});

		const tokenType = remember ? 'jwt.refreshExpiresIn' : 'jwt.expiresIn';
		const token = await this.generateAccessToken(user, this.configService.get(tokenType));
		delete user.password;
		delete user.expirationAccount;
		delete user.role.resourceRoles;

		return new BasicLoginResponseDto(new UserResponse(user), token, accessTo);
	}

	async forgotPassword({ email }: ForgotPasswordDto) {
		const verifyAccount = await this.db.user.findFirst({
			where: { email, state: true, expirationAccount: { gte: new Date() } },
		});

		if (!verifyAccount) throw new NotFoundException();

		const verificationCode = await this.generateAccessToken(
			verifyAccount,
			this.configService.get('jwt.expiresEmailIn'),
		);

		await this.db.user.update({
			where: { id: verifyAccount.id },
			data: {
				reviwedVerificationCode: false,
				verificationCode: verificationCode,
				blockedUntil: null,
			},
		});

		await this.emailService.sendForgotPasswordEmail(verifyAccount);

		return true;
	}

	async confirmAccount({ email, verificationCode, password }: ConfirmAccountDto) {
		const verifyToken = await this.jwtService.verifyAsync(verificationCode);
		if (verifyToken.email === email) {
			await this.db.user.update({
				where: {
					id: verifyToken.id,
				},
				data: {
					reviwedVerificationCode: true,
					password: hashText(password),
				},
			});
			return true;
		}
		throw new UnauthorizedException();
	}

	async changePassword({ oldPassword, newPassword }: ChangePasswordDto, currentUser: UserEntity) {
		console.log(currentUser, oldPassword);
		const validatePassword = compare(currentUser.password, oldPassword);

		if (!validatePassword) throw new UnauthorizedException();

		const hashedPassword = hashText(newPassword);
		await this.db.user.update({
			where: { id: currentUser.id },
			data: { password: hashedPassword },
		});

		return true;
	}
}
