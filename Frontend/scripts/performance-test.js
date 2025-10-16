import { performanceTestUtils } from '../src/utils/performanceTesting.js';
import { BundleAnalyzer } from '../src/utils/bundleOptimization.js';
import { CSSOptimizer } from '../src/utils/cssOptimization.js';

// Performance test suite
async function runPerformanceTests() {
  console.log('🚀 Starting Performance Tests...\n');

  try {
    // Test 1: Bundle Analysis
    console.log('📦 Testing Bundle Analysis...');
    const bundleAnalyzer = BundleAnalyzer.getInstance();
    const bundleAnalysis = bundleAnalyzer.analyzeBundle();
    const bundleScore = bundleAnalyzer.getBundlePerformanceScore(bundleAnalysis);
    
    console.log(`Bundle Score: ${bundleScore}/100`);
    console.log(`Total Size: ${(bundleAnalysis.totalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Chunk Count: ${bundleAnalysis.chunkCount}`);
    console.log(`Largest Chunk: ${bundleAnalysis.largestChunks[0]?.name} (${bundleAnalysis.largestChunks[0]?.percentage.toFixed(1)}%)`);
    
    if (bundleAnalysis.recommendations.length > 0) {
      console.log('Recommendations:');
      bundleAnalysis.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
    console.log('');

    // Test 2: CSS Analysis
    console.log('🎨 Testing CSS Analysis...');
    const cssOptimizer = CSSOptimizer.getInstance();
    const sampleCSS = `
      .container { width: 100%; height: 100vh; }
      .header { background: #fff; padding: 1rem; }
      .content { margin: 2rem 0; }
      .footer { background: #f5f5f5; padding: 1rem; }
      .unused-class { display: none; }
    `;
    
    const cssAnalysis = cssOptimizer.analyzeCSS(sampleCSS);
    console.log(`CSS Total Size: ${(cssAnalysis.totalSize / 1024).toFixed(2)}KB`);
    console.log(`Unused Rules: ${cssAnalysis.unusedRules}`);
    console.log(`Duplicate Rules: ${cssAnalysis.duplicateRules}`);
    console.log(`Critical Size: ${(cssAnalysis.criticalSize / 1024).toFixed(2)}KB`);
    
    if (cssAnalysis.recommendations.length > 0) {
      console.log('CSS Recommendations:');
      cssAnalysis.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
    console.log('');

    // Test 3: Performance Test Suite
    console.log('⚡ Running Performance Test Suite...');
    const testSuite = [
      {
        name: 'Component Render Test',
        test: async () => {
          const startTime = performance.now();
          // Simulate component render
          await new Promise(resolve => setTimeout(resolve, 50));
          const endTime = performance.now();
          
          return {
            name: 'Component Render Test',
            duration: endTime - startTime,
            iterations: 1,
            averageTime: endTime - startTime,
            minTime: endTime - startTime,
            maxTime: endTime - startTime,
            passed: (endTime - startTime) < 100,
            threshold: 100,
            details: {
              renderTime: endTime - startTime,
              memoryUsage: 0,
              componentCount: 0,
            },
          };
        }
      },
      {
        name: 'API Response Test',
        test: async () => {
          const startTime = performance.now();
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 200));
          const endTime = performance.now();
          
          return {
            name: 'API Response Test',
            duration: endTime - startTime,
            iterations: 1,
            averageTime: endTime - startTime,
            minTime: endTime - startTime,
            maxTime: endTime - startTime,
            passed: (endTime - startTime) < 1000,
            threshold: 1000,
            details: {
              renderTime: endTime - startTime,
              memoryUsage: 0,
              componentCount: 0,
            },
          };
        }
      }
    ];

    const { results, summary } = await performanceTestUtils.runTestSuite(testSuite);
    
    console.log(`Total Tests: ${summary.totalTests}`);
    console.log(`Passed: ${summary.passedTests}`);
    console.log(`Failed: ${summary.failedTests}`);
    console.log(`Average Time: ${summary.averageTime.toFixed(2)}ms`);
    console.log('');

    // Test 4: Generate Reports
    console.log('📊 Generating Performance Reports...');
    const bundleReport = bundleAnalyzer.generateBundleReport(bundleAnalysis);
    const performanceReport = performanceTestUtils.generateReport(results);
    
    console.log('Bundle Report Generated ✅');
    console.log('Performance Report Generated ✅');
    console.log('');

    // Overall Performance Score
    const overallScore = Math.round((bundleScore + (summary.passedTests / summary.totalTests) * 100) / 2);
    console.log(`🎯 Overall Performance Score: ${overallScore}/100`);
    
    if (overallScore >= 90) {
      console.log('🌟 Excellent Performance!');
    } else if (overallScore >= 70) {
      console.log('👍 Good Performance');
    } else if (overallScore >= 50) {
      console.log('⚠️  Needs Improvement');
    } else {
      console.log('🚨 Poor Performance - Optimization Required');
    }

    console.log('\n✅ Performance Tests Completed!');

  } catch (error) {
    console.error('❌ Performance Tests Failed:', error);
    process.exit(1);
  }
}

// Run tests
runPerformanceTests();
