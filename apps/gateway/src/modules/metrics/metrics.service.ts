import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  acceptedEvents = new client.Counter({
    name: 'gateway_accepted_events_total',
    help: 'Total number of accepted events',
    labelNames: ['source'],
  });

  processedEvents = new client.Counter({
    name: 'gateway_processed_events_total',
    help: 'Total number of processed events',
    labelNames: ['source'],
  });

  failedEvents = new client.Counter({
    name: 'gateway_failed_events_total',
    help: 'Total number of failed events',
    labelNames: ['source', 'error_type'],
  });

  onModuleInit() {
    client.collectDefaultMetrics();

    client.register.registerMetric(this.acceptedEvents);
    client.register.registerMetric(this.processedEvents);
    client.register.registerMetric(this.failedEvents);
  }

  incAccepted(source: string, count = 1) {
    this.acceptedEvents.inc({ source }, count);
  }

  incProcessed(source: string, count = 1) {
    this.processedEvents.inc({ source }, count);
  }

  incFailed(source: string, errorType: string, count = 1) {
    this.failedEvents.inc({ source, error_type: errorType }, count);
  }
}
