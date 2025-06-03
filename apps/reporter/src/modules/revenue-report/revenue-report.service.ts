import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common/database/prisma.service';
import { GetRevenueReportDto } from './dtos/get-revenue-report.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RevenueReportService {
  constructor(private readonly prisma: PrismaService) {}

  async getReport(dto: GetRevenueReportDto) {
    const { from, to, source, funnelStage, eventType } = dto;

    const where: Prisma.EventWhereInput = {
      timestamp: {
        gte: new Date(from),
        lte: new Date(to),
      },
      ...(source && { source }),
      ...(funnelStage && { funnelStage }),
      ...(eventType && { eventType }),
      revenue: {
        not: null,
      },
    };

    const grouped = await this.prisma.event.groupBy({
      by: ['source', 'funnelStage', 'eventType'],
      where,
      _sum: {
        revenue: true,
      },
    });

    return grouped.map((g) => ({
      source: g.source,
      funnelStage: g.funnelStage,
      eventType: g.eventType,
      totalRevenue: g._sum.revenue ?? 0,
    }));
  }
}
