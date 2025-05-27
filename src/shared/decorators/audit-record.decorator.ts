import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { AuditRecordOperationType, AuditableRecordInterceptor } from '../interceptors/auditable-record.interceptor';

export const AUDIT_OPERATION_METADATA_KEY = 'audit-record-operation';

export const AuditRecord = (operation: AuditRecordOperationType) =>
	applyDecorators(SetMetadata(AUDIT_OPERATION_METADATA_KEY, operation), UseInterceptors(AuditableRecordInterceptor));
