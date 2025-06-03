import { Injectable } from '@nestjs/common';

import { NatsPublisherService } from '../nats/nats-publisher.service';
import {
  FacebookEvent,
  TiktokEvent,
} from '@app/common/interfaces/event-type.interface';

@Injectable()
export class EventsService {
  constructor(private readonly natsPublisherService: NatsPublisherService) {}

  public async handleEvents(events: (FacebookEvent | TiktokEvent)[]) {
    for (const event of events) {
      const subject = this.getSubjectFromEvent(event);
      await this.natsPublisherService.publishEvent(subject, event);
    }
  }

  private getSubjectFromEvent(event: FacebookEvent | TiktokEvent): string {
    const source = event.source;
    const stage = event.funnelStage;
    return `${source === 'facebook' ? 'fb' : 'ttk'}.events.${stage}`;
  }
}
