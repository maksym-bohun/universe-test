import { Source, FunnelStage } from '@prisma/client';

export type EventsReportResult = {
  source: Source;
  funnelStage: FunnelStage;
  eventType: string;
  count: number;
};
