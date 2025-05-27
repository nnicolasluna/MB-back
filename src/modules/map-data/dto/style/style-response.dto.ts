import { StyleEntity } from '@modules/map-data/entities/style.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class StyleResponse extends PartialType(StyleEntity) {
	@ApiProperty({ description: 'Content raw style', type: String })
	data?: string;

	constructor(style: Partial<StyleEntity & { data?: string }>) {
		super();
		Object.assign(this, style);
	}
}
