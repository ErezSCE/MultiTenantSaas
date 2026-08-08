import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dashboard } from './dashboard.entity';

/**
 * Dashboard service using TypeORM for persistence.
 */
@Injectable()
export class DashboardService {
  /** Predefined dashboards that should exist for every new tenant */
  private readonly defaultDashboardTemplates: Omit<Dashboard, 'id' | 'tenantId'>[] = [
    { name: 'Event Volume', charts: [] },
    { name: 'Active Users', charts: [] },
    { name: 'Top Events', charts: [] },
  ];

  constructor(
    @InjectRepository(Dashboard)
    private readonly dashboardRepo: Repository<Dashboard>,
  ) {}

  /**
   * Creates the default dashboards for a given tenant.
   * @param tenantId The identifier of the tenant.
   */
  async createDefaultDashboards(tenantId: string): Promise<void> {
    const dashboards = this.defaultDashboardTemplates.map((tpl) =>
      this.dashboardRepo.create({ tenantId, name: tpl.name, charts: tpl.charts }),
    );
    await this.dashboardRepo.save(dashboards);
  }

  /** Retrieve dashboards for a tenant */
  async getDashboardsByTenant(tenantId: string): Promise<Dashboard[]> {
    return this.dashboardRepo.find({ where: { tenantId } });
  }
}
