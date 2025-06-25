import { Module } from '@nestjs/common';
import { DocsController } from './controllers/docs.controller';
import { DocsService } from './services/docs.service';

@Module({
	controllers: [DocsController],
	providers: [DocsService],
})
export class DocsModule {}
