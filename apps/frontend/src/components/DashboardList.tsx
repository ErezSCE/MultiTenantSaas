import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Dashboard {
  id: string;
  name: string;
}

/**
 * DashboardList
 *
 * Fetches the list of dashboards for the currently authenticated tenant
 * from the `/api/dashboards` endpoint and renders them.
 *
 * The component displays a loading indicator while the request is in
 * progress and an error message if the request fails.
 */
const DashboardList: React.FC = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const response = await axios.get<Dashboard[]>('/api/dashboards');
        setDashboards(response.data);
      } catch (err) {
        // In a real app we would surface a more detailed error based on err.response
        setError('Failed to load dashboards');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboards();
  }, []);

  if (loading) {
    return <div>Loading dashboards...</div>;
  }

  if (error) {
    return <div role="alert">{error}</div>;
  }

  return (
    <ul>
      {dashboards.map((dashboard) => (
        <li key={dashboard.id}>{dashboard.name}</li>
      ))}
    </ul>
  );
};

export default DashboardList;
