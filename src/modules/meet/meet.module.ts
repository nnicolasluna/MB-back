import { Module } from '@nestjs/common';
import { AgendaController } from './controllers/agenda.controller';
import { MeetController } from './controllers/meet.controller';
import { MeetService } from './services/meet.service';
import { AgendaService } from './services/agenda.service';

@Module({
  controllers: [MeetController, AgendaController],
  providers: [MeetService, AgendaService],
})
export class MeetModule { }
