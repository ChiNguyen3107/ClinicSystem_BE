import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  usePerformanceMonitoring, 
  useRealTimeMonitoring, 
  usePerformanceBudget,
  getPerformanceRecommendations 
} from '@/utils/monitoring';
import { 
  usePerformanceTesting, 
  PerformanceTestRunner, 
  PerformanceTestResults,
  createPerformanceTestSuite 
} from '@/utils/testing';
import { 
  getCacheMemoryUsage, 
  cleanupExpiredCache 
} from '@/utils/cache';
import { 
  analyzeBundle, 
  getOptimizationRecommendations 
} from '@/utils/bundleOptimization';
import { 
  analyzeCSSBundle, 
  getCSSOptimizationRecommendations 
} from '@/utils/cssOptimization';

const PerformanceDashboard: React.FC = () => {
  const { metrics } = usePerformanceMonitoring();
  const { isMonitoring, startMonitoring, stopMonitoring } = useRealTimeMonitoring();
  const { violations } = usePerformanceBudget({
    maxRenderTime: 16,
    maxMemoryUsage: 0.8,
    maxNetworkLatency: 1000,
    maxBundleSize: 10,
  });

  const { isRunning, results, runTests, addTest } = usePerformanceTesting();

  // Performance test suite
  React.useEffect(() => {
    createPerformanceTestSuite();
    // Add custom tests
    addTest({
      name: 'Component Render Performance',
      test: async () => {
        const start = performance.now();
        // Simulate component render
        await new Promise(resolve => setTimeout(resolve, 10));
        const end = performance.now();
        return end - start < 16;
      },
      threshold: 16,
      timeout: 1000,
    });
  }, [addTest]);

  const handleRunTests = async () => {
    await runTests();
  };

  const handleCleanupCache = () => {
    cleanupExpiredCache();
    window.location.reload();
  };

  const recommendations = getPerformanceRecommendations(metrics);
  const bundleAnalysis = analyzeBundle();
  const cssAnalysis = analyzeCSSBundle();
  const cacheStats = getCacheMemoryUsage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <p className="text-gray-600">Theo dõi và tối ưu hiệu suất hệ thống</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            variant={isMonitoring ? 'destructive' : 'default'}
          >
            {isMonitoring ? 'Dừng Monitoring' : 'Bắt đầu Monitoring'}
          </Button>
          <Button onClick={handleRunTests} disabled={isRunning}>
            {isRunning ? 'Đang chạy...' : 'Chạy Performance Tests'}
          </Button>
          <Button onClick={handleCleanupCache} variant="outline">
            Dọn dẹp Cache
          </Button>
        </div>
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="tests">Performance Tests</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Render Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.renderTime.toFixed(2)}ms</div>
                <Progress value={(metrics.renderTime / 16) * 100} className="mt-2" />
                <p className="text-xs text-gray-600 mt-1">
                  {metrics.renderTime > 16 ? 'Chậm' : 'Tốt'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(metrics.memoryUsage * 100).toFixed(1)}%</div>
                <Progress value={metrics.memoryUsage * 100} className="mt-2" />
                <p className="text-xs text-gray-600 mt-1">
                  {metrics.memoryUsage > 0.8 ? 'Cao' : 'Bình thường'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Network Latency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.networkLatency.toFixed(0)}ms</div>
                <Progress value={(metrics.networkLatency / 1000) * 100} className="mt-2" />
                <p className="text-xs text-gray-600 mt-1">
                  {metrics.networkLatency > 1000 ? 'Chậm' : 'Tốt'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(metrics.cacheHitRate * 100).toFixed(1)}%</div>
                <Progress value={metrics.cacheHitRate * 100} className="mt-2" />
                <p className="text-xs text-gray-600 mt-1">
                  {metrics.cacheHitRate > 0.5 ? 'Tốt' : 'Cần cải thiện'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Budget</CardTitle>
                <CardDescription>Kiểm tra ngân sách hiệu suất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {violations.map((violation, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Badge variant="destructive">Vi phạm</Badge>
                      <span className="text-sm">{violation}</span>
                    </div>
                  ))}
                  {violations.length === 0 && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Trong ngân sách</Badge>
                      <span className="text-sm">Tất cả metrics đều trong ngân sách</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Gợi ý tối ưu hóa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {recommendation}
                    </div>
                  ))}
                  {recommendations.length === 0 && (
                    <div className="text-sm text-gray-600">
                      Không có gợi ý tối ưu hóa nào
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Tests</CardTitle>
              <CardDescription>Chạy các bài test hiệu suất</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceTestRunner
                tests={[]}
                onComplete={(results) => {
                  console.log('Test results:', results);
                }}
              />
              {results.length > 0 && (
                <div className="mt-4">
                  <PerformanceTestResults results={results} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Bundle Analysis</CardTitle>
                <CardDescription>Phân tích bundle size</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Scripts:</span>
                    <span>{bundleAnalysis.totalScripts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stylesheets:</span>
                    <span>{bundleAnalysis.totalStylesheets}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CSS Analysis</CardTitle>
                <CardDescription>Phân tích CSS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>External CSS:</span>
                    <span>{cssAnalysis.totalExternal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inline CSS:</span>
                    <span>{cssAnalysis.totalInline}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Statistics</CardTitle>
                <CardDescription>Thống kê cache</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cacheStats.map((cache, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{cache.name}:</span>
                      <span>{cache.stats.totalItems} items</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
                <CardDescription>Gợi ý tối ưu hóa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getOptimizationRecommendations().map((rec, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {rec}
                    </div>
                  ))}
                  {getCSSOptimizationRecommendations().map((rec, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {rec}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Monitoring</CardTitle>
              <CardDescription>
                {isMonitoring ? 'Đang theo dõi hiệu suất' : 'Chưa bắt đầu theo dõi'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm">
                    {isMonitoring ? 'Monitoring đang hoạt động' : 'Monitoring đã dừng'}
                  </span>
                </div>
                
                {isMonitoring && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{metrics.renderTime.toFixed(2)}ms</div>
                      <div className="text-sm text-gray-600">Render Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{(metrics.memoryUsage * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Memory</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{metrics.networkLatency.toFixed(0)}ms</div>
                      <div className="text-sm text-gray-600">Network</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{(metrics.cacheHitRate * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Cache Hit</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;
