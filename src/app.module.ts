import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { DbModule } from './shared/db/db.module';
import { SystemAccessModule } from './shared/services/system-access/system-access.module';
import { EmailModule } from './shared/services/email/email.module';
import { DevModule } from './modules/dev/dev.module';
import { MapDataModule } from './modules/map-data/map-data.module';
import { BullModule } from '@nestjs/bull';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { GeocoderModule } from './shared/services/geocoder/geocoder.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ATTACHMENT_FOLDER, PUBLIC_FOLDER } from '@shared/constants';
import { GeovisorModule } from './modules/geovisor/geovisor.module';
import { AttachmentsModule } from '@modules/attachments/attachments.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { HotSpotModule } from '@modules/hot_spots/hot-spot.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MonitoringModule } from '@modules/monitoring/monitoring.module';

@Module({
	imports: [
		DbModule,
		ConfigModule.forRoot({
			envFilePath: !process.env.NODE_ENV ? '.env' : `.env.production`,
			load: [configuration],
			isGlobal: true,
		}),

		BullModule.forRoot({
			redis: {
				host: process.env.REDIS_HOST,
				port: parseInt(process.env.REDIS_PORT),
			},
		}),

		ServeStaticModule.forRoot(
			{
				rootPath: PUBLIC_FOLDER,
				serveRoot: `/${process.env.API_ROOT}/static/`,
			},
			{
				rootPath: ATTACHMENT_FOLDER,
				serveRoot: `/${process.env.API_ROOT}/static/attachments`,
			},
		),

		...(process.env.NODE_ENV !== 'production' ? [DevModule] : []),

		CacheModule.registerAsync({
			useFactory: async () => {
				return {
					stores: [createKeyv(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`)],
					ttl: 60000,
					max: 50,
				};
			},
			isGlobal: true,
		}),

		ScheduleModule.forRoot(),

		AuthModule,
		UserModule,
		SystemAccessModule,
		EmailModule,
		MapDataModule,
		MonitoringModule,
		NotificationsModule,
		GeocoderModule,
		GeovisorModule,
		AttachmentsModule,
		HotSpotModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
