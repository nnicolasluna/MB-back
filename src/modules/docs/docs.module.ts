import { Module } from '@nestjs/common';
import { DocsController } from './controllers/docs.controller';
import { DocsService } from './services/docs.service';
import { SubDocsController } from './controllers/Subdocs.controller';
import { SubDocsService } from './services/Subdocs.service';

@Module({
	controllers: [DocsController, SubDocsController],
	providers: [DocsService, SubDocsService],
})
export class DocsModule { }
