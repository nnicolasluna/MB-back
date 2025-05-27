import { Global, Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthService } from '@modules/auth/services/auth.service';
import { NotificationService } from './services/notification.service';
import { MapNotificationService } from './services/map-notification.service';

@Global()
@Module({
	exports: [NotificationService, NotificationGateway, MapNotificationService],
	providers: [NotificationGateway, NotificationService, AuthService, MapNotificationService],
	imports: [AuthModule, NotificationsModule],
})
export class NotificationsModule {}
