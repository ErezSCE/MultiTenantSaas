import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SaveChartToDashboard from './SaveChartToDashboard';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SaveChartToDashboard component', () => {
  const dummyChart = { type: 'bar', data: {} };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading indicator while fetching dashboards', async () => {
    // Return a promise that never resolves to keep loading state
    const pending = new Promise(() => {});
    mockedAxios.get.mockReturnValue(pending as any);

    render(<SaveChartToDashboard chartData={dummyChart} />);
    expect(screen.getByText(/loading dashboards/i)).toBeInTheDocument();
  });

  it('renders dashboard selector after successful fetch', async () => {
    const dashboards = [
      { id: 'dash-1', name: 'First Dashboard' },
      { id: 'dash-2', name: 'Second Dashboard' },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: dashboards });

    render(<SaveChartToDashboard chartData={dummyChart} />);

    // Wait for loading to disappear
    await waitFor(() => expect(screen.queryByText(/loading dashboards/i)).not.toBeInTheDocument());
    // Dropdown should be present with options
    const select = screen.getByLabelText(/dashboard:/i) as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.options.length).toBe(dashboards.length);
    expect(select.value).toBe(dashboards[0].id);
  });

  it('saves chart and displays shareable link on success', async () => {
    const dashboards = [{ id: 'dash-1', name: 'Dashboard' }];
    mockedAxios.get.mockResolvedValueOnce({ data: dashboards }); // fetch dashboards
    mockedAxios.post.mockResolvedValueOnce({ data: { chartId: 'chart-123' } }); // save chart
    mockedAxios.get.mockResolvedValueOnce({ data: { link: 'https://example.com/share/chart-123' } }); // share link

    render(<SaveChartToDashboard chartData={dummyChart} />);

    // Wait for dashboards to load
    await waitFor(() => expect(screen.queryByText(/loading dashboards/i)).not.toBeInTheDocument());

    const button = screen.getByRole('button', { name: /save to dashboard/i });
    fireEvent.click(button);

    // Saving state should show "Saving..."
    expect(button).toHaveTextContent(/saving.../i);

    // Wait for async actions to complete and link to appear
    await waitFor(() => expect(screen.getByText(/shareable link:/i)).toBeInTheDocument());
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/share/chart-123');
    expect(link).toHaveTextContent('https://example.com/share/chart-123');
  });

  it('displays error message when save fails', async () => {
    const dashboards = [{ id: 'dash-1', name: 'Dashboard' }];
    mockedAxios.get.mockResolvedValueOnce({ data: dashboards }); // fetch dashboards
    mockedAxios.post.mockRejectedValueOnce(new Error('Save failed'));

    render(<SaveChartToDashboard chartData={dummyChart} />);

    await waitFor(() => expect(screen.queryByText(/loading dashboards/i)).not.toBeInTheDocument());
    const button = screen.getByRole('button', { name: /save to dashboard/i });
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/failed to save chart or generate link/i));
  });
});
