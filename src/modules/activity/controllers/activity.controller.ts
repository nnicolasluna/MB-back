import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { ActivityService } from '../services/activity.service';

@Controller('activity')
export class ActivityController {
	constructor(private readonly activityService: ActivityService) {}

	@Post()
	create(@Body() createActivityDto: any) {
		return this.activityService.create(createActivityDto);
	}

	@Get()
	findAll() {
		return this.activityService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.activityService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
		return this.activityService.update(+id, updateActivityDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.activityService.remove(+id);
	}
}
