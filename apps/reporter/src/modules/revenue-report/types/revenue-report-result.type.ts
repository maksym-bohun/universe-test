import { Source, FunnelStage } from '@prisma/client';

export type RevenueReportResult = {
  source: Source;
  funnelStage: FunnelStage;
  eventType: string;
  totalRevenue: number;
};
