import { Injectable, Logger } from '@nestjs/common';
import { DBConnection } from 'src/shared/db/prisma';
import { ListLogActivityDto } from '../dto/log-activity/list-log-activity.dto';
import { LogActivitiesFilter } from '../dto/log-activity/log-activity.filter';

@Injectable()
export class LogActivityService {
	private logger = new Logger(LogActivityService.name);

	constructor(private db: DBConnection) {}

	async findAll(filter: LogActivitiesFilter) {
		this.logger.log(`Finding all logged activities, with filter: ${filter}`);

		const { where, pagination } = filter;

		const [items, total] = await this.db.$transaction([
			this.db.logActivity.findMany({
				where,
				...pagination,
				include: { user: true },
			}),
			this.db.logActivity.count({ where }),
		]);

		return new ListLogActivityDto(items, total);
	}
}
