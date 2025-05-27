import { Reflector } from '@nestjs/core';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuditFields } from '../interfaces';
import { Observable } from 'rxjs';
import { AUDIT_OPERATION_METADATA_KEY } from '../decorators/audit-record.decorator';

export type AuditRecordOperationType = 'CREATE' | 'UPDATE' | 'APPROVE' | 'REJECT' | 'DELETE';
export enum AuditRecordOperationEnum {
	CREATE = 'CREATE',
	UPDATE = 'UPDATE',
	APPROVE = 'APPROVE',
	REJECT = 'REJECT',
	DELETE = 'DELETE',
}

@Injectable()
export class AuditableRecordInterceptor implements NestInterceptor {
	constructor(private reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const currentUser = this.getCurrentUserFromContext(context);
		const auditOperation = this.reflector.get<AuditRecordOperationType>(
			AUDIT_OPERATION_METADATA_KEY,
			context.getHandler(),
		);
		const auditableFields = this.getAuditableFields(auditOperation, currentUser);
		const requestBody = context.switchToHttp().getRequest().body;
		context.switchToHttp().getRequest().body = {
			...requestBody,
			...auditableFields,
		};

		return next.handle();
	}

	private getAuditableFields(auditOperaion: AuditRecordOperationType, user: User): AuditFields {
		switch (auditOperaion) {
			case AuditRecordOperationEnum.UPDATE:
				return {
					idUpdatedBy: user.id,
					updatedDate: new Date(),
				};
			case AuditRecordOperationEnum.APPROVE:
				return {
					approvedById: user.id,
					approvedDate: new Date(),
				};
			case AuditRecordOperationEnum.REJECT:
				return {
					rejectedById: user.id,
					rejectedDate: new Date(),
				};
			case AuditRecordOperationEnum.DELETE:
				return {
					idDeletedBy: user.id,
					deletedDate: new Date(),
				};
			default:
				return {
					idCreatedBy: user.id,
					createdDate: new Date(),
				};
		}
	}

	private getCurrentUserFromContext(context: ExecutionContext): User {
		const request = context.switchToHttp().getRequest();
		return request.user.user;
	}
}
