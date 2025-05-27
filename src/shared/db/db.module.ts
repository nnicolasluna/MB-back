import { Global, Module } from '@nestjs/common';
import { DBConnection } from './prisma';

@Global()
@Module({
	providers: [DBConnection],
	exports: [DBConnection],
})
export class DbModule {}
