import { Global, Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthService } from '@modules/auth/services/auth.service';
import { NotificationService } from './services/notification.service';

@Global()
@Module({
	exports: [NotificationService, NotificationGateway],
	providers: [NotificationGateway, NotificationService, AuthService],
	imports: [AuthModule, NotificationsModule],
})
export class NotificationsModule {}
