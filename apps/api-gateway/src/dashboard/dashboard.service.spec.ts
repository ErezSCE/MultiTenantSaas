import { DashboardService } from './dashboard.service';

describe('DashboardService - default dashboards', () => {
  let service: DashboardService;

  beforeEach(() => {
    service = new DashboardService();
  });

  it('should create default dashboards for a new tenant', async () => {
    const tenantId = 'tenant-123';
    await service.createDefaultDashboards(tenantId);
    const dashboards = await service.getDashboardsByTenant(tenantId);
    expect(dashboards).toHaveLength(3);
    const names = dashboards.map((d) => d.name).sort();
    expect(names).toEqual(['Active Users', 'Event Volume', 'Top Events']);
    // Ensure each dashboard has the correct tenantId
    dashboards.forEach((d) => {
      expect(d.tenantId).toBe(tenantId);
      expect(d.id).toBeDefined();
    });
  });
});
