import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { HealthController } from './health.controller';
import { MetricsController } from './metrics.controller';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [],
  controllers: [HealthController, MetricsController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
