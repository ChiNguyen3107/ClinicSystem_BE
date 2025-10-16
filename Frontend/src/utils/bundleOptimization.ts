// Bundle optimization utilities
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

export interface BundleOptimizationOptions {
  enableTreeShaking?: boolean;
  enableCodeSplitting?: boolean;
  enableCompression?: boolean;
  enableMinification?: boolean;
  enableSourceMaps?: boolean;
  targetBrowsers?: string[];
}

// Bundle analyzer class
export class BundleAnalyzer {
  private static instance: BundleAnalyzer;
  private analysisCache = new Map<string, BundleAnalysisResult>();

  static getInstance(): BundleAnalyzer {
    if (!BundleAnalyzer.instance) {
      BundleAnalyzer.instance = new BundleAnalyzer();
    }
    return BundleAnalyzer.instance;
  }

  // Analyze current bundle
  analyzeBundle(): BundleAnalysisResult {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    let totalSize = 0;
    const chunks: Array<{ name: string; size: number }> = [];
    
    // Analyze scripts
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && !src.includes('node_modules')) {
        const size = this.estimateScriptSize(src);
        totalSize += size;
        chunks.push({
          name: this.getChunkName(src),
          size,
        });
      }
    });

    // Analyze stylesheets
    stylesheets.forEach(stylesheet => {
      const href = stylesheet.getAttribute('href');
      if (href && !href.includes('node_modules')) {
        const size = this.estimateStylesheetSize(href);
        totalSize += size;
        chunks.push({
          name: this.getChunkName(href),
          size,
        });
      }
    });

    // Sort chunks by size
    chunks.sort((a, b) => b.size - a.size);

    // Calculate percentages
    const largestChunks = chunks.slice(0, 5).map(chunk => ({
      ...chunk,
      percentage: (chunk.size / totalSize) * 100,
    }));

    // Find duplicate modules (simplified)
    const duplicateModules = this.findDuplicateModules(chunks);

    // Find unused modules (simplified)
    const unusedModules = this.findUnusedModules();

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      totalSize,
      chunkCount: chunks.length,
      largestChunks,
      duplicateModules,
      unusedModules,
    });

    const result: BundleAnalysisResult = {
      totalSize,
      chunkCount: chunks.length,
      largestChunks,
      duplicateModules,
      unusedModules,
      recommendations,
    };

    this.analysisCache.set('current', result);
    return result;
  }

  // Estimate script size (simplified)
  private estimateScriptSize(src: string): number {
    // In a real implementation, you would fetch the actual size
    const baseSize = 50000; // 50KB base
    const complexity = this.getScriptComplexity(src);
    return baseSize * complexity;
  }

  // Estimate stylesheet size (simplified)
  private estimateStylesheetSize(href: string): number {
    const baseSize = 20000; // 20KB base
    const complexity = this.getStylesheetComplexity(href);
    return baseSize * complexity;
  }

  // Get script complexity
  private getScriptComplexity(src: string): number {
    if (src.includes('vendor') || src.includes('chunk')) return 2;
    if (src.includes('main') || src.includes('app')) return 1.5;
    if (src.includes('polyfill')) return 0.5;
    return 1;
  }

  // Get stylesheet complexity
  private getStylesheetComplexity(href: string): number {
    if (href.includes('vendor') || href.includes('chunk')) return 1.5;
    if (href.includes('main') || href.includes('app')) return 1;
    return 0.8;
  }

  // Get chunk name
  private getChunkName(url: string): string {
    const filename = url.split('/').pop() || 'unknown';
    return filename.split('.')[0] || 'unknown';
  }

  // Find duplicate modules (simplified)
  private findDuplicateModules(chunks: Array<{ name: string; size: number }>): Array<{
    name: string;
    count: number;
    totalSize: number;
  }> {
    const moduleCounts = new Map<string, number>();
    const moduleSizes = new Map<string, number>();

    chunks.forEach(chunk => {
      const count = moduleCounts.get(chunk.name) || 0;
      const size = moduleSizes.get(chunk.name) || 0;
      
      moduleCounts.set(chunk.name, count + 1);
      moduleSizes.set(chunk.name, size + chunk.size);
    });

    return Array.from(moduleCounts.entries())
      .filter(([, count]) => count > 1)
      .map(([name, count]) => ({
        name,
        count,
        totalSize: moduleSizes.get(name) || 0,
      }));
  }

  // Find unused modules (simplified)
  private findUnusedModules(): string[] {
    // This is a simplified version - in production you'd use bundle analyzer
    const commonUnusedModules = [
      'moment',
      'lodash',
      'jquery',
      'bootstrap',
      'font-awesome',
    ];

    return commonUnusedModules.filter(module => {
      // Check if module is actually used
      return !this.isModuleUsed(module);
    });
  }

  // Check if module is used (simplified)
  private isModuleUsed(moduleName: string): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check if module is imported or used
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    return scripts.some(script => {
      const src = script.getAttribute('src');
      return src && src.includes(moduleName);
    });
  }

  // Generate recommendations
  private generateRecommendations(analysis: Partial<BundleAnalysisResult>): string[] {
    const recommendations: string[] = [];
    
    if (analysis.totalSize && analysis.totalSize > 1024 * 1024) { // > 1MB
      recommendations.push('Bundle size is large. Consider code splitting.');
    }
    
    if (analysis.chunkCount && analysis.chunkCount > 10) {
      recommendations.push('Too many chunks. Consider consolidating.');
    }
    
    if (analysis.largestChunks && analysis.largestChunks[0]?.percentage > 50) {
      recommendations.push('Largest chunk is too big. Consider splitting.');
    }
    
    if (analysis.duplicateModules && analysis.duplicateModules.length > 0) {
      recommendations.push('Remove duplicate modules to reduce bundle size.');
    }
    
    if (analysis.unusedModules && analysis.unusedModules.length > 0) {
      recommendations.push('Remove unused modules to reduce bundle size.');
    }

    return recommendations;
  }

  // Get bundle performance score
  getBundlePerformanceScore(analysis: BundleAnalysisResult): number {
    let score = 100;
    
    // Penalize for large bundle size
    if (analysis.totalSize > 1024 * 1024) { // > 1MB
      score -= 30;
    } else if (analysis.totalSize > 512 * 1024) { // > 512KB
      score -= 15;
    }
    
    // Penalize for too many chunks
    if (analysis.chunkCount > 10) {
      score -= 20;
    } else if (analysis.chunkCount > 5) {
      score -= 10;
    }
    
    // Penalize for large chunks
    if (analysis.largestChunks[0]?.percentage > 50) {
      score -= 25;
    } else if (analysis.largestChunks[0]?.percentage > 30) {
      score -= 15;
    }
    
    // Penalize for duplicate modules
    if (analysis.duplicateModules.length > 0) {
      score -= analysis.duplicateModules.length * 5;
    }
    
    // Penalize for unused modules
    if (analysis.unusedModules.length > 0) {
      score -= analysis.unusedModules.length * 3;
    }

    return Math.max(0, Math.min(100, score));
  }

  // Generate bundle report
  generateBundleReport(analysis: BundleAnalysisResult): string {
    let report = '# Bundle Analysis Report\n\n';
    report += `## Bundle Statistics\n`;
    report += `- Total Size: ${(analysis.totalSize / 1024 / 1024).toFixed(2)}MB\n`;
    report += `- Chunk Count: ${analysis.chunkCount}\n`;
    report += `- Largest Chunk: ${analysis.largestChunks[0]?.name || 'N/A'} (${analysis.largestChunks[0]?.percentage.toFixed(1)}%)\n\n`;
    
    report += `## Largest Chunks\n`;
    analysis.largestChunks.forEach((chunk, index) => {
      report += `${index + 1}. ${chunk.name}: ${(chunk.size / 1024).toFixed(2)}KB (${chunk.percentage.toFixed(1)}%)\n`;
    });
    
    if (analysis.duplicateModules.length > 0) {
      report += `\n## Duplicate Modules\n`;
      analysis.duplicateModules.forEach(module => {
        report += `- ${module.name}: ${module.count} times (${(module.totalSize / 1024).toFixed(2)}KB)\n`;
      });
    }
    
    if (analysis.unusedModules.length > 0) {
      report += `\n## Unused Modules\n`;
      analysis.unusedModules.forEach(module => {
        report += `- ${module}\n`;
      });
    }
    
    report += `\n## Recommendations\n`;
    analysis.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
    
    const score = this.getBundlePerformanceScore(analysis);
    report += `\n## Performance Score: ${score}/100\n`;
    
    return report;
  }

  // Clear cache
  clearCache(): void {
    this.analysisCache.clear();
  }
}

// Bundle optimization hook
export const useBundleOptimization = () => {
  const analyzer = BundleAnalyzer.getInstance();

  const analyzeBundle = useCallback(() => {
    return analyzer.analyzeBundle();
  }, [analyzer]);

  const getBundleScore = useCallback((analysis: BundleAnalysisResult) => {
    return analyzer.getBundlePerformanceScore(analysis);
  }, [analyzer]);

  const generateReport = useCallback((analysis: BundleAnalysisResult) => {
    return analyzer.generateBundleReport(analysis);
  }, [analyzer]);

  return {
    analyzeBundle,
    getBundleScore,
    generateReport,
  };
};

// Bundle optimization utilities
export const bundleOptimizationUtils = {
  // Check if bundle is optimized
  isBundleOptimized(analysis: BundleAnalysisResult): boolean {
    const score = BundleAnalyzer.getInstance().getBundlePerformanceScore(analysis);
    return score >= 80;
  },

  // Get optimization suggestions
  getOptimizationSuggestions(analysis: BundleAnalysisResult): string[] {
    const suggestions: string[] = [];
    
    if (analysis.totalSize > 1024 * 1024) {
      suggestions.push('Enable code splitting to reduce initial bundle size');
    }
    
    if (analysis.chunkCount > 10) {
      suggestions.push('Consolidate small chunks to reduce HTTP requests');
    }
    
    if (analysis.largestChunks[0]?.percentage > 50) {
      suggestions.push('Split large chunks into smaller, more manageable pieces');
    }
    
    if (analysis.duplicateModules.length > 0) {
      suggestions.push('Use webpack-bundle-analyzer to identify and remove duplicate modules');
    }
    
    if (analysis.unusedModules.length > 0) {
      suggestions.push('Remove unused modules to reduce bundle size');
    }

    return suggestions;
  },

  // Generate optimization config
  generateOptimizationConfig(analysis: BundleAnalysisResult): BundleOptimizationOptions {
    const config: BundleOptimizationOptions = {
      enableTreeShaking: true,
      enableCodeSplitting: analysis.totalSize > 512 * 1024,
      enableCompression: true,
      enableMinification: true,
      enableSourceMaps: false,
      targetBrowsers: ['last 2 versions', '> 1%', 'not dead'],
    };

    return config;
  },
};
