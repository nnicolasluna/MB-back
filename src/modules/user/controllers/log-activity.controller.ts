import { Controller, Get, Query } from '@nestjs/common';
import { ApiBasicAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResourceTypes } from 'src/shared/constants';
import { CanRead } from 'src/shared/decorators';
import { LogActivityService } from '../services/log-activity.service';
import { LogActivitiesFilter } from '../dto/log-activity/log-activity.filter';
import { ListLogActivityDto } from '../dto/log-activity/list-log-activity.dto';

const RESOURCE_NAME = [ResourceTypes.LOG_ACTIVITIES];

@Controller('log-activities')
@ApiBasicAuth()
@ApiTags('Log Activities')
export class LogActivityController {
	constructor(private readonly logActivityService: LogActivityService) {}

	@Get()
	@ApiOperation({ summary: 'Get all activities' })
	@ApiOkResponse({ type: ListLogActivityDto })
	@CanRead(RESOURCE_NAME)
	findAll(@Query() filter: LogActivitiesFilter) {
		return this.logActivityService.findAll(filter);
	}
}
