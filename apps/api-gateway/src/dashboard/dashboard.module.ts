import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { Dashboard } from './dashboard.entity';

/**
 * NestJS module that provides the DashboardService with TypeORM repository.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Dashboard])],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
