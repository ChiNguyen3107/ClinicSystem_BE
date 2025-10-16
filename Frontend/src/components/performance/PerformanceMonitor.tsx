import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  usePerformanceObserver, 
  usePerformanceMonitor, 
  usePerformanceAnalytics,
  usePerformanceOptimization 
} from '@/hooks/usePerformance';

interface PerformanceMonitorProps {
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  showDetails = false,
  autoRefresh = true,
  refreshInterval = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Performance hooks
  const coreWebVitals = usePerformanceObserver();
  const { metrics, startRender, endRender, measureAPI, updateMetrics } = usePerformanceMonitor();
  const { analytics, trackPageView, trackUserInteraction, trackError, trackSlowRender, trackAPIError } = usePerformanceAnalytics();
  const { optimizations, optimizeImage, memoizeComponent, splitBundle, recordCacheHit } = usePerformanceOptimization();

  // Performance score calculation
  const calculatePerformanceScore = useCallback(() => {
    let score = 100;
    
    // LCP penalty
    if (coreWebVitals.lcp && coreWebVitals.lcp > 2500) {
      score -= 20;
    }
    
    // FID penalty
    if (coreWebVitals.fid && coreWebVitals.fid > 100) {
      score -= 15;
    }
    
    // CLS penalty
    if (coreWebVitals.cls && coreWebVitals.cls > 0.1) {
      score -= 15;
    }
    
    // Render time penalty
    if (metrics.renderTime > 100) {
      score -= 10;
    }
    
    // Memory usage penalty
    if (metrics.memoryUsage > 50 * 1024 * 1024) { // 50MB
      score -= 10;
    }
    
    return Math.max(0, score);
  }, [coreWebVitals, metrics]);

  const performanceScore = calculatePerformanceScore();

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      updateMetrics();
      setRefreshKey(prev => prev + 1);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, updateMetrics]);

  // Track page view
  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  // Performance status
  const getPerformanceStatus = (score: number) => {
    if (score >= 90) return { status: 'excellent', color: 'green' };
    if (score >= 70) return { status: 'good', color: 'yellow' };
    if (score >= 50) return { status: 'needs-improvement', color: 'orange' };
    return { status: 'poor', color: 'red' };
  };

  const performanceStatus = getPerformanceStatus(performanceScore);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary/90"
        >
          📊
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-y-auto">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Performance Monitor</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={performanceStatus.color as any}
                className="text-xs"
              >
                {performanceStatus.status}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Score:</span>
            <Progress value={performanceScore} className="flex-1" />
            <span className="text-sm font-medium">{performanceScore}/100</span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Core Web Vitals */}
          <div>
            <h4 className="font-medium text-sm mb-2">Core Web Vitals</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>LCP:</span>
                <span className={coreWebVitals.lcp && coreWebVitals.lcp > 2500 ? 'text-red-600' : 'text-green-600'}>
                  {coreWebVitals.lcp ? `${coreWebVitals.lcp.toFixed(0)}ms` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>FID:</span>
                <span className={coreWebVitals.fid && coreWebVitals.fid > 100 ? 'text-red-600' : 'text-green-600'}>
                  {coreWebVitals.fid ? `${coreWebVitals.fid.toFixed(0)}ms` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>CLS:</span>
                <span className={coreWebVitals.cls && coreWebVitals.cls > 0.1 ? 'text-red-600' : 'text-green-600'}>
                  {coreWebVitals.cls ? coreWebVitals.cls.toFixed(3) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h4 className="font-medium text-sm mb-2">Performance Metrics</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Render Time:</span>
                <span className={metrics.renderTime > 100 ? 'text-red-600' : 'text-green-600'}>
                  {metrics.renderTime.toFixed(0)}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span>Memory:</span>
                <span className={metrics.memoryUsage > 50 * 1024 * 1024 ? 'text-red-600' : 'text-green-600'}>
                  {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
                </span>
              </div>
              <div className="flex justify-between">
                <span>Components:</span>
                <span>{metrics.componentCount}</span>
              </div>
              <div className="flex justify-between">
                <span>API Response:</span>
                <span className={metrics.apiResponseTime > 1000 ? 'text-red-600' : 'text-green-600'}>
                  {metrics.apiResponseTime.toFixed(0)}ms
                </span>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div>
            <h4 className="font-medium text-sm mb-2">Analytics</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Page Views:</span>
                <span>{analytics.pageViews}</span>
              </div>
              <div className="flex justify-between">
                <span>Interactions:</span>
                <span>{analytics.userInteractions}</span>
              </div>
              <div className="flex justify-between">
                <span>Errors:</span>
                <span className={analytics.errors > 0 ? 'text-red-600' : 'text-green-600'}>
                  {analytics.errors}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Slow Renders:</span>
                <span className={analytics.slowRenders > 0 ? 'text-red-600' : 'text-green-600'}>
                  {analytics.slowRenders}
                </span>
              </div>
            </div>
          </div>

          {/* Optimizations */}
          {showDetails && (
            <div>
              <h4 className="font-medium text-sm mb-2">Optimizations</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Images Optimized:</span>
                  <span>{optimizations.imagesOptimized}</span>
                </div>
                <div className="flex justify-between">
                  <span>Components Memoized:</span>
                  <span>{optimizations.componentsMemoized}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bundles Split:</span>
                  <span>{optimizations.bundlesSplitted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cache Hits:</span>
                  <span>{optimizations.cacheHits}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                updateMetrics();
                setRefreshKey(prev => prev + 1);
              }}
              className="flex-1"
            >
              Refresh
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Clear all metrics
                window.location.reload();
              }}
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Performance Dashboard Component
export const PerformanceDashboard: React.FC = () => {
  const { metrics } = usePerformanceMonitor();
  const { analytics } = usePerformanceAnalytics();
  const { optimizations } = usePerformanceOptimization();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">85</div>
            <div className="text-sm text-gray-600">Good Performance</div>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">LCP</span>
              <Badge variant="green">Good</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">FID</span>
              <Badge variant="green">Good</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">CLS</span>
              <Badge variant="green">Good</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Page Views</span>
              <span className="font-medium">{analytics.pageViews}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Interactions</span>
              <span className="font-medium">{analytics.userInteractions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Errors</span>
              <span className="font-medium text-red-600">{analytics.errors}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimizations */}
      <Card>
        <CardHeader>
          <CardTitle>Optimizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Images Optimized</span>
              <span className="font-medium">{optimizations.imagesOptimized}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Components Memoized</span>
              <span className="font-medium">{optimizations.componentsMemoized}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Cache Hits</span>
              <span className="font-medium">{optimizations.cacheHits}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Memory Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">
              {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
            </div>
            <div className="text-sm text-gray-600">Used Memory</div>
          </div>
        </CardContent>
      </Card>

      {/* Bundle Size */}
      <Card>
        <CardHeader>
          <CardTitle>Bundle Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">
              {(metrics.bundleSize / 1024 / 1024).toFixed(1)}MB
            </div>
            <div className="text-sm text-gray-600">Total Bundle</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
