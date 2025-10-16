import React, { useCallback } from 'react';

// Performance testing utilities
export interface PerformanceTestConfig {
  iterations: number;
  warmupIterations: number;
  timeout: number;
  threshold: number;
}

export interface PerformanceTestResult {
  name: string;
  duration: number;
  iterations: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  passed: boolean;
  threshold: number;
  details: {
    renderTime: number;
    memoryUsage: number;
    componentCount: number;
  };
}

export interface BundleAnalysisResult {
  totalSize: number;
  chunkCount: number;
  largestChunks: Array<{
    name: string;
    size: number;
    percentage: number;
  }>;
  duplicateModules: Array<{
    name: string;
    count: number;
    totalSize: number;
  }>;
  unusedModules: string[];
  recommendations: string[];
}

// Performance test runner
export class PerformanceTestRunner {
  private results: PerformanceTestResult[] = [];
  private config: PerformanceTestConfig;

  constructor(config: Partial<PerformanceTestConfig> = {}) {
    this.config = {
      iterations: 10,
      warmupIterations: 3,
      timeout: 5000,
      threshold: 100, // 100ms threshold
      ...config,
    };
  }

  // Run performance test for a component
  async testComponent(
    name: string,
    componentFactory: () => React.ReactElement,
    threshold?: number
  ): Promise<PerformanceTestResult> {
    const testThreshold = threshold || this.config.threshold;
    const durations: number[] = [];
    const details = {
      renderTime: 0,
      memoryUsage: 0,
      componentCount: 0,
    };

    // Warmup iterations
    for (let i = 0; i < this.config.warmupIterations; i++) {
      await this.renderComponent(componentFactory);
    }

    // Performance iterations
    for (let i = 0; i < this.config.iterations; i++) {
      const startTime = performance.now();
      await this.renderComponent(componentFactory);
      const endTime = performance.now();
      
      durations.push(endTime - startTime);
    }

    // Calculate metrics
    const averageTime = durations.reduce((sum, time) => sum + time, 0) / durations.length;
    const minTime = Math.min(...durations);
    const maxTime = Math.max(...durations);
    const passed = averageTime <= testThreshold;

    // Update details
    details.renderTime = averageTime;
    details.memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    details.componentCount = document.querySelectorAll('[data-component]').length;

    const result: PerformanceTestResult = {
      name,
      duration: averageTime,
      iterations: this.config.iterations,
      averageTime,
      minTime,
      maxTime,
      passed,
      threshold: testThreshold,
      details,
    };

    this.results.push(result);
    return result;
  }

  // Render component and measure performance
  private async renderComponent(componentFactory: () => React.ReactElement): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      // Simulate component rendering
      const component = componentFactory();
      
      // Use requestAnimationFrame to ensure rendering is complete
      requestAnimationFrame(() => {
        const endTime = performance.now();
        resolve();
      });
    });
  }

  // Test API performance
  async testAPI(
    name: string,
    apiCall: () => Promise<any>,
    threshold?: number
  ): Promise<PerformanceTestResult> {
    const testThreshold = threshold || this.config.threshold;
    const durations: number[] = [];

    // Warmup iterations
    for (let i = 0; i < this.config.warmupIterations; i++) {
      try {
        await apiCall();
      } catch (error) {
        // Ignore errors during warmup
      }
    }

    // Performance iterations
    for (let i = 0; i < this.config.iterations; i++) {
      const startTime = performance.now();
      try {
        await apiCall();
      } catch (error) {
        // Record failed API calls
        durations.push(this.config.timeout);
      }
      const endTime = performance.now();
      
      durations.push(endTime - startTime);
    }

    const averageTime = durations.reduce((sum, time) => sum + time, 0) / durations.length;
    const minTime = Math.min(...durations);
    const maxTime = Math.max(...durations);
    const passed = averageTime <= testThreshold;

    const result: PerformanceTestResult = {
      name,
      duration: averageTime,
      iterations: this.config.iterations,
      averageTime,
      minTime,
      maxTime,
      passed,
      threshold: testThreshold,
      details: {
        renderTime: averageTime,
        memoryUsage: 0,
        componentCount: 0,
      },
    };

    this.results.push(result);
    return result;
  }

  // Test bundle size
  async testBundleSize(): Promise<BundleAnalysisResult> {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    let totalSize = 0;
    const chunks: Array<{ name: string; size: number }> = [];
    
    // Analyze scripts
    for (const script of scripts) {
      const src = script.getAttribute('src');
      if (src && !src.includes('node_modules')) {
        // In a real implementation, you would fetch the actual size
        const size = 100000; // Placeholder
        totalSize += size;
        chunks.push({
          name: src.split('/').pop() || 'unknown',
          size,
        });
      }
    }

    // Analyze stylesheets
    for (const stylesheet of stylesheets) {
      const href = stylesheet.getAttribute('href');
      if (href && !href.includes('node_modules')) {
        const size = 50000; // Placeholder
        totalSize += size;
        chunks.push({
          name: href.split('/').pop() || 'unknown',
          size,
        });
      }
    }

    // Sort chunks by size
    chunks.sort((a, b) => b.size - a.size);

    // Calculate percentages
    const largestChunks = chunks.slice(0, 5).map(chunk => ({
      ...chunk,
      percentage: (chunk.size / totalSize) * 100,
    }));

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (totalSize > 1024 * 1024) { // > 1MB
      recommendations.push('Bundle size is large. Consider code splitting.');
    }
    
    if (chunks.length > 10) {
      recommendations.push('Too many chunks. Consider consolidating.');
    }
    
    if (largestChunks[0]?.percentage > 50) {
      recommendations.push('Largest chunk is too big. Consider splitting.');
    }

    return {
      totalSize,
      chunkCount: chunks.length,
      largestChunks,
      duplicateModules: [], // Would need bundle analyzer
      unusedModules: [], // Would need bundle analyzer
      recommendations,
    };
  }

  // Get all test results
  getResults(): PerformanceTestResult[] {
    return this.results;
  }

  // Get test summary
  getSummary(): {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    averageTime: number;
    slowestTest: PerformanceTestResult | null;
    fastestTest: PerformanceTestResult | null;
  } {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(result => result.passed).length;
    const failedTests = totalTests - passedTests;
    const averageTime = this.results.reduce((sum, result) => sum + result.averageTime, 0) / totalTests;
    
    const slowestTest = this.results.reduce((slowest, result) => 
      result.averageTime > slowest.averageTime ? result : slowest, 
      this.results[0] || null
    );
    
    const fastestTest = this.results.reduce((fastest, result) => 
      result.averageTime < fastest.averageTime ? result : fastest, 
      this.results[0] || null
    );

    return {
      totalTests,
      passedTests,
      failedTests,
      averageTime,
      slowestTest,
      fastestTest,
    };
  }

  // Clear results
  clearResults(): void {
    this.results = [];
  }
}

// Performance test utilities
export const performanceTestUtils = {
  // Create performance test config
  createConfig(overrides: Partial<PerformanceTestConfig> = {}): PerformanceTestConfig {
    return {
      iterations: 10,
      warmupIterations: 3,
      timeout: 5000,
      threshold: 100,
      ...overrides,
    };
  },

  // Run performance test suite
  async runTestSuite(
    tests: Array<{
      name: string;
      test: () => Promise<PerformanceTestResult>;
    }>
  ): Promise<{
    results: PerformanceTestResult[];
    summary: any;
  }> {
    const runner = new PerformanceTestRunner();
    const results: PerformanceTestResult[] = [];

    for (const { name, test } of tests) {
      try {
        const result = await test();
        results.push(result);
        console.log(`✅ ${name}: ${result.averageTime.toFixed(2)}ms (${result.passed ? 'PASSED' : 'FAILED'})`);
      } catch (error) {
        console.error(`❌ ${name}: ${error}`);
        results.push({
          name,
          duration: 0,
          iterations: 0,
          averageTime: 0,
          minTime: 0,
          maxTime: 0,
          passed: false,
          threshold: 100,
          details: {
            renderTime: 0,
            memoryUsage: 0,
            componentCount: 0,
          },
        });
      }
    }

    const summary = runner.getSummary();
    return { results, summary };
  },

  // Generate performance report
  generateReport(results: PerformanceTestResult[]): string {
    const summary = new PerformanceTestRunner().getSummary();
    
    let report = '# Performance Test Report\n\n';
    report += `## Summary\n`;
    report += `- Total Tests: ${summary.totalTests}\n`;
    report += `- Passed: ${summary.passedTests}\n`;
    report += `- Failed: ${summary.failedTests}\n`;
    report += `- Average Time: ${summary.averageTime.toFixed(2)}ms\n\n`;
    
    report += `## Test Results\n\n`;
    results.forEach(result => {
      report += `### ${result.name}\n`;
      report += `- Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
      report += `- Average Time: ${result.averageTime.toFixed(2)}ms\n`;
      report += `- Min Time: ${result.minTime.toFixed(2)}ms\n`;
      report += `- Max Time: ${result.maxTime.toFixed(2)}ms\n`;
      report += `- Threshold: ${result.threshold}ms\n`;
      report += `- Render Time: ${result.details.renderTime.toFixed(2)}ms\n`;
      report += `- Memory Usage: ${(result.details.memoryUsage / 1024 / 1024).toFixed(2)}MB\n`;
      report += `- Component Count: ${result.details.componentCount}\n\n`;
    });

    return report;
  },
};

// Performance test hooks
export const usePerformanceTest = () => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [results, setResults] = React.useState<PerformanceTestResult[]>([]);
  const [currentTest, setCurrentTest] = React.useState<string>('');

  const runTest = React.useCallback(async (
    name: string,
    testFunction: () => Promise<PerformanceTestResult>
  ) => {
    setIsRunning(true);
    setCurrentTest(name);
    
    try {
      const result = await testFunction();
      setResults(prev => [...prev, result]);
      return result;
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  }, []);

  const clearResults = React.useCallback(() => {
    setResults([]);
  }, []);

  return {
    isRunning,
    results,
    currentTest,
    runTest,
    clearResults,
  };
};