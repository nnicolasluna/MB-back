import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResourceTypes } from '@shared/constants';
import { CanRead, IsPublic } from '@shared/decorators';
import { HotSpotEntity } from '../entities/hot-spot.entity';
import { HotSpotService } from '../services/hot-spot.service';
import { HotSpotFilter } from '../dto/hot-spot.filter';
import { HotSpotGJSONFilter } from '../dto/hot-spot-gjson.filter';

const RESOURCE_NAME = ResourceTypes.MENU_MONITORING;

@Controller('hot-spot')
@ApiBearerAuth()
@ApiTags('HotSpot')
export class HotSpotController {
	constructor(private readonly hotSpotService: HotSpotService) {}

	@Get()
	@ApiOperation({ summary: 'Get all hotSpots process controls' })
	@ApiOkResponse({ type: HotSpotEntity, isArray: true })
	@CanRead(RESOURCE_NAME)
	async findAll(@Query() filter: HotSpotFilter) {
		return this.hotSpotService.findAll(filter);
	}

	@Get('last-update')
	@ApiOperation({ summary: 'Get last update of hotSpots process controls' })
	@ApiOkResponse({ type: Date })
	@IsPublic()
	async getLastUpdate() {
		return this.hotSpotService.getLastUpdate();
	}

	@Get('gjson')
	@ApiOperation({ summary: 'Get all hotSpots in GJSON format' })
	@ApiOkResponse({ type: 'GeoJSON' })
	@IsPublic()
	async getAllHotSpotsGJSON(@Query() filter: HotSpotGJSONFilter) {
		return this.hotSpotService.getAllHotSpotsGJSON(filter);
	}

	@Get('export')
	@ApiOperation({ summary: 'Export all hotSpots in shape format' })
	@IsPublic()
	async exportSHP(@Query() filter: HotSpotGJSONFilter) {
		return this.hotSpotService.exportShpToZip(filter);
	}
}
