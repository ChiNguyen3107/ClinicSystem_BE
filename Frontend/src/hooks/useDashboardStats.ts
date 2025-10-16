import { useState, useEffect, useCallback, useRef } from 'react';
import { dashboardService } from '@/api/dashboard.service';
import { DashboardStats, DashboardPeriod } from '@/types';

interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

interface CacheEntry {
  data: DashboardStats;
  timestamp: number;
  period: DashboardPeriod;
}

// Cache với stale-while-revalidate strategy
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 phút auto-refresh
const cache = new Map<string, CacheEntry>();

export const useDashboardStats = (period: DashboardPeriod = 'month'): UseDashboardStatsReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  const fetchStats = useCallback(async (forceRefresh = false) => {
    const cacheKey = `dashboard-stats-${period}`;
    const cached = cache.get(cacheKey);
    const now = Date.now();

    // Kiểm tra cache nếu không force refresh
    if (!forceRefresh && cached && (now - cached.timestamp) < CACHE_DURATION) {
      setStats(cached.data);
      setLoading(false);
      setError(null);
      setLastUpdated(new Date(cached.timestamp));
      return;
    }

    try {
      // Nếu có cache cũ, hiển thị ngay và fetch background
      if (cached && !forceRefresh) {
        setStats(cached.data);
        setLastUpdated(new Date(cached.timestamp));
      }

      setLoading(forceRefresh || !cached);
      setError(null);

      const data = await dashboardService.getDashboardStats(period);
      
      // Cập nhật cache
      cache.set(cacheKey, {
        data,
        timestamp: now,
        period
      });

      setStats(data);
      setLoading(false);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      setLoading(false);
      
      // Nếu có cache cũ, vẫn hiển thị
      if (cached) {
        setStats(cached.data);
        setLastUpdated(new Date(cached.timestamp));
      }
    }
  }, [period]);

  const refetch = useCallback(() => {
    return fetchStats(true);
  }, [fetchStats]);

  // Auto-refresh effect
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval
    intervalRef.current = setInterval(() => {
      fetchStats(false);
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStats]);

  // Initial load effect
  useEffect(() => {
    if (isInitialLoad.current) {
      fetchStats(false);
      isInitialLoad.current = false;
    }
  }, [fetchStats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    stats,
    loading,
    error,
    refetch,
    lastUpdated
  };
};


