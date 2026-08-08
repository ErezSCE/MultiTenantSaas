import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Props for the SaveChartToDashboard component.
 *
 * `chartData` is an opaque object that the backend understands – it could be a
 * query definition, a Vega spec, etc. The component does not interpret it; it
 * simply forwards it to the API when the user chooses a dashboard.
 */
interface SaveChartToDashboardProps {
  chartData: Record<string, unknown>;
}

interface Dashboard {
  id: string;
  name: string;
}

/**
 * SaveChartToDashboard
 *
 * Allows a tenant member to:
 *   1. Choose one of their dashboards.
 *   2. Save the supplied chart to the selected dashboard.
 *   3. Generate a read‑only share link for the saved chart.
 *
 * The component follows the same UX pattern as `DashboardList` – it shows a
 * loading indicator while data is being fetched and surface errors when API
 * calls fail.
 */
const SaveChartToDashboard: React.FC<SaveChartToDashboardProps> = ({ chartData }) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selectedDashboardId, setSelectedDashboardId] = useState<string>('');
  const [loadingDashboards, setLoadingDashboards] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [shareLink, setShareLink] = useState<string>('');

  // Load dashboards on mount
  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const response = await axios.get<Dashboard[]>('/api/dashboards');
        setDashboards(response.data);
        if (response.data.length > 0) {
          setSelectedDashboardId(response.data[0].id);
        }
      } catch (err) {
        setError('Failed to load dashboards');
      } finally {
        setLoadingDashboards(false);
      }
    };
    fetchDashboards();
  }, []);

  const handleSave = async () => {
    if (!selectedDashboardId) {
      setError('Please select a dashboard');
      return;
    }
    setSaving(true);
    setError('');
    try {
      // 1. Save chart to dashboard
      const saveResp = await axios.post<{ chartId: string }>(
        `/api/dashboards/${selectedDashboardId}/charts`,
        { chartData }
      );
      const chartId = saveResp.data.chartId;

      // 2. Request a read‑only share link for the saved chart
      const linkResp = await axios.get<{ link: string }>(`/api/charts/${chartId}/share-link`);
      setShareLink(linkResp.data.link);
    } catch (err) {
      setError('Failed to save chart or generate link');
    } finally {
      setSaving(false);
    }
  };

  if (loadingDashboards) {
    return <div>Loading dashboards...</div>;
  }

  if (error) {
    return <div role="alert">{error}</div>;
  }

  return (
    <div>
      <label htmlFor="dashboard-select">Dashboard:</label>
      <select
        id="dashboard-select"
        value={selectedDashboardId}
        onChange={(e) => setSelectedDashboardId(e.target.value)}
        disabled={saving}
      >
        {dashboards.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
      <button onClick={handleSave} disabled={saving} style={{ marginLeft: '8px' }}>
        {saving ? 'Saving...' : 'Save to Dashboard'}
      </button>
      {shareLink && (
        <div style={{ marginTop: '8px' }}>
          <strong>Shareable link:</strong>{' '}
          <a href={shareLink} target="_blank" rel="noopener noreferrer">
            {shareLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default SaveChartToDashboard;
