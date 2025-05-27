import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DbModule } from 'src/shared/db/db.module';
import { AuthController } from './controllers/auth.controller';

@Module({
	imports: [
		PassportModule,
		DbModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('jwt.secret'),
				verifyOptions: {
					ignoreExpiration: true,
				},
				global: true,
			}),
		}),
	],
	exports: [AuthService, JwtModule],
	providers: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
