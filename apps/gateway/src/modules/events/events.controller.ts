import { Body, Controller, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import {
  FacebookEvent,
  TiktokEvent,
} from '@app/common/interfaces/event-type.interface';
import { Logger } from 'nestjs-pino';
import { MetricsService } from '../metrics/metrics.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly logger: Logger,
    private readonly metricsService: MetricsService,
  ) {}

  @Post()
  public async handleEvent(@Body() events: (FacebookEvent | TiktokEvent)[]) {
    this.logger.debug({ events }, 'Received events');

    for (const event of events) {
      const source = 'source' in event ? event.source : 'unknown';
      this.metricsService.incAccepted(source);
    }

    try {
      await this.eventsService.handleEvents(events);

      for (const event of events) {
        const source = 'source' in event ? event.source : 'unknown';
        this.metricsService.incProcessed(source);
      }
    } catch (error) {
      for (const event of events) {
        const source = 'source' in event ? event.source : 'unknown';
        this.metricsService.incFailed(source, error.name || 'unknown_error');
      }
      throw error;
    }

    return { status: 'ok' };
  }
}
