import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { NatsPublisherModule } from '../nats/nats-publisher.module';
import { LoggerModule } from 'nestjs-pino';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [NatsPublisherModule, LoggerModule.forRoot(), MetricsModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
