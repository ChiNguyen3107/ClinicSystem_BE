// Performance monitoring utilities
import React from 'react';
import { apiCache } from './cache';

// Monitoring interfaces
interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  bundleSize: number;
  cacheHitRate: number;
  errorRate: number;
  userEngagement: number;
}

interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
  userId?: string;
}

interface UserAnalytics {
  pageViews: number;
  sessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  userEngagement: number;
}

// Performance monitoring service
export class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    bundleSize: 0,
    cacheHitRate: 0,
    errorRate: 0,
    userEngagement: 0,
  };
  private errors: ErrorReport[] = [];
  private analytics: UserAnalytics = {
    pageViews: 0,
    sessionDuration: 0,
    bounceRate: 0,
    conversionRate: 0,
    userEngagement: 0,
  };

  static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    return PerformanceMonitoringService.instance;
  }

  // Track performance metrics
  trackPerformance(metric: keyof PerformanceMetrics, value: number) {
    this.metrics[metric] = value;
    this.sendMetrics();
  }

  // Track errors
  trackError(error: Error, _context?: any) {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId(),
    };

    this.errors.push(errorReport);
    this.sendError(errorReport);
  }

  // Track user analytics
  trackPageView(page: string) {
    this.analytics.pageViews++;
    this.sendAnalytics('page_view', { page });
  }

  trackUserEngagement(action: string, data?: any) {
    this.analytics.userEngagement++;
    this.sendAnalytics('user_engagement', { action, data });
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Get error reports
  getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  // Get analytics
  getAnalytics(): UserAnalytics {
    return { ...this.analytics };
  }

  // Send metrics to monitoring service
  private sendMetrics() {
    // In a real application, you would send this to your monitoring service
    console.log('Performance metrics:', this.metrics);
  }

  // Send error to monitoring service
  private sendError(error: ErrorReport) {
    // In a real application, you would send this to your error tracking service
    console.error('Error tracked:', error);
  }

  // Send analytics to monitoring service
  private sendAnalytics(event: string, data: any) {
    // In a real application, you would send this to your analytics service
    console.log('Analytics event:', event, data);
  }

  // Get current user ID
  private getCurrentUserId(): string | undefined {
    // This would come from your auth system
    return localStorage.getItem('userId') || undefined;
  }
}

// Error tracking hook
export const useErrorTracking = () => {
  const monitoring = PerformanceMonitoringService.getInstance();

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      monitoring.trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      monitoring.trackError(new Error(event.reason), {
        type: 'unhandledRejection',
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [monitoring]);

  return monitoring;
};

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  const monitoring = PerformanceMonitoringService.getInstance();
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(monitoring.getMetrics());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(monitoring.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, [monitoring]);

  return { metrics, monitoring };
};

// User analytics hook
export const useUserAnalytics = () => {
  const monitoring = PerformanceMonitoringService.getInstance();

  const trackPageView = React.useCallback((page: string) => {
    monitoring.trackPageView(page);
  }, [monitoring]);

  const trackUserEngagement = React.useCallback((action: string, data?: any) => {
    monitoring.trackUserEngagement(action, data);
  }, [monitoring]);

  return { trackPageView, trackUserEngagement };
};

// System monitoring
export const monitorSystemPerformance = () => {
  const monitoring = PerformanceMonitoringService.getInstance();

  // Monitor memory usage
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    monitoring.trackPerformance('memoryUsage', memoryUsage);
  }

  // Monitor network performance
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    const networkLatency = navigation.responseEnd - navigation.requestStart;
    monitoring.trackPerformance('networkLatency', networkLatency);
  }

  // Monitor bundle size
  const scripts = document.querySelectorAll('script[src]');
  const bundleSize = scripts.length;
  monitoring.trackPerformance('bundleSize', bundleSize);

  // Monitor cache performance
  const cacheStats = apiCache.getStats();
  monitoring.trackPerformance('cacheHitRate', cacheStats.hitRate);
};

// Real-time monitoring dashboard
export const useRealTimeMonitoring = () => {
  const [isMonitoring, setIsMonitoring] = React.useState(false);
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null);

  React.useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      monitorSystemPerformance();
      const monitoring = PerformanceMonitoringService.getInstance();
      setMetrics(monitoring.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const startMonitoring = () => setIsMonitoring(true);
  const stopMonitoring = () => setIsMonitoring(false);

  return { isMonitoring, metrics, startMonitoring, stopMonitoring };
};

// Performance budget monitoring
export const usePerformanceBudget = (budget: {
  maxRenderTime: number;
  maxMemoryUsage: number;
  maxNetworkLatency: number;
  maxBundleSize: number;
}) => {
  const [violations, setViolations] = React.useState<string[]>([]);
  const monitoring = PerformanceMonitoringService.getInstance();

  React.useEffect(() => {
    const checkBudget = () => {
      const metrics = monitoring.getMetrics();
      const newViolations: string[] = [];

      if (metrics.renderTime > budget.maxRenderTime) {
        newViolations.push(`Render time exceeded: ${metrics.renderTime}ms > ${budget.maxRenderTime}ms`);
      }

      if (metrics.memoryUsage > budget.maxMemoryUsage) {
        newViolations.push(`Memory usage exceeded: ${metrics.memoryUsage} > ${budget.maxMemoryUsage}`);
      }

      if (metrics.networkLatency > budget.maxNetworkLatency) {
        newViolations.push(`Network latency exceeded: ${metrics.networkLatency}ms > ${budget.maxNetworkLatency}ms`);
      }

      if (metrics.bundleSize > budget.maxBundleSize) {
        newViolations.push(`Bundle size exceeded: ${metrics.bundleSize} > ${budget.maxBundleSize}`);
      }

      setViolations(newViolations);
    };

    const interval = setInterval(checkBudget, 5000);
    return () => clearInterval(interval);
  }, [budget, monitoring]);

  return { violations, withinBudget: violations.length === 0 };
};

// Performance recommendations
export const getPerformanceRecommendations = (metrics: PerformanceMetrics) => {
  const recommendations: string[] = [];

  if (metrics.renderTime > 16) {
    recommendations.push('Consider optimizing component rendering');
  }

  if (metrics.memoryUsage > 0.8) {
    recommendations.push('Consider implementing memory optimization strategies');
  }

  if (metrics.networkLatency > 1000) {
    recommendations.push('Consider implementing network optimization strategies');
  }

  if (metrics.bundleSize > 10) {
    recommendations.push('Consider implementing bundle optimization strategies');
  }

  if (metrics.cacheHitRate < 0.5) {
    recommendations.push('Consider implementing better caching strategies');
  }

  return recommendations;
};
