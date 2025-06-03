import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common/database/prisma.service';
import { GetEventsReportDto } from './dtos/get-events-report.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsReportService {
  constructor(private readonly prisma: PrismaService) {}

  async getReport(dto: GetEventsReportDto) {
    const { from, to, source, funnelStage, eventType } = dto;

    const where: Prisma.EventWhereInput = {
      timestamp: {
        gte: new Date(from),
        lte: new Date(to),
      },
      ...(source && { source }),
      ...(funnelStage && { funnelStage }),
      ...(eventType && { eventType }),
    };

    const grouped = await this.prisma.event.groupBy({
      by: ['source', 'funnelStage', 'eventType'],
      where,
      _count: {
        _all: true,
      },
    });

    return grouped.map((g) => ({
      source: g.source,
      funnelStage: g.funnelStage,
      eventType: g.eventType,
      count: g._count._all,
    }));
  }
}
