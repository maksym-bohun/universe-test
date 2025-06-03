import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  constructor() {
    // TODO: remove
    console.log('start');
  }

  async onModuleInit() {
    // TODO: remove
    console.log('START');
  }
}
