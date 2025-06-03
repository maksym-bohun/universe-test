import { Module } from '@nestjs/common';
import { DemographicsReportController } from './demographics-report.controller';
import { DemographicsReportService } from './demographics-report.service';
import { PrismaModule } from '@app/common/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DemographicsReportController],
  providers: [DemographicsReportService],
})
export class DemographicsReportModule {}
