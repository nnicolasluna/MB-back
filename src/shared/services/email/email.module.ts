import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { resolve } from 'path';

@Global()
@Module({
	providers: [EmailService],
	exports: [EmailService],
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				return {
					transport: {
						host: configService.get('email.host', ''),
						port: configService.get('email.port'),
						auth: {
							user: configService.get('email.user'),
							pass: configService.get('email.password'),
						},
						secure: configService.get('email.ssl'),
						tls: {
							rejectUnauthorized: configService.get('email.tls'),
						},
					},
					defaults: {
						from: configService.get('email.from'),
					},
					template: {
						dir: resolve(`${process.cwd()}/src/shared/services/email/templates`),
						adapter: new EjsAdapter({
							inlineCssEnabled: true,
						}),
						options: {
							strict: false,
						},
					},
				};
			},
			inject: [ConfigService],
		}),
	],
})
export class EmailModule {}
