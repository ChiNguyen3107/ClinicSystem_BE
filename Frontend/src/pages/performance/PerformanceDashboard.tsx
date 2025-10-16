import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  usePerformanceObserver, 
  usePerformanceMonitor, 
  usePerformanceAnalytics,
  usePerformanceOptimization 
} from '@/hooks/usePerformance';
import { useBundleOptimization } from '@/utils/bundleOptimization';
import { useCSSOptimization } from '@/utils/cssOptimization';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';

export const PerformanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);

  // Performance hooks
  const coreWebVitals = usePerformanceObserver();
  const { metrics, updateMetrics } = usePerformanceMonitor();
  const { analytics } = usePerformanceAnalytics();
  const { optimizations } = usePerformanceOptimization();
  const { analyzeBundle, getBundleScore } = useBundleOptimization();
  const { analyzeCSS } = useCSSOptimization();

  // Bundle analysis
  const [bundleAnalysis, setBundleAnalysis] = useState<any>(null);
  const [cssAnalysis, setCSSAnalysis] = useState<any>(null);

  // Load analyses
  useEffect(() => {
    const loadAnalyses = async () => {
      try {
        const bundle = analyzeBundle();
        setBundleAnalysis(bundle);
        
        // Simulate CSS analysis
        const css = {
          totalSize: 150000,
          unusedRules: 5,
          duplicateRules: 2,
          criticalSize: 80000,
          nonCriticalSize: 70000,
          recommendations: [
            'Remove unused CSS rules',
            'Consolidate duplicate styles',
            'Extract critical CSS',
          ],
        };
        setCSSAnalysis(css);
      } catch (error) {
        console.error('Failed to load analyses:', error);
      }
    };

    loadAnalyses();
  }, [analyzeBundle, analyzeCSS]);

  // Calculate overall performance score
  const calculateOverallScore = () => {
    let score = 100;
    
    // Core Web Vitals penalties
    if (coreWebVitals.lcp && coreWebVitals.lcp > 2500) score -= 20;
    if (coreWebVitals.fid && coreWebVitals.fid > 100) score -= 15;
    if (coreWebVitals.cls && coreWebVitals.cls > 0.1) score -= 15;
    
    // Performance metrics penalties
    if (metrics.renderTime > 100) score -= 10;
    if (metrics.memoryUsage > 50 * 1024 * 1024) score -= 10;
    if (metrics.apiResponseTime > 1000) score -= 10;
    
    // Bundle size penalties
    if (bundleAnalysis?.totalSize > 1024 * 1024) score -= 15;
    if (bundleAnalysis?.chunkCount > 10) score -= 10;
    
    // CSS penalties
    if (cssAnalysis?.unusedRules > 0) score -= 5;
    if (cssAnalysis?.duplicateRules > 0) score -= 5;
    
    return Math.max(0, Math.min(100, score));
  };

  const overallScore = calculateOverallScore();
  const bundleScore = bundleAnalysis ? getBundleScore(bundleAnalysis) : 0;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge variant="default" className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 70) return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Good</Badge>;
    if (score >= 50) return <Badge variant="default" className="bg-orange-100 text-orange-800">Needs Improvement</Badge>;
    return <Badge variant="default" className="bg-red-100 text-red-800">Poor</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <p className="text-gray-600">Monitor and optimize your application performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => {
              updateMetrics();
              setRefreshKey(prev => prev + 1);
            }}
            variant="outline"
          >
            Refresh
          </Button>
          <PerformanceMonitor showDetails={true} />
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Performance Score</span>
            {getScoreBadge(overallScore)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-bold">
                <span className={getScoreColor(overallScore)}>{overallScore}</span>
                <span className="text-gray-400">/100</span>
              </div>
              <Progress value={overallScore} className="flex-1" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium">Core Web Vitals</div>
                <div className="text-gray-600">
                  {coreWebVitals.lcp ? `${coreWebVitals.lcp.toFixed(0)}ms` : 'N/A'} LCP
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Render Time</div>
                <div className="text-gray-600">{metrics.renderTime.toFixed(0)}ms</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Memory Usage</div>
                <div className="text-gray-600">
                  {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Bundle Size</div>
                <div className="text-gray-600">
                  {bundleAnalysis ? `${(bundleAnalysis.totalSize / 1024 / 1024).toFixed(1)}MB` : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="core-web-vitals">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="bundle">Bundle Analysis</TabsTrigger>
          <TabsTrigger value="css">CSS Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Render Time</span>
                  <Badge variant={metrics.renderTime > 100 ? 'destructive' : 'default'}>
                    {metrics.renderTime.toFixed(0)}ms
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Memory Usage</span>
                  <Badge variant={metrics.memoryUsage > 50 * 1024 * 1024 ? 'destructive' : 'default'}>
                    {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Response</span>
                  <Badge variant={metrics.apiResponseTime > 1000 ? 'destructive' : 'default'}>
                    {metrics.apiResponseTime.toFixed(0)}ms
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Components</span>
                  <Badge variant="outline">{metrics.componentCount}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Page Views</span>
                  <Badge variant="outline">{analytics.pageViews}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Interactions</span>
                  <Badge variant="outline">{analytics.userInteractions}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Errors</span>
                  <Badge variant={analytics.errors > 0 ? 'destructive' : 'default'}>
                    {analytics.errors}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Slow Renders</span>
                  <Badge variant={analytics.slowRenders > 0 ? 'destructive' : 'default'}>
                    {analytics.slowRenders}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Optimizations */}
            <Card>
              <CardHeader>
                <CardTitle>Optimizations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Images Optimized</span>
                  <Badge variant="outline">{optimizations.imagesOptimized}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Components Memoized</span>
                  <Badge variant="outline">{optimizations.componentsMemoized}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bundles Split</span>
                  <Badge variant="outline">{optimizations.bundlesSplitted}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cache Hits</span>
                  <Badge variant="outline">{optimizations.cacheHits}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Core Web Vitals Tab */}
        <TabsContent value="core-web-vitals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Largest Contentful Paint</span>
                  <Badge variant={coreWebVitals.lcp && coreWebVitals.lcp > 2500 ? 'destructive' : 'default'}>
                    {coreWebVitals.lcp ? `${coreWebVitals.lcp.toFixed(0)}ms` : 'N/A'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Measures loading performance. Good: &lt;2.5s, Needs Improvement: 2.5-4s, Poor: &gt;4s
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>First Input Delay</span>
                  <Badge variant={coreWebVitals.fid && coreWebVitals.fid > 100 ? 'destructive' : 'default'}>
                    {coreWebVitals.fid ? `${coreWebVitals.fid.toFixed(0)}ms` : 'N/A'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Measures interactivity. Good: &lt;100ms, Needs Improvement: 100-300ms, Poor: &gt;300ms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Cumulative Layout Shift</span>
                  <Badge variant={coreWebVitals.cls && coreWebVitals.cls > 0.1 ? 'destructive' : 'default'}>
                    {coreWebVitals.cls ? coreWebVitals.cls.toFixed(3) : 'N/A'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Measures visual stability. Good: &lt;0.1, Needs Improvement: 0.1-0.25, Poor: &gt;0.25
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Bundle Analysis Tab */}
        <TabsContent value="bundle" className="space-y-6">
          {bundleAnalysis && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Bundle Analysis</span>
                    <Badge variant={bundleScore >= 80 ? 'default' : 'destructive'}>
                      Score: {bundleScore}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{(bundleAnalysis.totalSize / 1024 / 1024).toFixed(1)}MB</div>
                      <div className="text-sm text-gray-600">Total Size</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{bundleAnalysis.chunkCount}</div>
                      <div className="text-sm text-gray-600">Chunks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{bundleAnalysis.duplicateModules.length}</div>
                      <div className="text-sm text-gray-600">Duplicates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{bundleAnalysis.unusedModules.length}</div>
                      <div className="text-sm text-gray-600">Unused</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Largest Chunks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bundleAnalysis.largestChunks.map((chunk: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{chunk.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${chunk.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {(chunk.size / 1024).toFixed(1)}KB ({chunk.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {bundleAnalysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600">•</span>
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* CSS Analysis Tab */}
        <TabsContent value="css" className="space-y-6">
          {cssAnalysis && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>CSS Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{(cssAnalysis.totalSize / 1024).toFixed(1)}KB</div>
                      <div className="text-sm text-gray-600">Total Size</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{cssAnalysis.unusedRules}</div>
                      <div className="text-sm text-gray-600">Unused Rules</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{cssAnalysis.duplicateRules}</div>
                      <div className="text-sm text-gray-600">Duplicates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {((cssAnalysis.criticalSize / cssAnalysis.totalSize) * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">Critical CSS</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CSS Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {cssAnalysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600">•</span>
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
