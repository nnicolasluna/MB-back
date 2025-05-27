import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class AuthenticationGuard implements CanActivate {
	public constructor(
		private readonly reflector: Reflector,
		private readonly authService: AuthService,
	) {}

	private gerTokenFromRequest(request: Request) {
		const token = request.headers.authorization ?? request.query?.access_token.toString();

		if (token) return token.split(' ')[1];

		return null;
	}

	private async getUserInformation(userId: number) {
		const userData = await this.authService.getUser({ id: userId });

		const accessTo = {};

		userData.role.resourceRoles.forEach((v) => {
			if (!accessTo[v.resource.code]) {
				accessTo[v.resource.code] = {
					roleName: userData.role.name,
					resourceName: v.resource.name,
					resourceCode: v.resource.code,
					permission: v.permission,
				};
			}
		});

		return {
			...userData,
			roleName: userData.role.name,
			roleId: userData.role.id,
			accessTo,
		};
	}

	public async canActivate(context: ExecutionContext) {
		try {
			const request = context.switchToHttp().getRequest();

			const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());

			if (isPublic) return true;

			const token = this.gerTokenFromRequest(request);

			if (!token) return false;

			const validToken = await this.authService.verifyToken(token as string);

			if (!validToken) return false;

			const decodedUser = await this.authService.getLoggedUserInfo(token as string);

			const loggedUser = await this.getUserInformation(decodedUser['id']);

			request.user = {
				token,
				access: true,
				user: loggedUser,
			};

			return validToken;
		} catch (error) {
			throw new UnauthorizedException(error);
		}
	}
}
