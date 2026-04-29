import { useState, useEffect } from 'react';
import { EngineGrid } from './EngineGrid';
import { AlertPanel } from './AlertPanel';
import apiService from '../../services/api';

interface DashboardData {
  status: string;
  fleet: {
    active_engines: number;
    critical_count: number;
    warning_count: number;
    total_risk_count: number;
    mean_rul: number;
  };
  alerts: string[];
  engine_grid: Array<{
    id: string;
    rul: number;
    risk: number;
  }>;
}

export function SimpleDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMachineType, setSelectedMachineType] = useState<string>('all');
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);

  // Machine types for dropdown
  const machineTypes = [
    { id: 'all', name: 'All Machines' },
    { id: 'gas_turbines', name: 'Gas Turbines' },
    { id: 'centrifugal_pumps', name: 'Centrifugal Pumps' },
    { id: 'air_compressors', name: 'Air Compressors' },
    { id: 'power_generators', name: 'Power Generators' },
    { id: 'electric_motors', name: 'Electric Motors' },
  ];

  const handleMachineTypeChange = async (machineType: string) => {
    try {
      setFilterLoading(true);
      setFilterError(null);
      
      if (machineType === 'all') {
        // Fetch all data when "All Machines" is selected
        const data = await apiService.getDashboardData();
        setDashboardData(data);
      } else {
        // Fetch filtered data
        const data = await apiService.filterByMachineType(machineType);
        setDashboardData(data);
      }
      
      setSelectedMachineType(machineType);
    } catch (err) {
      setFilterError(err instanceof Error ? err.message : 'Failed to filter data');
      console.error('Filter error:', err);
    } finally {
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8001/api/telemetry');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: DashboardData = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error Loading Dashboard</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Predictive Maintenance Dashboard</h1>
          
          {/* Machine Type Filter Dropdown */}
          <div className="flex items-center gap-4">
            <label htmlFor="machine-filter" className="text-sm text-gray-400">
              Filter by Machine Type:
            </label>
            <div className="relative">
              <select
                id="machine-filter"
                value={selectedMachineType}
                onChange={(e) => handleMachineTypeChange(e.target.value)}
                disabled={filterLoading}
                className="
                  bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2
                  focus:outline-none focus:border-blue-500 disabled:opacity-50
                  appearance-none cursor-pointer min-w-[200px]
                "
              >
                {machineTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {filterLoading && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Error Display */}
        {filterError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="text-red-400 text-sm">{filterError}</div>
            <button 
              onClick={() => setFilterError(null)}
              className="text-red-400 text-xs underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Fleet Status */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Fleet Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Active Engines:</span>
                <span className="text-green-400 font-bold">{dashboardData?.fleet.active_engines || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Critical Count:</span>
                <span className="text-red-400 font-bold">{dashboardData?.fleet.critical_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Warning Count:</span>
                <span className="text-yellow-400 font-bold">{dashboardData?.fleet.warning_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Mean RUL:</span>
                <span className="text-blue-400 font-bold">{dashboardData?.fleet.mean_rul.toFixed(1) || 0}</span>
              </div>
            </div>
          </div>

          {/* Engine Grid */}
          <div className="bg-gray-800 rounded-lg p-6">
            <EngineGrid engines={dashboardData?.engine_grid || []} />
          </div>
        </div>

          {/* Alerts */}
          <AlertPanel alerts={dashboardData?.alerts || []} />
        </div>

        {/* Additional Info */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">System Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Data Status</h3>
              <p className="text-green-400">{dashboardData?.status || 'Unknown'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Last Updated</h3>
              <p className="text-blue-400">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
