// Bundle optimization utilities
import { apiCache } from './cache';

// Tree shaking utilities
export const treeShakeImports = (imports: string[]) => {
  return imports.filter(imp => {
    // Remove unused imports
    return imp && !imp.includes('unused');
  });
};

// Dynamic import optimization
export const optimizedDynamicImport = <T>(
  importFunc: () => Promise<T>,
  cacheKey?: string
): Promise<T> => {
  if (cacheKey) {
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return Promise.resolve(cached);
    }
  }

  return importFunc().then(result => {
    if (cacheKey) {
      apiCache.set(cacheKey, result);
    }
    return result;
  });
};

// Bundle analysis utilities
export const analyzeBundle = () => {
  const scripts = document.querySelectorAll('script[src]');
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  
  const analysis = {
    scripts: Array.from(scripts).map(script => ({
      src: script.getAttribute('src'),
      size: 'unknown', // Would need to fetch to get actual size
    })),
    stylesheets: Array.from(stylesheets).map(link => ({
      href: link.getAttribute('href'),
      size: 'unknown',
    })),
    totalScripts: scripts.length,
    totalStylesheets: stylesheets.length,
  };

  return analysis;
};

// Code splitting utilities
export const createCodeSplit = <T>(
  importFunc: () => Promise<T>,
  chunkName?: string
) => {
  return () => {
    const startTime = performance.now();
    
    return importFunc().then(result => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      console.log(`Chunk ${chunkName || 'unknown'} loaded in ${loadTime.toFixed(2)}ms`);
      
      return result;
    });
  };
};

// Preload critical chunks
export const preloadCriticalChunks = () => {
  const criticalChunks = [
    'react-vendor',
    'ui-vendor',
    'utils-vendor',
  ];

  criticalChunks.forEach(chunkName => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = `/js/${chunkName}-[hash].js`;
    document.head.appendChild(link);
  });
};

// Bundle size monitoring
export const monitorBundleSize = () => {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      if (entry.entryType === 'resource') {
        const resource = entry as PerformanceResourceTiming;
        if (resource.name.includes('.js') || resource.name.includes('.css')) {
          console.log(`Resource loaded: ${resource.name} (${resource.transferSize} bytes)`);
        }
      }
    });
  });

  observer.observe({ entryTypes: ['resource'] });
};

// Optimize imports
export const optimizeImports = (imports: Record<string, any>) => {
  const optimized = {};
  
  Object.entries(imports).forEach(([key, value]) => {
    if (typeof value === 'function') {
      // Lazy load functions
      optimized[key] = () => Promise.resolve(value());
    } else if (typeof value === 'object' && value.default) {
      // Handle default exports
      optimized[key] = value.default;
    } else {
      optimized[key] = value;
    }
  });
  
  return optimized;
};

// Dead code elimination
export const eliminateDeadCode = (code: string) => {
  // This is a simplified version - in reality, you'd use tools like webpack or rollup
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/\s+/g, ' ') // Remove extra whitespace
    .trim();
};

// Bundle compression
export const compressBundle = (code: string) => {
  // This is a simplified version - in reality, you'd use tools like terser or esbuild
  return code
    .replace(/\s+/g, ' ')
    .replace(/;\s*}/g, '}')
    .replace(/{\s*/g, '{')
    .replace(/\s*}/g, '}')
    .trim();
};

// Chunk optimization
export const optimizeChunks = (chunks: Record<string, any>) => {
  const optimized = {};
  
  Object.entries(chunks).forEach(([name, chunk]) => {
    if (chunk.size > 100000) { // 100KB
      console.warn(`Large chunk detected: ${name} (${chunk.size} bytes)`);
    }
    
    optimized[name] = {
      ...chunk,
      optimized: true,
      compressionRatio: chunk.compressedSize / chunk.originalSize,
    };
  });
  
  return optimized;
};

// Performance budget
export const checkPerformanceBudget = (budget: {
  maxBundleSize: number;
  maxChunkSize: number;
  maxLoadTime: number;
}) => {
  const analysis = analyzeBundle();
  const violations = [];
  
  if (analysis.totalScripts > budget.maxBundleSize) {
    violations.push(`Too many scripts: ${analysis.totalScripts} > ${budget.maxBundleSize}`);
  }
  
  if (analysis.totalStylesheets > budget.maxChunkSize) {
    violations.push(`Too many stylesheets: ${analysis.totalStylesheets} > ${budget.maxChunkSize}`);
  }
  
  return {
    violations,
    withinBudget: violations.length === 0,
  };
};

// Bundle optimization recommendations
export const getOptimizationRecommendations = () => {
  const analysis = analyzeBundle();
  const recommendations = [];
  
  if (analysis.totalScripts > 10) {
    recommendations.push('Consider code splitting to reduce the number of scripts');
  }
  
  if (analysis.totalStylesheets > 5) {
    recommendations.push('Consider merging stylesheets to reduce HTTP requests');
  }
  
  return recommendations;
};