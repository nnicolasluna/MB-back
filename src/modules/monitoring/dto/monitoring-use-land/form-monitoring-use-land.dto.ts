import { MonitoringUseLandEntity } from '@modules/monitoring/entities/monitoring-use-land.entity';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class FormMonitoringUseLandDto implements Partial<MonitoringUseLandEntity> {
	@ApiProperty({ description: 'Name of the map', required: true, maxLength: 200, minLength: 3, nullable: false })
	name: string;

	@ApiPropertyOptional({ description: 'Description', required: false, maxLength: 300, minLength: 3, nullable: true })
	@IsOptional()
	@IsString()
	description: string;

	@ApiProperty({ description: 'Content Date', required: true, nullable: false })
	@Transform(({ value }) => (value ? new Date(value) : null))
	@IsDate()
	coverageDate: Date;

	@ApiHideProperty()
	zipFile: Express.Multer.File;
}
