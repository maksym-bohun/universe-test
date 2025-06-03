import { Controller, Get, Query } from '@nestjs/common';
import { GetRevenueReportDto } from './dtos/get-revenue-report.dto';
import { RevenueReportService } from './revenue-report.service';

@Controller('reports/revenue')
export class RevenueReportController {
  constructor(private readonly revenueReportService: RevenueReportService) {}

  @Get()
  getRevenueReport(@Query() dto: GetRevenueReportDto) {
    return this.revenueReportService.getReport(dto);
  }
}
