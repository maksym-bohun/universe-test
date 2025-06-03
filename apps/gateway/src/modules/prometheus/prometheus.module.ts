import { Module, Global } from '@nestjs/common';
import * as client from 'prom-client';

@Global()
@Module({
  providers: [
    {
      provide: 'PROM_CLIENT',
      useValue: client,
    },
  ],
  exports: ['PROM_CLIENT'],
})
export class PrometheusModule {}
