import { Injectable } from '@nestjs/common';
import { QueryDto } from './query.dto';
import { SelectQueryBuilder, Repository, getRepository } from 'typeorm';

/**
 * Service responsible for translating a QueryDto into a TypeORM query,
 * executing it and returning raw results.
 */
@Injectable()
export class QueryService {
  async executeQuery(dto: QueryDto): Promise<any[]> {
    const qb = this.buildQueryBuilder(dto);
    // For simplicity we execute and return raw results.
    return qb.getRawMany();
  }

  /**
   * Build a TypeORM SelectQueryBuilder based on the provided DTO.
   * The implementation focuses on the required fields for the assignment.
   */
  buildQueryBuilder(dto: QueryDto): SelectQueryBuilder<any> {
    const repository = getRepository('events');
    const qb = repository.createQueryBuilder('e');

    // Select aggregation
    const aggregation = this.buildAggregationSelect(dto);
    qb.select(aggregation);

    // Event name filter
    qb.where('e.eventName = :eventName', { eventName: dto.eventName });

    // Time range filter
    qb.andWhere('e.timestamp BETWEEN :from AND :to', {
      from: dto.timeRange.from,
      to: dto.timeRange.to,
    });

    // Property filters – assume events table has a jsonb column `properties`
    if (dto.propertyFilters && Object.keys(dto.propertyFilters).length > 0) {
      const filters = dto.propertyFilters;
      const jsonCondition = Object.keys(filters)
        .map((key, idx) => `e.properties @> :prop${idx}`)
        .join(' AND ');
      const params = Object.keys(filters).reduce((acc, key, idx) => {
        acc[`prop${idx}`] = JSON.stringify({ [key]: filters[key] });
        return acc;
      }, {} as Record<string, any>);
      qb.andWhere(jsonCondition, params);
    }

    return qb;
  }

  private buildAggregationSelect(dto: QueryDto): string {
    const alias = 'result';
    switch (dto.aggregation) {
      case 'count':
        return `COUNT(*) as "${alias}"`;
      case 'sum':
        if (!dto.aggregationField) {
          throw new Error('aggregationField is required for sum aggregation');
        }
        // Assuming numeric field stored in properties JSON
        return `SUM((e.properties->>'${dto.aggregationField}')::numeric) as "${alias}"`;
      case 'avg':
        if (!dto.aggregationField) {
          throw new Error('aggregationField is required for avg aggregation');
        }
        return `AVG((e.properties->>'${dto.aggregationField}')::numeric) as "${alias}"`;
      default:
        throw new Error(`Unsupported aggregation type: ${dto.aggregation}`);
    }
  }
}
