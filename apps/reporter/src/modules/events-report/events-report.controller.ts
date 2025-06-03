import { Controller, Get, Query } from '@nestjs/common';
import { EventsReportService } from './events-report.service';
import { GetEventsReportDto } from './dtos/get-events-report.dto';

@Controller('reports/events')
export class EventsReportController {
  constructor(private readonly eventsReportService: EventsReportService) {}

  @Get()
  getEventsReport(@Query() dto: GetEventsReportDto) {
    return this.eventsReportService.getReport(dto);
  }
}
