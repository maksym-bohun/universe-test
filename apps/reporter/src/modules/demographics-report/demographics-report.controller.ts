import { Controller, Get, Query } from '@nestjs/common';
import { GetDemographicsReportDto } from './dtos/get-demographics-report.dto';
import { DemographicsReportService } from './demographics-report.service';

@Controller('reports/demographics')
export class DemographicsReportController {
  constructor(private readonly service: DemographicsReportService) {}

  @Get()
  getReport(@Query() dto: GetDemographicsReportDto) {
    // TODO: remove
    console.log('DemographicsReportController');
    return this.service.getReport(dto);
  }
}
