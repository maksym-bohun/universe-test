import { Module } from '@nestjs/common';
import { EventsReportService } from './events-report.service';
import { EventsReportController } from './events-report.controller';
import { PrismaModule } from '@app/common/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventsReportController],
  providers: [EventsReportService],
})
export class EventsReportModule {}
