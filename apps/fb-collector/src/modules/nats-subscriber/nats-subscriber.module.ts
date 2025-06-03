import { Module } from '@nestjs/common';
import { NatsSubscriberService } from './nats-subscriber.service';
import { PrismaModule } from '@app/common/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NatsSubscriberService],
  exports: [NatsSubscriberService],
})
export class NatsSubscriberModule {}
