import { DashboardService } from './dashboard.service';
import { Dashboard } from './dashboard.entity';
import { Repository } from 'typeorm';

describe('DashboardService - default dashboards', () => {
  let service: DashboardService;
  let mockRepo: Partial<Repository<Dashboard>>;

  beforeEach(() => {
    const stored: Dashboard[] = [];
    mockRepo = {
      create: jest.fn().mockImplementation((dto: Partial<Dashboard>) => ({
        id: 'generated-id', // placeholder, will be overwritten by save if needed
        ...dto,
      } as Dashboard)),
      save: jest.fn().mockImplementation(async (entities: Dashboard[]) => {
        // Simulate DB assign IDs if missing
        entities.forEach((e) => {
          if (!e.id) e.id = Math.random().toString(36).substring(2, 10);
          stored.push(e);
        });
        return entities;
      }),
      find: jest.fn().mockImplementation(async (options: any) => {
        const where = options?.where || {};
        return stored.filter((d) => d.tenantId === where.tenantId);
      }),
      findOne: jest.fn().mockImplementation(async (options: any) => {
        const where = options?.where || {};
        return stored.find((d) => d.id === where.id && d.tenantId === where.tenantId) || null;
      }),
    } as Partial<Repository<Dashboard>>;
    // @ts-ignore - inject mock repo
    service = new DashboardService(mockRepo as Repository<Dashboard>);
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

  it('should throw NotFoundException when dashboard not found', async () => {
    const tenantId = 'tenant-123';
    // No dashboards created for this tenant
    await expect(service.getDashboardById(tenantId, 'nonexistent-id')).rejects.toThrowError('Dashboard nonexistent-id not found for tenant tenant-123');
  });
});
