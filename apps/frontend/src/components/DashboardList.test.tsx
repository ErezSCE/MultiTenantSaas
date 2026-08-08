import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardList from './DashboardList';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DashboardList component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading indicator while fetching dashboards', async () => {
    // Mock a pending promise to keep loading state
    const promise = new Promise(() => {});
    mockedAxios.get.mockReturnValue(promise as any);

    render(<DashboardList />);
    expect(screen.getByText(/loading dashboards/i)).toBeInTheDocument();
  });

  it('renders list of dashboards after successful fetch', async () => {
    const dashboards = [
      { id: '1', name: 'Dashboard One' },
      { id: '2', name: 'Dashboard Two' },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: dashboards });

    render(<DashboardList />);

    // Wait for loading to disappear and list items to appear
    await waitFor(() => expect(screen.queryByText(/loading dashboards/i)).not.toBeInTheDocument());
    dashboards.forEach((d) => {
      expect(screen.getByText(d.name)).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    render(<DashboardList />);

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/failed to load dashboards/i));
  });
});
