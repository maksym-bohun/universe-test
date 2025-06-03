import { Module } from '@nestjs/common';
import { NatsPublisherService } from './nats-publisher.service';

@Module({
  providers: [NatsPublisherService],
  exports: [NatsPublisherService],
})
export class NatsPublisherModule {}
