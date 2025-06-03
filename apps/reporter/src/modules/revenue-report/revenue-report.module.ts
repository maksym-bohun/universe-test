import { Module } from '@nestjs/common';
import { RevenueReportController } from './revenue-report.controller';
import { RevenueReportService } from './revenue-report.service';
import { PrismaModule } from '@app/common/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RevenueReportController],
  providers: [RevenueReportService],
})
export class RevenueReportModule {}
