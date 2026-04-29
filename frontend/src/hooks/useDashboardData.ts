import { useState, useEffect, useCallback } from 'react';
import apiService, { DashboardResponse } from '../services/api';

interface UseDashboardDataReturn {
  data: DashboardResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setRefreshInterval: (interval: number) => void;
}

export const useDashboardData = (refreshIntervalMs: number = 5000): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(refreshIntervalMs);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardData();
      setData(response);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setRefreshInterval,
  };
};
