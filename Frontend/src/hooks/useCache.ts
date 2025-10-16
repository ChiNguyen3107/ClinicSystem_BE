import { useCallback, useMemo, useRef } from 'react';

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
  staleWhileRevalidate?: boolean; // Return stale data while revalidating
}

// Cache class
class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize = 100, defaultTTL = 5 * 60 * 1000) { // 5 minutes default
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Get cache statistics
  getStats() {
    const entries = Array.from(this.cache.entries());
    const now = Date.now();
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // This would need to be tracked separately
      entries: entries.map(([key, entry]) => ({
        key,
        age: now - entry.timestamp,
        ttl: entry.ttl,
        isExpired: now - entry.timestamp > entry.ttl,
      })),
    };
  }
}

// Global cache instance
const globalCache = new APICache();

// Cache hook
export const useCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes
    maxSize = 100,
    staleWhileRevalidate = false,
  } = options;

  const cache = useRef(globalCache);
  const isFetching = useRef(false);
  const revalidatePromise = useRef<Promise<T> | null>(null);

  const getCachedData = useCallback((): T | null => {
    return cache.current.get<T>(key);
  }, [key]);

  const setCachedData = useCallback((data: T) => {
    cache.current.set(key, data, ttl);
  }, [key, ttl]);

  const fetchData = useCallback(async (): Promise<T> => {
    if (isFetching.current && revalidatePromise.current) {
      return revalidatePromise.current;
    }

    isFetching.current = true;
    revalidatePromise.current = fetcher().then((data) => {
      setCachedData(data);
      isFetching.current = false;
      revalidatePromise.current = null;
      return data;
    });

    return revalidatePromise.current;
  }, [fetcher, setCachedData]);

  const getData = useCallback(async (): Promise<T> => {
    const cached = getCachedData();
    
    if (cached) {
      if (staleWhileRevalidate) {
        // Return cached data immediately and revalidate in background
        fetchData();
        return cached;
      }
      return cached;
    }

    return fetchData();
  }, [getCachedData, fetchData, staleWhileRevalidate]);

  const invalidate = useCallback(() => {
    cache.current.delete(key);
  }, [key]);

  const revalidate = useCallback(() => {
    invalidate();
    return fetchData();
  }, [invalidate, fetchData]);

  return {
    getData,
    invalidate,
    revalidate,
    hasCachedData: cache.current.has(key),
    getCachedData,
  };
};

// Cache manager hook
export const useCacheManager = () => {
  const clearCache = useCallback(() => {
    globalCache.clear();
  }, []);

  const getCacheStats = useCallback(() => {
    return globalCache.getStats();
  }, []);

  const invalidatePattern = useCallback((pattern: string) => {
    const stats = globalCache.getStats();
    stats.entries.forEach(({ key }) => {
      if (key.includes(pattern)) {
        globalCache.delete(key);
      }
    });
  }, []);

  return {
    clearCache,
    getCacheStats,
    invalidatePattern,
  };
};

// Optimized API hook with caching
export const useCachedAPI = <T>(
  key: string,
  apiCall: () => Promise<T>,
  options: CacheOptions = {}
) => {
  const { getData, invalidate, revalidate, hasCachedData } = useCache(
    key,
    apiCall,
    options
  );

  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(!hasCachedData);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getData();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [getData]);

  return {
    data,
    loading,
    error,
    invalidate,
    revalidate,
    hasCachedData,
  };
};

// Cache persistence
export const useCachePersistence = () => {
  const saveCache = useCallback(() => {
    const stats = globalCache.getStats();
    localStorage.setItem('api-cache', JSON.stringify(stats));
  }, []);

  const loadCache = useCallback(() => {
    try {
      const saved = localStorage.getItem('api-cache');
      if (saved) {
        const cacheData = JSON.parse(saved);
        // Restore cache entries (simplified version)
        // In a real implementation, you'd need to store the actual data
        console.log('Cache restored from localStorage');
      }
    } catch (error) {
      console.error('Failed to restore cache:', error);
    }
  }, []);

  React.useEffect(() => {
    loadCache();
    
    // Save cache periodically
    const interval = setInterval(saveCache, 60000); // Every minute
    
    return () => {
      clearInterval(interval);
      saveCache();
    };
  }, [loadCache, saveCache]);

  return { saveCache, loadCache };
};
