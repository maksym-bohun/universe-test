import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsReportModule } from './modules/events-report/events-report.module';
import { RevenueReportModule } from './modules/revenue-report/revenue-report.module';
import { DemographicsReportModule } from './modules/demographics-report/demographics-report.module';
import { PrismaModule } from '@app/common/database/prisma.module';

@Module({
  imports: [EventsReportModule, RevenueReportModule, DemographicsReportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
