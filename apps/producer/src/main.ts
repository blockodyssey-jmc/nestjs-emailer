import { NestFactory } from '@nestjs/core';
import { ProducerModule } from './producer.module';

async function bootstrap() {
  const app = await NestFactory.create(ProducerModule, {
    logger: ['error', 'log'],
  });

  await app.listen(3000);
}
bootstrap();
