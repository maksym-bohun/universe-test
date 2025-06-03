import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { NatsSubscriber } from '../../lib/nats/nats.subscriber';
import { PrismaService } from '@app/common/database/prisma.service';
import { EventSchema, eventSchema } from '@app/common/schemas/events.schema';
import { nanoid } from 'nanoid';
import {
  addCorrelationId,
  getCorrelationId,
} from '@app/common/logger/correlation-id';
import { Event } from '@app/common/interfaces/event-type.interface';
import { extractRevenue } from '@app/common/utils/extract-revenue.util';

@Injectable()
export class NatsSubscriberService implements OnModuleInit, OnModuleDestroy {
  private subscriber: NatsSubscriber;
  private readonly logger = new Logger(NatsSubscriberService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async onModuleInit() {
    this.logger.log('Initializing NatsSubscriberService...');
    this.subscriber = new NatsSubscriber();
    await this.subscriber.connect();

    await this.subscriber.subscribe(
      'fb.events.top',
      this.handleFacebookEvent('top'),
    );

    await this.subscriber.subscribe(
      'fb.events.bottom',
      this.handleFacebookEvent('bottom'),
    );

    this.logger.log('Subscribed to NATS topics');
  }

  private handleFacebookEvent(stage: 'top' | 'bottom') {
    return async (rawEvent: unknown) => {
      const correlationId = getCorrelationId() || nanoid();
      addCorrelationId(correlationId);
      this.logger.verbose(
        `[${correlationId}] Received Facebook ${stage} event`,
      );

      try {
        const event: EventSchema = eventSchema.parse(rawEvent);
        const revenue = extractRevenue(event);

        await this.prismaService.event.create({
          data: {
            eventId: event.eventId,
            timestamp: new Date(event.timestamp),
            source: event.source,
            funnelStage: event.funnelStage,
            eventType: event.eventType,
            data: event.data,
            revenue,
          },
        });

        this.logger.log(
          `[${correlationId}] Facebook ${stage} event persisted: ${event.eventId}`,
        );
      } catch (error) {
        this.logger.error(
          `[${correlationId}] Failed to process Facebook ${stage} event`,
          error,
        );
      }
    };
  }

  async onModuleDestroy() {
    if (this.subscriber) {
      await this.subscriber.close();
      this.logger.log('NATS connection closed');
    }
  }
}
