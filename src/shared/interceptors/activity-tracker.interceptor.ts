import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { User } from '@prisma/client';
import { Reflector } from '@nestjs/core';

import { ACTIVITY_LOG_METADATA_KEY } from '../decorators/track-activity.decorator';
import { DBConnection } from '../db/prisma';
import { getClientIp } from 'request-ip';

@Injectable()
export class ActivityTrackerInterceptor implements NestInterceptor {
	constructor(
		private databaseConnection: DBConnection,
		private reflector: Reflector,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			tap(() => {
				this.logActivity(context);
			}),
		);
	}

	private logActivity(context: ExecutionContext): void {
		const currentUser = this.getCurrentUserFromContext(context);
		const requestProps = this.getRequestProps(context);
		const logDescription =
			this.getDescriptionFromContext(context) ?? this.reflector.get(ACTIVITY_LOG_METADATA_KEY, context.getHandler());

		this.databaseConnection.logActivity
			.create({
				data: {
					idUser: currentUser.id,
					description: logDescription,
					...requestProps,
				},
			})
			.then();
	}

	private getDescriptionFromContext(context: ExecutionContext): string {
		const request = context.switchToHttp().getRequest();
		return request.logDescription;
	}

	private getCurrentUserFromContext(context: ExecutionContext): User {
		const request = context.switchToHttp().getRequest();
		return request.user.user;
	}

	private getRequestProps(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		let ip = getClientIp(request);
		if (ip.includes(':')) {
			ip = '127.0.0.1';
		}

		const { url, method } = request;
		return { url, method, ip };
	}
}
