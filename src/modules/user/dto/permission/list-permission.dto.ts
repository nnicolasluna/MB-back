import { ListDto } from 'src/shared/dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponse } from './permission-response.dto';

export class ListPermissionDto extends ListDto<PermissionResponse> {
	@ApiProperty({ description: 'List of items', type: PermissionResponse, isArray: true })
	@Type(() => PermissionResponse)
	override items: PermissionResponse[];

	constructor(items: PermissionResponse[], total: number) {
		super(items, total);
	}
}
