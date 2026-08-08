import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QueryBuilder from '../QueryBuilder';

describe('QueryBuilder component', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn();
  });

  afterEach(() => {
    // @ts-ignore
    jest.resetAllMocks();
  });

  it('builds and runs a query successfully', async () => {
    // Mock fetch response
    // @ts-ignore
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 'ok', data: [{ count: 5 }] }),
    });

    render(<QueryBuilder />);

    // Select event name
    fireEvent.change(screen.getByTestId('event-select'), { target: { value: 'Login' } });

    // Add a filter
    fireEvent.change(screen.getByTestId('filter-property'), { target: { value: 'userId' } });
    fireEvent.change(screen.getByTestId('filter-operator'), { target: { value: '=' } });
    fireEvent.change(screen.getByTestId('filter-value'), { target: { value: '123' } });
    fireEvent.click(screen.getByTestId('add-filter'));

    // Set time range
    fireEvent.change(screen.getByTestId('start-time'), { target: { value: '2023-01-01T00:00' } });
    fireEvent.change(screen.getByTestId('end-time'), { target: { value: '2023-01-02T00:00' } });

    // Select aggregation
    fireEvent.change(screen.getByTestId('aggregation-select'), { target: { value: 'count' } });

    // Run query
    fireEvent.click(screen.getByTestId('run-query'));

    // Wait for result to appear
    await waitFor(() => expect(screen.getByTestId('query-result')).toBeInTheDocument());
    expect(screen.getByTestId('query-result')).toHaveTextContent('"count":5');
    // Ensure fetch called with correct payload
    // @ts-ignore
    expect(global.fetch).toHaveBeenCalledWith('/api/query', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
  });

  it('shows error when event name is missing', async () => {
    render(<QueryBuilder />);
    fireEvent.click(screen.getByTestId('run-query'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Event name is required');
  });
});
