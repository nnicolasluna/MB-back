import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Injectable()
export class EmailService {
	private logger = new Logger(EmailService.name);

	clientUrl = this.configService.get('urlClient', '');
	mainColor = '#23B7D1';
	logoUrl =
		'https://www.wcs.org/assets/wcsorg/logos/green-blue-bright-5d771b2f607411694529229adaab63679ef4acc34bf6db6d840b5f38908ac4fa.svg';

	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService,
	) {}

	public async sendEmail(
		to: string,
		subject: string = null,
		text: string = null,
		template: string = null,
		meta: any = {},
	) {
		try {
			this.logger.log(`Email sent to: ${to}`);
			return this.mailerService.sendMail({
				to,
				subject,
				text,
				template: `./${template}`,
				context: meta,
			});
		} catch (error) {
			this.logger.error('mail error', error);
			throw new HttpException({ message: 'Error sending the mail' }, 500);
		}
	}

	public async sendVerificationEmail(user: Partial<UserEntity>) {
		const name = `${user.name} ${user.firstSurname}`;

		return this.mailerService.sendMail({
			to: user.email,
			subject: 'Correo De Verificacion de cuenta',
			text: `Hola ${name}`,
			template: 'confirmation-email',
			context: {
				mainColor: this.mainColor,
				logo: this.logoUrl,
				name,
				url: `${this.clientUrl}/auth/confirmation/${user.verificationCode}`,
			},
		});
	}

	async sendForgotPasswordEmail(user: Partial<UserEntity>) {
		const name = `${user.name} ${user.firstSurname}`;

		return this.sendEmail(user.email, 'Correo Recuperacion de contraseña', `Hola ${name}`, 'recover-password-email', {
			name,
			mainColor: this.mainColor,
			url: `${this.clientUrl}/auth/confirmation/${user.verificationCode}`,
		});
	}
}
