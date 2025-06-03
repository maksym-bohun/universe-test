import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common/database/prisma.service';
import { GetDemographicsReportDto } from './dtos/get-demographics-report.dto';

@Injectable()
export class DemographicsReportService {
  constructor(private readonly prisma: PrismaService) {}

  async getReport(dto: GetDemographicsReportDto) {
    const { from, to, source, funnelStage, eventType } = dto;

    const events = await this.prisma.event.findMany({
      where: {
        timestamp: {
          gte: new Date(from),
          lte: new Date(to),
        },
        ...(source && { source }),
        ...(funnelStage && { funnelStage }),
        ...(eventType && { eventType }),
      },
      select: {
        data: true,
      },
    });

    const userStatsMap = new Map<
      string,
      {
        gender: string;
        age: number;
        country: string;
        city: string;
        count: number;
      }
    >();

    for (const { data } of events) {
      let parsedData;
      if (typeof data === 'string') {
        parsedData = JSON.parse(data);
      } else {
        parsedData = data;
      }
      if (!parsedData) continue;
      const user = parsedData.user;
      if (!user) continue;

      const key = `${user.gender}-${user.age}-${user.location?.country}-${user.location?.city}`;
      if (!userStatsMap.has(key)) {
        userStatsMap.set(key, {
          gender: user.gender,
          age: user.age,
          country: user.location?.country ?? 'unknown',
          city: user.location?.city ?? 'unknown',
          count: 1,
        });
      } else {
        userStatsMap.get(key)!.count += 1;
      }
    }

    return Array.from(userStatsMap.values());
  }
}
