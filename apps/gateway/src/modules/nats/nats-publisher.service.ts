import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  BeforeApplicationShutdown,
} from '@nestjs/common';
import { NatsPublisher } from '../../lib/nats/nats.publisher';

@Injectable()
export class NatsPublisherService
  implements OnModuleInit, OnModuleDestroy, BeforeApplicationShutdown
{
  private publisher: NatsPublisher;
  private isShuttingDown = false;
  private pendingPublishes = 0;

  constructor() {
    console.log('[NatsPublisherService] constructor');
  }

  async onModuleInit() {
    console.log('[NatsPublisherService] onModuleInit');
    this.publisher = new NatsPublisher();
    await this.publisher.connect();
  }

  async publishEvent(subject: string, payload: any) {
    if (this.isShuttingDown) {
      throw new Error('Service is shutting down, cannot publish new events');
    }

    this.pendingPublishes++;
    try {
      await this.publisher.publish(subject, payload);
    } finally {
      this.pendingPublishes--;
    }
  }

  async onModuleDestroy() {
    console.log('[NatsPublisherService] onModuleDestroy');
    await this.shutdown();
  }

  async beforeApplicationShutdown() {
    await this.shutdown();
  }

  private async shutdown() {
    this.isShuttingDown = true;

    while (this.pendingPublishes > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (this.publisher) {
      await this.publisher.disconnect();
    }
  }
}
