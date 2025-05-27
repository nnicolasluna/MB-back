import { Injectable } from '@nestjs/common';
import { DBConnection } from '@shared/db/prisma';

export interface IntersectionConfig {
	fromTable: string;
	fromSchema: string;
	alias: string;
	mapping: Record<string, string>;
	conditions: string;
	removeNulls?: boolean;
	columns?: Record<string, string>;
	type?: 'update' | 'delete';
}

@Injectable()
export class IntersectionService {
	constructor(private readonly db: DBConnection) {}

	async intersect(table: string, config: IntersectionConfig[], targetSchema: string) {
		for (const { fromTable, fromSchema, alias, mapping, conditions, removeNulls, columns, type } of config) {
			if (type === 'delete') {
				await this.db.$executeRawUnsafe(`
        DELETE FROM "${targetSchema}".${table} p
        USING "${fromSchema}".${fromTable} ${alias}
        WHERE ${conditions};
      `);
				continue;
			}

			if (columns && Object.keys(columns).length) {
				const cols = Object.entries(columns)
					.map(([name, type]) => `ADD COLUMN IF NOT EXISTS ${name} ${type}`)
					.join(',\n');

				await this.db.$executeRawUnsafe(`
        ALTER TABLE "${targetSchema}".${table}
        ${cols};
      `);
			}

			const setClause = Object.entries(mapping)
				.map(([col, val]) => `${col} = ${val}`)
				.join(', ');

			const updateQuery = `
      UPDATE "${targetSchema}".${table} p
      SET ${setClause}
      FROM "${fromSchema}".${fromTable} ${alias}
      WHERE ${conditions};
    `;

			await this.db.$executeRawUnsafe(updateQuery);

			if (removeNulls) {
				const nullCheck = Object.keys(mapping)
					.map((col) => `p.${col} IS NULL`)
					.join(' OR ');

				await this.db.$executeRawUnsafe(`
        DELETE FROM "${targetSchema}".${table} p
        WHERE ${nullCheck};
      `);
			}
		}
	}
}
