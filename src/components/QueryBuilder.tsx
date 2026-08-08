import React, { useState } from 'react';

type Filter = {
  property: string;
  operator: string;
  value: string;
};

type Query = {
  eventName: string;
  filters: Filter[];
  timeRange: { start: string; end: string };
  aggregation: string;
};

const defaultQuery: Query = {
  eventName: '',
  filters: [],
  timeRange: { start: '', end: '' },
  aggregation: 'count',
};

const QueryBuilder: React.FC = () => {
  const [query, setQuery] = useState<Query>(defaultQuery);
  const [newFilter, setNewFilter] = useState<Filter>({ property: '', operator: '=', value: '' });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const eventOptions = ['Login', 'Purchase'];
  const aggregationOptions = ['count', 'sum', 'avg'];
  const operatorOptions = ['=', '!=', '>', '<'];

  const handleAddFilter = () => {
    if (!newFilter.property || !newFilter.value) {
      setError('Filter property and value are required');
      return;
    }
    setQuery((prev) => ({
      ...prev,
      filters: [...prev.filters, newFilter],
    }));
    setNewFilter({ property: '', operator: '=', value: '' });
    setError('');
  };

  const handleRun = async () => {
    // Basic validation
    if (!query.eventName) {
      setError('Event name is required');
      return;
    }
    if (!query.timeRange.start || !query.timeRange.end) {
      setError('Time range is required');
      return;
    }
    setError('');
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Unexpected error');
    }
  };

  return (
    <div data-testid="query-builder">
      <h2>Query Builder</h2>
      {error && <div role="alert" style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>
          Event Name:
          <select
            data-testid="event-select"
            value={query.eventName}
            onChange={(e) => setQuery({ ...query, eventName: e.target.value })}
          >
            <option value="">Select event</option>
            {eventOptions.map((ev) => (
              <option key={ev} value={ev}>
                {ev}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <h4>Filters</h4>
        {query.filters.map((f, idx) => (
          <div key={idx} data-testid="filter-item">
            {f.property} {f.operator} {f.value}
          </div>
        ))}
        <div style={{ marginTop: '0.5rem' }}>
          <input
            placeholder="Property"
            data-testid="filter-property"
            value={newFilter.property}
            onChange={(e) => setNewFilter({ ...newFilter, property: e.target.value })}
          />
          <select
            data-testid="filter-operator"
            value={newFilter.operator}
            onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value })}
          >
            {operatorOptions.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
          <input
            placeholder="Value"
            data-testid="filter-value"
            value={newFilter.value}
            onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
          />
          <button data-testid="add-filter" onClick={handleAddFilter}>
            Add Filter
          </button>
        </div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <label>
          Start Time:
          <input
            type="datetime-local"
            data-testid="start-time"
            value={query.timeRange.start}
            onChange={(e) => setQuery({ ...query, timeRange: { ...query.timeRange, start: e.target.value } })}
          />
        </label>
        <label style={{ marginLeft: '1rem' }}>
          End Time:
          <input
            type="datetime-local"
            data-testid="end-time"
            value={query.timeRange.end}
            onChange={(e) => setQuery({ ...query, timeRange: { ...query.timeRange, end: e.target.value } })}
          />
        </label>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <label>
          Aggregation:
          <select
            data-testid="aggregation-select"
            value={query.aggregation}
            onChange={(e) => setQuery({ ...query, aggregation: e.target.value })}
          >
            {aggregationOptions.map((agg) => (
              <option key={agg} value={agg}>
                {agg}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button data-testid="run-query" onClick={handleRun}>
          Run Query
        </button>
      </div>
      {result && (
        <div data-testid="query-result" style={{ marginTop: '1rem' }}>
          <pre>{JSON.stringify(result)}</pre>
        </div>
      )}
    </div>
  );
};

export default QueryBuilder;
