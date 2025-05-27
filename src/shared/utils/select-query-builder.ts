export type ColumnField = {
	field: string;
	operation?: 'SUM' | 'COUNT' | 'AVG' | 'MAX' | 'MIN';
	as?: string;
};

export type Condition = {
	field: string;
	operator: '=' | '!=' | '<' | '>' | '<=' | '>=' | 'LIKE' | 'IN' | 'ILIKE' | 'IIN';
	value: any;
};

export type WhereClause = {
	conditions: Condition[];
	logicalOperator?: 'AND' | 'OR';
};

export class SelectQueryBuilder {
	private _q = 'SELECT';
	private _columns = '*';
	private _where = '';
	private _limit = '';
	private _groupBy = '';
	private _orderBy = '';

	constructor(
		private table: string,
		private schema = 'cartographic',
	) {}

	public setTable(table: string) {
		this.table = table;
		return this;
	}

	public setColumns(columns: Array<string | ColumnField>) {
		const columnsParsed: string[] = [];
		columns.forEach((column) => {
			if (typeof column === 'string') columnsParsed.push(column);
			else {
				let columnString = column.field;
				if (column.operation) columnString = `${column.operation}(${column.field})`;
				if (column.as) columnString += ` AS ${column.as}`;
				columnsParsed.push(columnString);
			}
		});
		this._columns = columnsParsed.join(', ');

		return this;
	}

	public addWhere(where: WhereClause | WhereClause[]) {
		if (this._where === '') this._where = 'WHERE';

		if (Array.isArray(where)) {
			where.forEach(this.addWhereToQuery.bind(this));
		} else {
			this.addWhereToQuery(where);
		}

		return this;
	}

	private addWhereToQuery(where: WhereClause) {
		if (where.conditions.length < 1) return;

		const conditions = where.conditions.map(this.parseCondition.bind(this));
		const joinOperator = where.logicalOperator || 'AND';

		if (this._where === 'WHERE') this._where += ` ${conditions.join(` ${joinOperator} `)}`;
		else this._where += ` AND ${conditions.join(` ${joinOperator} `)}`;
	}

	private parseCondition({ field, operator, value }: Condition) {
		if (operator === 'IN') {
			return `${field} ${operator} (${value.map((v: any) => `'${v}'`).join(',')})`;
		} else if (operator === 'IIN') {
			return `LOWER(${field}) IN (${value.map((v: any) => `LOWER('${v}')`).join(',')})`;
		} else {
			return `${field} ${operator} ${value}`;
		}
	}

	public setLimit(limit: number) {
		this._limit = `LIMIT ${limit}`;
		return this;
	}

	public groupBy(field: string[]) {
		this._groupBy = `GROUP BY ${field}`;
		return this;
	}

	public orderBy(field: string, order: 'ASC' | 'DESC') {
		this._orderBy = `ORDER BY ${field} ${order}`;
		return this;
	}

	public build() {
		this._q += ` ${this._columns} FROM ${this.schema}.${this.table}`;

		if (this._where !== '') this._q += ` ${this._where}`;

		if (this._groupBy !== '') this._q += ` ${this._groupBy}`;

		if (this._orderBy !== '') this._q += ` ${this._orderBy}`;

		if (this._limit !== '') this._q += ` ${this._limit}`;

		return this._q + ';';
	}
}
