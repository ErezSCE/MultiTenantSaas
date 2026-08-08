import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLogger } from './winston.logger';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLogger(),
  });
  // Enable JSON body parsing
  app.use(json());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API Gateway listening on port ${port}`);
}
bootstrap();
