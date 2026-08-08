export interface QueryDto {
  eventName: string;
  propertyFilters?: Record<string, any>;
  timeRange: {
    from: string; // ISO string
    to: string;   // ISO string
  };
  aggregation: 'count' | 'sum' | 'avg';
  aggregationField?: string; // required for sum/avg
}
