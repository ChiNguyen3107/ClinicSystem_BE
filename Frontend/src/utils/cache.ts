// Cache utilities for performance optimization
interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

class Cache<T = any> {
  private cache = new Map<string, CacheItem<T>>();
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 100,
      storage: options.storage || 'memory',
    };
  }

  set(key: string, value: T, ttl?: number): void {
    const item: CacheItem<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.options.ttl,
    };

    // Remove oldest items if cache is full
    if (this.cache.size >= this.options.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, item);

    // Store in browser storage if configured
    if (this.options.storage !== 'memory') {
      try {
        const storage = this.options.storage === 'localStorage' 
          ? localStorage 
          : sessionStorage;
        storage.setItem(`cache_${key}`, JSON.stringify(item));
      } catch (error) {
        console.warn('Failed to store in browser storage:', error);
      }
    }
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      // Try to get from browser storage
      if (this.options.storage !== 'memory') {
        try {
          const storage = this.options.storage === 'localStorage' 
            ? localStorage 
            : sessionStorage;
          const stored = storage.getItem(`cache_${key}`);
          if (stored) {
            const parsedItem = JSON.parse(stored);
            if (this.isValid(parsedItem)) {
              this.cache.set(key, parsedItem);
              return parsedItem.value;
            } else {
              storage.removeItem(`cache_${key}`);
            }
          }
        } catch (error) {
          console.warn('Failed to retrieve from browser storage:', error);
        }
      }
      return null;
    }

    if (this.isValid(item)) {
      return item.value;
    } else {
      this.cache.delete(key);
      return null;
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    
    if (this.options.storage !== 'memory') {
      try {
        const storage = this.options.storage === 'localStorage' 
          ? localStorage 
          : sessionStorage;
        storage.removeItem(`cache_${key}`);
      } catch (error) {
        console.warn('Failed to delete from browser storage:', error);
      }
    }
    
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    
    if (this.options.storage !== 'memory') {
      try {
        const storage = this.options.storage === 'localStorage' 
          ? localStorage 
          : sessionStorage;
        const keys = Object.keys(storage);
        keys.forEach(key => {
          if (key.startsWith('cache_')) {
            storage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('Failed to clear browser storage:', error);
      }
    }
  }

  private isValid(item: CacheItem<T>): boolean {
    return Date.now() - item.timestamp < item.ttl;
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let validItems = 0;
    let expiredItems = 0;

    this.cache.forEach(item => {
      if (this.isValid(item)) {
        validItems++;
      } else {
        expiredItems++;
      }
    });

    return {
      totalItems: this.cache.size,
      validItems,
      expiredItems,
      hitRate: 0, // This would need to be tracked separately
    };
  }
}

// Create cache instances for different purposes
export const apiCache = new Cache<any>({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 50,
  storage: 'memory',
});

export const componentCache = new Cache<React.ComponentType<any>>({
  ttl: 30 * 60 * 1000, // 30 minutes
  maxSize: 20,
  storage: 'memory',
});

export const imageCache = new Cache<string>({
  ttl: 60 * 60 * 1000, // 1 hour
  maxSize: 100,
  storage: 'localStorage',
});

export const userCache = new Cache<any>({
  ttl: 15 * 60 * 1000, // 15 minutes
  maxSize: 10,
  storage: 'sessionStorage',
});

// Cache decorator for functions
export function withCache<T extends (...args: any[]) => any>(
  fn: T,
  cache: Cache<ReturnType<T>>,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Cache middleware for API calls
export const withApiCache = <T>(
  apiCall: () => Promise<T>,
  cacheKey: string,
  ttl?: number
): (() => Promise<T>) => {
  return async () => {
    const cached = apiCache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }

    try {
      const result = await apiCall();
      apiCache.set(cacheKey, result, ttl);
      return result;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };
};

// Image preloading with cache
export const preloadImage = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cached = imageCache.get(src);
    if (cached) {
      resolve(cached);
      return;
    }

    const img = new Image();
    img.onload = () => {
      imageCache.set(src, src);
      resolve(src);
    };
    img.onerror = reject;
    img.src = src;
  });
};

// Batch preload images
export const preloadImages = async (srcs: string[]): Promise<string[]> => {
  const promises = srcs.map(src => preloadImage(src));
  return Promise.all(promises);
};

// Cache cleanup utility
export const cleanupExpiredCache = () => {
  [apiCache, componentCache, imageCache, userCache].forEach(cache => {
    const stats = cache.getStats();
    if (stats.expiredItems > 0) {
      // Force cleanup by accessing all items
      cache.clear();
    }
  });
};

// Memory usage monitoring
export const getCacheMemoryUsage = () => {
  const caches = [apiCache, componentCache, imageCache, userCache];
  return caches.map(cache => ({
    name: cache.constructor.name,
    stats: cache.getStats(),
  }));
};
