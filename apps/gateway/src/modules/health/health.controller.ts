import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  public live() {
    return { status: 'OK' };
  }
}
