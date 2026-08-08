import { Injectable } from '@nestjs/common';

/**
 * Event interface representing a raw event stored in the system.
 */
export interface Event {
  tenantId: string;
  userId: string;
  timestamp: Date;
  // other properties are ignored for DAU calculation
}

/**
 * Result of the daily aggregation for a tenant.
 */
export interface DailyAggregate {
  tenantId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  dau: number;
}

/**
 * Service responsible for calculating Daily Active Users (DAU) per tenant.
 * The calculation counts distinct userIds that performed at least one event
 * on the given date.
 */
@Injectable()
export class DailyAggregationService {
  /**
   * Compute DAU for each tenant based on the provided events.
   * @param events Array of events to consider.
   * @param date The date for which to compute DAU (UTC). Only events whose
   *             timestamp falls on this calendar day are counted.
   * @returns Array of DailyAggregate objects, one per tenant.
   */
  async computeDAU(events: Event[], date: Date): Promise<DailyAggregate[]> {
    // Normalize the target date to UTC midnight start and end
    const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    // Map tenantId -> Set of distinct userIds
    const tenantUserMap: Map<string, Set<string>> = new Map();

    for (const ev of events) {
      const ts = ev.timestamp;
      if (ts >= start && ts < end) {
        let userSet = tenantUserMap.get(ev.tenantId);
        if (!userSet) {
          userSet = new Set<string>();
          tenantUserMap.set(ev.tenantId, userSet);
        }
        userSet.add(ev.userId);
      }
    }

    const aggregates: DailyAggregate[] = [];
    for (const [tenantId, userSet] of tenantUserMap.entries()) {
      aggregates.push({
        tenantId,
        date: start.toISOString().split('T')[0], // YYYY-MM-DD
        dau: userSet.size,
      });
    }
    return aggregates;
  }
}
