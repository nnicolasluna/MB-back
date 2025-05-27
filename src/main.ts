import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerConfig } from './config/swagger.config';
import { AuthService } from './modules/auth/services/auth.service';
import { AuthenticationGuard } from './shared/guards/auth-guard.guard';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
	});

	// TODO: Doesn't work
	app.disable('x-powered-by');

	//INFO: add BigInt support for serialization
	(BigInt.prototype as any).toJSON = function () {
		const int = Number.parseInt(this.toString());
		return int ?? this.toString();
	};

	const reflector = app.get(Reflector);

	app.setGlobalPrefix('api');

	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: ['1'],
	});

	app.enableCors({
		origin: process.env.CORS_ORIGIN?.split(' ') ?? '*',
		methods: '*',
		allowedHeaders: '*',
		credentials: true,
	});

	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

	const authService = app.get(AuthService);
	app.useGlobalGuards(new AuthenticationGuard(reflector, authService));

	SwaggerConfig.setup(app);

	await app.listen(3000);
}
bootstrap();
