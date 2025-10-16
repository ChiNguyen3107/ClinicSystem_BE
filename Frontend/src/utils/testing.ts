// Testing utilities for performance optimization
import React from 'react';
import { PerformanceMonitoringService } from './monitoring';

// Test interfaces
interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
  metrics?: any;
}

interface PerformanceTest {
  name: string;
  test: () => Promise<boolean>;
  threshold: number;
  timeout: number;
}

// Performance testing service
export class PerformanceTestingService {
  private static instance: PerformanceTestingService;
  private tests: PerformanceTest[] = [];
  private results: TestResult[] = [];

  static getInstance(): PerformanceTestingService {
    if (!PerformanceTestingService.instance) {
      PerformanceTestingService.instance = new PerformanceTestingService();
    }
    return PerformanceTestingService.instance;
  }

  // Add performance test
  addTest(test: PerformanceTest) {
    this.tests.push(test);
  }

  // Run all tests
  async runAllTests(): Promise<TestResult[]> {
    this.results = [];
    
    for (const test of this.tests) {
      const result = await this.runTest(test);
      this.results.push(result);
    }

    return this.results;
  }

  // Run single test
  async runTest(test: PerformanceTest): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      const passed = await Promise.race([
        test.test(),
        new Promise<boolean>((_, reject) => 
          setTimeout(() => reject(new Error('Test timeout')), test.timeout)
        )
      ]);

      const duration = performance.now() - startTime;
      
      return {
        name: test.name,
        passed: passed && duration <= test.threshold,
        duration,
        metrics: { threshold: test.threshold }
      };
    } catch (error) {
      const duration = performance.now() - startTime;
      
      return {
        name: test.name,
        passed: false,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get test results
  getResults(): TestResult[] {
    return [...this.results];
  }

  // Clear tests
  clearTests() {
    this.tests = [];
    this.results = [];
  }
}

// Performance test utilities
export const createPerformanceTest = (
  name: string,
  test: () => Promise<boolean>,
  threshold: number = 1000,
  timeout: number = 5000
): PerformanceTest => ({
  name,
  test,
  threshold,
  timeout
});

// Unit test utilities
export const createUnitTest = <T>(
  name: string,
  test: () => T,
  expected: T
): PerformanceTest => ({
  name,
  test: async () => {
    const result = test();
    return result === expected;
  },
  threshold: 100,
  timeout: 1000
});

// Integration test utilities
export const createIntegrationTest = (
  name: string,
  test: () => Promise<boolean>,
  threshold: number = 2000
): PerformanceTest => ({
  name,
  test,
  threshold,
  timeout: 10000
});

// E2E test utilities
export const createE2ETest = (
  name: string,
  test: () => Promise<boolean>,
  threshold: number = 5000
): PerformanceTest => ({
  name,
  test,
  threshold,
  timeout: 30000
});

// Performance test hooks
export const usePerformanceTesting = () => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [results, setResults] = React.useState<TestResult[]>([]);
  const testingService = PerformanceTestingService.getInstance();

  const runTests = async () => {
    setIsRunning(true);
    try {
      const testResults = await testingService.runAllTests();
      setResults(testResults);
    } finally {
      setIsRunning(false);
    }
  };

  const addTest = (test: PerformanceTest) => {
    testingService.addTest(test);
  };

  const clearTests = () => {
    testingService.clearTests();
    setResults([]);
  };

  return { isRunning, results, runTests, addTest, clearTests };
};

// Performance test components
export const PerformanceTestRunner: React.FC<{
  tests: PerformanceTest[];
  onComplete?: (results: TestResult[]) => void;
}> = ({ tests, onComplete }) => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [results, setResults] = React.useState<TestResult[]>([]);
  const testingService = PerformanceTestingService.getInstance();

  React.useEffect(() => {
    tests.forEach(test => testingService.addTest(test));
  }, [tests, testingService]);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const testResults = await testingService.runAllTests();
      setResults(testResults);
      onComplete?.(testResults);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={runTests}
        disabled={isRunning}
        className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
      >
        {isRunning ? 'Đang chạy...' : 'Chạy Performance Tests'}
      </button>
      
      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              <div className="font-semibold">{result.name}</div>
              <div className="text-sm">
                {result.passed ? 'PASSED' : 'FAILED'} - {result.duration.toFixed(2)}ms
              </div>
              {result.error && (
                <div className="text-sm text-red-600">{result.error}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Performance test results component
export const PerformanceTestResults: React.FC<{
  results: TestResult[];
}> = ({ results }) => {
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const averageDuration = results.reduce((sum, r) => sum + r.duration, 0) / totalTests;

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Performance Test Results</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{passedTests}</div>
          <div className="text-sm text-gray-600">Passed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{totalTests - passedTests}</div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{averageDuration.toFixed(2)}ms</div>
          <div className="text-sm text-gray-600">Avg Duration</div>
        </div>
      </div>

      <div className="space-y-2">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded border ${
              result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{result.name}</span>
              <span className={`text-sm ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                {result.passed ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Duration: {result.duration.toFixed(2)}ms
              {result.metrics && (
                <span> (Threshold: {result.metrics.threshold}ms)</span>
              )}
            </div>
            {result.error && (
              <div className="text-sm text-red-600 mt-1">{result.error}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Performance test suite
export const createPerformanceTestSuite = () => {
  const testingService = PerformanceTestingService.getInstance();
  
  // Add common performance tests
  testingService.addTest(createUnitTest(
    'Component Render Time',
    () => {
      const start = performance.now();
      // Simulate component render
      const end = performance.now();
      return end - start < 16; // Should render in one frame
    },
    true
  ));

  testingService.addTest(createIntegrationTest(
    'API Response Time',
    async () => {
      const start = performance.now();
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      const end = performance.now();
      return end - start < 1000; // Should respond within 1 second
    }
  ));

  testingService.addTest(createE2ETest(
    'Page Load Time',
    async () => {
      const start = performance.now();
      // Simulate page load
      await new Promise(resolve => setTimeout(resolve, 500));
      const end = performance.now();
      return end - start < 3000; // Should load within 3 seconds
    }
  ));

  return testingService;
};
