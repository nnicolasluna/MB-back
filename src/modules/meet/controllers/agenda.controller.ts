import { Body, Controller, Get, Post } from '@nestjs/common';
import { AgendaService } from '../services/agenda.service';

@Controller('agenda')
export class AgendaController {
    constructor(private readonly agendaService: AgendaService) { }

    @Get()
    findAll(): any {
        return this.agendaService.findAll();
    }
    @Post()
    create(@Body() formUserDto: any) {
        return this.agendaService.create(formUserDto);
    }
}
