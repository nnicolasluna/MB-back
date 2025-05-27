import { Global, Module } from '@nestjs/common';
import { SystemAccessService } from './system-access.service';
import { DbModule } from 'src/shared/db/db.module';

@Global()
@Module({
	providers: [SystemAccessService],
	exports: [SystemAccessService],
	imports: [DbModule],
})
export class SystemAccessModule {}
