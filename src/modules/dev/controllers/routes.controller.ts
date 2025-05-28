import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '@shared/decorators';

@Controller('routes')
@ApiTags('Development Tools')
export class RoutesController {
	constructor() {}

	@IsPublic()
	@Get('hello')
	@ApiOperation({ summary: 'Hello World' })
	@ApiQuery({ name: 'name', required: true })
	async hello(@Query('name') name: string) {
		return `Hello ${name}`;
	}
}
