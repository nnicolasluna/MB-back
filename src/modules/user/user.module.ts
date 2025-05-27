import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthService } from '@modules/auth/services/auth.service';
import { RoleController } from './controllers/roles.controller';
import { RoleService } from './services/role.service';
import { PermissionController } from './controllers/permissions.controller';
import { PermissionService } from './services/permission.service';
import { LogActivityController } from './controllers/log-activity.controller';
import { LogActivityService } from './services/log-activity.service';

@Module({
	controllers: [UserController, RoleController, PermissionController, LogActivityController],
	providers: [UserService, RoleService, PermissionService, LogActivityService, AuthService],
	imports: [AuthModule],
})
export class UserModule {}
