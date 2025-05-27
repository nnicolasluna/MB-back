import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GeovisorService } from '../services/geovisor.service';
import { IsPublic } from '@shared/decorators';
import { MonitoringWaterFilter } from '@modules/monitoring/dto/monitoring-water/monitoring-water.filter';
import { ListMonitoringWaterDto } from '@modules/monitoring/dto/monitoring-water/list-monitoring-water.dto';
import { MonitoringWaterService } from '@modules/monitoring/services/monitoring-water.service';
import { ListMonitoringFireDto } from '@modules/monitoring/dto/monitoring-fire/list-monitoring-fire.dto';
import { MonitoringFireService } from '@modules/monitoring/services/monitoring-fire.service';
import { MonitoringFireFilter } from '@modules/monitoring/dto/monitoring-fire/monitoring-fire.filter';
import { ListMonitoringBurnDto } from '@modules/monitoring/dto/monitoring-burn/list-monitoring-burn.dto';
import { MonitoringBurnFilter } from '@modules/monitoring/dto/monitoring-burn/monitoring-burn.filter';
import { MonitoringBurnService } from '@modules/monitoring/services/monitoring-burn.service';
import { ListMapDataDto } from '@modules/map-data/dto/map-data/list-map-data.dto';
import { MapDataFilter } from '@modules/map-data/dto/map-data/map-data.filter';
import { MapDataService } from '@modules/map-data/services/map-data.service';
import { MonitoringSoilDegradationService } from '@modules/monitoring/services/monitoring-soil-degradation.service';
import { ListMonitoringSoilDegradationDto } from '@modules/monitoring/dto/monitoring-soil-degradation/list-monitoring-soil-degradation.dto';
import { MonitoringSoilDegradationFilter } from '@modules/monitoring/dto/monitoring-soil-degradation/monitoring-soil-degradation.filter';
import { MonitoringUseLandService } from '@modules/monitoring/services/monitoring-use-land.service';
import { MonitoringUseLandFilter } from '@modules/monitoring/dto/monitoring-use-land/monitoring-use-land.filter';
import { ListMonitoringUseLandDto } from '@modules/monitoring/dto/monitoring-use-land/list-monitoring-use-land.dto';
import { ListSoilAlertDto } from '@modules/monitoring/dto/soil-alerts/list-soil-alerts.dto';
import { SoilAlertFilter } from '@modules/monitoring/dto/soil-alerts/soil-alerts.filter';
import { SoilAlertsService } from '@modules/monitoring/services/soil-alerts.service';
import { GetLayerData } from '../dto/get-layer-data.dto';
import { SortDirEnum } from '@shared/dto';

@Controller('geovisor')
@ApiTags('Geovisor')
export class GeovisorController {
	constructor(
		private readonly geovisorService: GeovisorService,
		private readonly monitoringWaterService: MonitoringWaterService,
		private readonly monitoringRiskFire: MonitoringFireService,
		private readonly monitoringBurnService: MonitoringBurnService,
		private readonly monitoringSoilService: MonitoringSoilDegradationService,
		private readonly soilAlertService: SoilAlertsService,
		private readonly monitoringUseService: MonitoringUseLandService,
		private readonly mapDataService: MapDataService,
	) {}

	@Get('data')
	@ApiOperation({ summary: 'Get Layer Data' })
	@IsPublic()
	async getData(@Query() dto: GetLayerData) {
		return this.geovisorService.findLayerData(dto);
	}

	@Get('feature-bbox')
	@ApiOperation({ summary: 'Get Bbox of an register of layer' })
	@IsPublic()
	async getFeatureBbox(@Query('value') value: string, @Query('prop') prop: string) {
		return this.geovisorService.getFeatureBbox(prop, value);
	}

	@Get('hot-spot/last')
	@ApiOperation({ summary: 'Get last update of hotSpots controls' })
	@IsPublic()
	async getLastUpdate() {
		return this.geovisorService.getLastHotSpot();
	}

	@Get('monitoring/water')
	@ApiOperation({ summary: 'Get list of monitoring water' })
	@ApiOkResponse({ type: ListMonitoringWaterDto })
	@IsPublic()
	async getMonitoringWater() {
		const filter = new MonitoringWaterFilter();
		filter.showAll = true;
		filter.coverageState = 'Activo';
		filter.sortField = 'coverageDate';
		filter.sortDir = SortDirEnum.desc;

		return this.monitoringWaterService.findAll(filter);
	}

	@Get('monitoring/risk')
	@ApiOperation({ summary: 'Get list of monitoring fire' })
	@ApiOkResponse({ type: ListMonitoringFireDto })
	@IsPublic()
	async getMonitoringFireRisk() {
		const filter = new MonitoringFireFilter();
		filter.showAll = true;
		filter.coverageState = 'Activo';
		filter.sortField = 'coverageDate';
		filter.sortDir = SortDirEnum.desc;

		return this.monitoringRiskFire.findAll(filter);
	}

	@Get('monitoring/burn')
	@ApiOperation({ summary: 'Get list of monitoring fire' })
	@ApiOkResponse({ type: ListMonitoringBurnDto })
	@IsPublic()
	async getMonitoringBurn() {
		const filter = new MonitoringBurnFilter();
		filter.showAll = true;
		filter.coverageState = 'Activo';
		filter.sortField = 'coverageDate';
		filter.sortDir = SortDirEnum.desc;

		return this.monitoringBurnService.findAll(filter);
	}

	@Get('monitoring/soil')
	@ApiOperation({ summary: 'Get list of soil degradation' })
	@ApiOkResponse({ type: ListMonitoringSoilDegradationDto })
	@IsPublic()
	async getSoilDegradation() {
		const filter = new MonitoringSoilDegradationFilter();
		filter.showAll = true;
		filter.coverageState = 'Activo';
		filter.sortField = 'coverageDate';
		filter.sortDir = SortDirEnum.desc;

		return this.monitoringSoilService.findAll(filter);
	}

	@Get('monitoring/soil-alerts')
	@ApiOperation({ summary: 'Get list of soil alerts' })
	@ApiOkResponse({ type: ListSoilAlertDto })
	@IsPublic()
	async getSoilAlerts() {
		const filter = new SoilAlertFilter();
		filter.showAll = true;
		filter.coverageState = 'Activo';
		filter.sortField = 'coverageDate';
		filter.sortDir = SortDirEnum.desc;

		return this.soilAlertService.findAll(filter);
	}

	@Get('monitoring/use')
	@ApiOperation({ summary: 'Get list of use land' })
	@ApiOkResponse({ type: ListMonitoringUseLandDto })
	@IsPublic()
	async getUseLand() {
		const filter = new MonitoringUseLandFilter();
		filter.showAll = true;
		filter.coverageState = 'Activo';
		filter.sortField = 'coverageDate';
		filter.sortDir = SortDirEnum.desc;

		return this.monitoringUseService.findAll(filter);
	}

	@Get('map-data')
	@ApiOperation({ summary: 'Get list of public map data' })
	@ApiOkResponse({ type: ListMapDataDto })
	@IsPublic()
	async findAllPublic(@Query() filter: MapDataFilter) {
		filter.isPublic = true;
		return this.mapDataService.findAll(filter);
	}

	@Get('archelogical-sites')
	@ApiOperation({ summary: 'Get list of archelogical sites' })
	@IsPublic()
	async getArchelogicalSites() {
		return this.geovisorService.getArcheologicalSites();
	}
}
