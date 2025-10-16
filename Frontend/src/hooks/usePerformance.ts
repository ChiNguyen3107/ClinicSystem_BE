import { useState, useEffect, useCallback, useRef } from 'react';

// Performance metrics interface
interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  bundleSize: number;
  cacheHitRate: number;
}

// Performance monitoring hook
export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    bundleSize: 0,
    cacheHitRate: 0,
  });

  const observerRef = useRef<PerformanceObserver | null>(null);
  const renderStartRef = useRef<number>(0);

  // Measure render time
  const measureRender = useCallback((componentName: string) => {
    const start = performance.now();
    renderStartRef.current = start;
    
    return () => {
      const end = performance.now();
      const renderTime = end - start;
      
      if (renderTime > 16) { // More than one frame
        console.warn(`Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
      
      setMetrics(prev => ({ ...prev, renderTime }));
    };
  }, []);

  // Monitor memory usage
  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      setMetrics(prev => ({ ...prev, memoryUsage }));
    }
  }, []);

  // Monitor network performance
  const measureNetwork = useCallback(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const networkLatency = navigation.responseEnd - navigation.requestStart;
      setMetrics(prev => ({ ...prev, networkLatency }));
    }
  }, []);

  // Monitor bundle size
  const measureBundleSize = useCallback(() => {
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('js/')) {
        // Estimate bundle size (this is a simplified approach)
        totalSize += 100; // Placeholder
      }
    });
    
    setMetrics(prev => ({ ...prev, bundleSize: totalSize }));
  }, []);

  // Monitor cache performance
  const measureCache = useCallback(() => {
    const cacheEntries = performance.getEntriesByType('resource');
    let cacheHits = 0;
    let totalRequests = cacheEntries.length;
    
    cacheEntries.forEach(entry => {
      if (entry.transferSize === 0) {
        cacheHits++;
      }
    });
    
    const cacheHitRate = totalRequests > 0 ? cacheHits / totalRequests : 0;
    setMetrics(prev => ({ ...prev, cacheHitRate }));
  }, []);

  // Setup performance observer
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      observerRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'measure') {
            console.log(`Performance measure: ${entry.name} - ${entry.duration}ms`);
          }
        });
      });
      
      observerRef.current.observe({ entryTypes: ['measure', 'navigation'] });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      measureMemory();
      measureNetwork();
      measureCache();
    }, 5000);

    return () => clearInterval(interval);
  }, [measureMemory, measureNetwork, measureCache]);

  // Initial measurements
  useEffect(() => {
    measureBundleSize();
  }, [measureBundleSize]);

  return {
    metrics,
    measureRender,
    measureMemory,
    measureNetwork,
    measureBundleSize,
    measureCache,
  };
};

// Debounce hook for performance
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for performance
export const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
};

// Intersection observer hook for lazy loading
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
};

// Resize observer hook for responsive components
export const useResizeObserver = (elementRef: React.RefObject<Element>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef]);

  return dimensions;
};

// Performance optimization hook for expensive calculations
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  const memoizedCallback = useCallback(callback, deps);
  return memoizedCallback;
};

// Performance optimization hook for expensive values
export const useMemoizedValue = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(factory, deps);
};