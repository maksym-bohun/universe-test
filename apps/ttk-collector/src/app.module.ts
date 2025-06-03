import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NatsSubscriberModule } from './modules/nats-subscriber/nats-subscriber.module';

@Module({
  imports: [NatsSubscriberModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
