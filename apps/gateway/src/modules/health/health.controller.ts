import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  public live() {
    // TODO: remove
    console.log('Health Controller');
    return { status: 'OK' };
  }
}
