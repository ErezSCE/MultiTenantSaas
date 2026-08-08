import { Injectable } from '@nestjs/common';

export interface Dashboard {
  id: string;
  tenantId: string;
  name: string;
  charts: any[]; // Simplified for this example
}

/**
 * Service responsible for managing dashboards. For the purpose of this kata we
 * use an in‑memory array to simulate persistence.
 *
 * The `createDefaultDashboards` method is called after a tenant is created and
 * inserts a predefined set of dashboards for that tenant.
 */
@Injectable()
export class DashboardService {
  /** In‑memory store of dashboards */
  private readonly dashboards: Dashboard[] = [];

  /** Predefined dashboards that should exist for every new tenant */
  private readonly defaultDashboardTemplates: Omit<Dashboard, 'id' | 'tenantId'>[] = [
    { name: 'Event Volume', charts: [] },
    { name: 'Active Users', charts: [] },
    { name: 'Top Events', charts: [] },
  ];

  /**
   * Creates the default dashboards for a given tenant.
   * @param tenantId The identifier of the tenant.
   */
  async createDefaultDashboards(tenantId: string): Promise<void> {
    // In a real implementation this would be a DB transaction.
    const newDashboards = this.defaultDashboardTemplates.map((tpl) => ({
      id: this.generateId(),
      tenantId,
      name: tpl.name,
      charts: tpl.charts,
    }));
    this.dashboards.push(...newDashboards);
  }

  /** Helper to retrieve dashboards for a tenant – used in tests */
  async getDashboardsByTenant(tenantId: string): Promise<Dashboard[]> {
    return this.dashboards.filter((d) => d.tenantId === tenantId);
  }

  /** Simple deterministic id generator for the example */
  private generateId(): string {
    // Using current timestamp + random for uniqueness in this mock.
    return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }
}
