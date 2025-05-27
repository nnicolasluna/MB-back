import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

export class SwaggerConfig {
	static setup(app: INestApplication) {
		const swaggerConfig = new DocumentBuilder()
			.setTitle('Backend API')
			.setVersion('1.0')
			.addBearerAuth({
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				in: 'header',
				description: 'JWT token with format: Authorization: Bearer $TOKEN',
			})
			.build();

		const swaggerOptions: SwaggerDocumentOptions = {
			deepScanRoutes: true,
		};

		const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, swaggerOptions);

		SwaggerModule.setup('api-docs', app, swaggerDocument);
	}
}
