import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

/**
 * NestJS module that provides the DashboardService.
 */
@Module({
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
