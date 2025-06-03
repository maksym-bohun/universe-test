import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { Source, FunnelStage } from '@prisma/client';

export class GetEventsReportDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;

  @IsOptional()
  @IsEnum(Source)
  source?: Source;

  @IsOptional()
  @IsEnum(FunnelStage)
  funnelStage?: FunnelStage;

  @IsOptional()
  @IsString()
  eventType?: string;
}
