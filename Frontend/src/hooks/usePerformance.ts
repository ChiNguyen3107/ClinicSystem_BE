import { useCallback, useEffect, useRef, useState } from 'react';

// Performance metrics interface
interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  
  // Custom metrics
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  apiResponseTime: number;
  bundleSize: number;
  
  // User experience metrics
  pageLoadTime: number;
  timeToInteractive: number;
  domContentLoaded: number;
}

// Performance observer hook
export const usePerformanceObserver = () => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Observe Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            setMetrics(prev => ({
              ...prev,
              lcp: entry.startTime,
            }));
            break;
            
          case 'first-input':
            setMetrics(prev => ({
              ...prev,
              fid: (entry as any).processingStart - entry.startTime,
            }));
            break;
            
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({
                ...prev,
                cls: (prev.cls || 0) + (entry as any).value,
              }));
            }
            break;
            
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({
                ...prev,
                fcp: entry.startTime,
              }));
            }
            break;
        }
      });
    });

    // Observe different entry types
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint'] });
      observerRef.current = observer;
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return metrics;
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    apiResponseTime: 0,
    bundleSize: 0,
    pageLoadTime: 0,
    timeToInteractive: 0,
    domContentLoaded: 0,
  });

  const startTime = useRef<number>(0);
  const renderStartTime = useRef<number>(0);

  // Measure render time
  const startRender = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current;
    setMetrics(prev => ({
      ...prev,
      renderTime,
    }));
  }, []);

  // Measure API response time
  const measureAPI = useCallback(async <T>(
    apiCall: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await apiCall();
      const responseTime = performance.now() - start;
      setMetrics(prev => ({
        ...prev,
        apiResponseTime: responseTime,
      }));
      return result;
    } catch (error) {
      const responseTime = performance.now() - start;
      setMetrics(prev => ({
        ...prev,
        apiResponseTime: responseTime,
      }));
      throw error;
    }
  }, []);

  // Get memory usage
  const updateMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize,
      }));
    }
  }, []);

  // Get component count
  const updateComponentCount = useCallback(() => {
    const componentCount = document.querySelectorAll('[data-component]').length;
    setMetrics(prev => ({
      ...prev,
      componentCount,
    }));
  }, []);

  // Get bundle size (approximate)
  const updateBundleSize = useCallback(() => {
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && !src.includes('node_modules')) {
        // This is a simplified approach - in reality you'd need to fetch the actual size
        totalSize += 1000; // Placeholder
      }
    });
    
    setMetrics(prev => ({
      ...prev,
      bundleSize: totalSize,
    }));
  }, []);

  // Update all metrics
  const updateMetrics = useCallback(() => {
    updateMemoryUsage();
    updateComponentCount();
    updateBundleSize();
  }, [updateMemoryUsage, updateComponentCount, updateBundleSize]);

  // Initialize performance monitoring
  useEffect(() => {
    startTime.current = performance.now();
    
    // Update metrics periodically
    const interval = setInterval(updateMetrics, 5000);
    
    // Update metrics on page load
    const handleLoad = () => {
      const loadTime = performance.now() - startTime.current;
      setMetrics(prev => ({
        ...prev,
        pageLoadTime: loadTime,
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      }));
    };

    window.addEventListener('load', handleLoad);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleLoad);
    };
  }, [updateMetrics]);

  return {
    metrics,
    startRender,
    endRender,
    measureAPI,
    updateMetrics,
  };
};

// Performance analytics hook
export const usePerformanceAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    userInteractions: 0,
    errors: 0,
    slowRenders: 0,
    apiErrors: 0,
  });

  const trackPageView = useCallback(() => {
    setAnalytics(prev => ({
      ...prev,
      pageViews: prev.pageViews + 1,
    }));
  }, []);

  const trackUserInteraction = useCallback(() => {
    setAnalytics(prev => ({
      ...prev,
      userInteractions: prev.userInteractions + 1,
    }));
  }, []);

  const trackError = useCallback((error: Error) => {
    console.error('Performance Analytics Error:', error);
    setAnalytics(prev => ({
      ...prev,
      errors: prev.errors + 1,
    }));
  }, []);

  const trackSlowRender = useCallback((renderTime: number) => {
    if (renderTime > 100) { // Consider slow if > 100ms
      setAnalytics(prev => ({
        ...prev,
        slowRenders: prev.slowRenders + 1,
      }));
    }
  }, []);

  const trackAPIError = useCallback(() => {
    setAnalytics(prev => ({
      ...prev,
      apiErrors: prev.apiErrors + 1,
    }));
  }, []);

  return {
    analytics,
    trackPageView,
    trackUserInteraction,
    trackError,
    trackSlowRender,
    trackAPIError,
  };
};

// Performance optimization hook
export const usePerformanceOptimization = () => {
  const [optimizations, setOptimizations] = useState({
    imagesOptimized: 0,
    componentsMemoized: 0,
    bundlesSplitted: 0,
    cacheHits: 0,
  });

  const optimizeImage = useCallback((src: string) => {
    // Implement image optimization logic
    setOptimizations(prev => ({
      ...prev,
      imagesOptimized: prev.imagesOptimized + 1,
    }));
  }, []);

  const memoizeComponent = useCallback((componentName: string) => {
    setOptimizations(prev => ({
      ...prev,
      componentsMemoized: prev.componentsMemoized + 1,
    }));
  }, []);

  const splitBundle = useCallback((bundleName: string) => {
    setOptimizations(prev => ({
      ...prev,
      bundlesSplitted: prev.bundlesSplitted + 1,
    }));
  }, []);

  const recordCacheHit = useCallback(() => {
    setOptimizations(prev => ({
      ...prev,
      cacheHits: prev.cacheHits + 1,
    }));
  }, []);

  return {
    optimizations,
    optimizeImage,
    memoizeComponent,
    splitBundle,
    recordCacheHit,
  };
};

// Performance reporting hook
export const usePerformanceReporting = () => {
  const reportMetrics = useCallback(async (metrics: PerformanceMetrics) => {
    try {
      // Send metrics to analytics service
      const reportData = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        metrics,
      };

      // In a real application, you would send this to your analytics service
      console.log('Performance Report:', reportData);
      
      // Example: Send to analytics API
      // await fetch('/api/analytics/performance', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(reportData),
      // });
    } catch (error) {
      console.error('Failed to report performance metrics:', error);
    }
  }, []);

  const reportError = useCallback(async (error: Error, context?: any) => {
    try {
      const errorReport = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        context,
      };

      console.error('Error Report:', errorReport);
      
      // Example: Send to error tracking service
      // await fetch('/api/analytics/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport),
      // });
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }, []);

  return {
    reportMetrics,
    reportError,
  };
};
