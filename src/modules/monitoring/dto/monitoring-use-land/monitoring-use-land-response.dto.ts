import { AttachmentEntity } from '@modules/attachments/entities/attachment.entity';
import { MapDataEntity } from '@modules/map-data/entities/map-data.entity';
import { StyleEntity } from '@modules/map-data/entities/style.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MapDataResponse extends PartialType(MapDataEntity) {
	@ApiProperty({ description: 'Style of the map data', type: StyleEntity })
	@Type(() => StyleEntity)
	style?: StyleEntity;

	@ApiProperty({ description: 'Carimbo Attachment', type: AttachmentEntity })
	@Type(() => AttachmentEntity)
	carimbo?: AttachmentEntity;

	constructor(mapData: Partial<MapDataEntity & { style?: StyleEntity; carimbo?: AttachmentEntity }>) {
		super();
		Object.assign(this, mapData);
	}
}
