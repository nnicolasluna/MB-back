export const enum MonitoringType {
	WATER,
	RISK,
	BURN,
	SOIL_ALERTS,
	USE,
	SOIL,
}

export class ProcessMapJobDto {
	path: string;
	name: string;
	table: string;
	columns: string; // INFO: This must be in the format of t.columnName example: 't.mun, t.prov'
	skipProcess: boolean;
	type: MonitoringType;
}
