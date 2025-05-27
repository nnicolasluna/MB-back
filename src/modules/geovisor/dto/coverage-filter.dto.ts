import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class LimitsFilterDto {
	@ApiProperty({ required: false })
	departments?: string[];

	@ApiProperty({ required: false })
	municipalities?: string[];

	@ApiProperty({ required: false })
	regions?: string[];
}

export class CoverageFilterDto extends LimitsFilterDto {
	@ApiProperty({ required: false })
	limit?: number;

	@ApiHideProperty()
	style: string;

	@ApiHideProperty()
	layer: string;

	@ApiHideProperty()
	field: string;
}
