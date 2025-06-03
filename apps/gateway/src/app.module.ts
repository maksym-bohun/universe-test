import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import { EventsModule } from './modules/events/events.module';
import { NatsPublisherModule } from './modules/nats/nats-publisher.module';
import { PrometheusModule } from './modules/prometheus/prometheus.module';
import { MetricsModule } from './modules/metrics/metrics.module';

@Module({
  imports: [
    HealthModule,
    EventsModule,
    NatsPublisherModule,
    PrometheusModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
