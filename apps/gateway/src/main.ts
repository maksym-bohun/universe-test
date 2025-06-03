import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '200mb' }));
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing app...');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, closing app...');
    await app.close();
    process.exit(0);
  });
}
bootstrap();
