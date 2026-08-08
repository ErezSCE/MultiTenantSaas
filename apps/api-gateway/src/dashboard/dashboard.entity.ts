import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Dashboard entity persisted in the database.
 * For simplicity, charts are stored as JSON. In a real implementation this could be a relation.
 */
@Entity({ name: 'dashboards' })
export class Dashboard {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'tenant_id', type: 'varchar' })
  tenantId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  // Storing charts as JSON; adjust type as needed.
  @Column({ type: 'jsonb', nullable: true })
  charts!: any[];
}
