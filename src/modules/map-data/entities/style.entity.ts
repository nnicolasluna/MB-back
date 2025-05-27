import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Style } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class StyleEntity implements Style {
	@ApiPropertyOptional({ description: 'Id' })
	id: number;

	@ApiPropertyOptional({ description: 'Código' })
	uuid: string;

	@ApiProperty({ description: 'Name of the style' })
	name: string;

	@ApiProperty({ description: 'Type of style' })
	type: string;

	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	state: boolean;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	idCreatedBy: number;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	createdDate: Date;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	updatedDate: Date;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	idUpdatedBy: number;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	idDeletedBy: number;
	@ApiHideProperty()
	@Exclude({ toPlainOnly: true })
	deletedDate: Date;

	constructor(partial: Partial<StyleEntity>) {
		Object.assign(this, partial);
	}
}
