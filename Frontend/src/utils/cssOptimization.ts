// CSS optimization utilities
import React from 'react';

// CSS optimization options
interface CSSOptimizationOptions {
  minify?: boolean;
  removeUnused?: boolean;
  criticalPath?: boolean;
  inline?: boolean;
}

// Critical CSS extraction
export const extractCriticalCSS = (): string => {
  const criticalSelectors = [
    'body',
    'html',
    '.container',
    '.header',
    '.navigation',
    '.main-content',
    '.sidebar',
    '.footer',
    '.button',
    '.input',
    '.form',
    '.card',
    '.modal',
    '.loading',
    '.error',
    '.success',
  ];

  const criticalCSS: string[] = [];
  
  // This is a simplified version - in reality, you'd use tools like critical
  criticalSelectors.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      const styles = window.getComputedStyle(element);
      const css = `${selector} { ${styles.cssText} }`;
      criticalCSS.push(css);
    }
  });

  return criticalCSS.join('\n');
};

// CSS purging utility
export const purgeUnusedCSS = (css: string, usedSelectors: string[]): string => {
  const lines = css.split('\n');
  const purgedLines: string[] = [];

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      purgedLines.push(line);
      return;
    }

    // Check if selector is used
    const isUsed = usedSelectors.some(selector => 
      trimmedLine.includes(selector) || 
      trimmedLine.includes('@media') ||
      trimmedLine.includes('@keyframes') ||
      trimmedLine.includes('@import')
    );

    if (isUsed) {
      purgedLines.push(line);
    }
  });

  return purgedLines.join('\n');
};

// CSS minification
export const minifyCSS = (css: string): string => {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
    .replace(/{\s*/g, '{') // Remove space after opening brace
    .replace(/\s*}/g, '}') // Remove space before closing brace
    .replace(/:\s*/g, ':') // Remove space after colon
    .replace(/;\s*/g, ';') // Remove space after semicolon
    .replace(/,\s*/g, ',') // Remove space after comma
    .trim();
};

// CSS optimization service
export class CSSOptimizationService {
  private static instance: CSSOptimizationService;
  private cache = new Map<string, string>();

  static getInstance(): CSSOptimizationService {
    if (!CSSOptimizationService.instance) {
      CSSOptimizationService.instance = new CSSOptimizationService();
    }
    return CSSOptimizationService.instance;
  }

  async optimizeCSS(
    css: string,
    options: CSSOptimizationOptions = {}
  ): Promise<string> {
    const cacheKey = `${css}_${JSON.stringify(options)}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let optimizedCSS = css;

    if (options.minify) {
      optimizedCSS = minifyCSS(optimizedCSS);
    }

    if (options.removeUnused) {
      const usedSelectors = this.extractUsedSelectors();
      optimizedCSS = purgeUnusedCSS(optimizedCSS, usedSelectors);
    }

    this.cache.set(cacheKey, optimizedCSS);
    return optimizedCSS;
  }

  private extractUsedSelectors(): string[] {
    const selectors: string[] = [];
    
    // Extract selectors from DOM
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const tagName = element.tagName.toLowerCase();
      const className = element.className;
      const id = element.id;
      
      if (tagName) selectors.push(tagName);
      if (className) {
        className.split(' ').forEach(cls => {
          if (cls.trim()) selectors.push(`.${cls.trim()}`);
        });
      }
      if (id) selectors.push(`#${id}`);
    });

    return [...new Set(selectors)];
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// CSS loading optimization
export const optimizeCSSLoading = () => {
  // Preload critical CSS
  const criticalCSS = extractCriticalCSS();
  if (criticalCSS) {
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }

  // Defer non-critical CSS
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  stylesheets.forEach(link => {
    if (!link.getAttribute('data-critical')) {
      link.setAttribute('media', 'print');
      (link as HTMLLinkElement).onload = () => {
        link.setAttribute('media', 'all');
      };
    }
  });
};

// CSS-in-JS optimization
export const optimizeCSSInJS = (styles: Record<string, any>) => {
  const optimized: Record<string, any> = {};
  
  Object.entries(styles).forEach(([key, value]) => {
    if (typeof value === 'string') {
      optimized[key] = minifyCSS(value);
    } else if (typeof value === 'object' && value !== null) {
      optimized[key] = optimizeCSSInJS(value);
    } else {
      optimized[key] = value;
    }
  });
  
  return optimized;
};

// CSS performance monitoring
export const monitorCSSPerformance = () => {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      if (entry.entryType === 'resource') {
        const resource = entry as PerformanceResourceTiming;
        if (resource.name.includes('.css')) {
          console.log(`CSS loaded: ${resource.name} (${resource.transferSize} bytes, ${resource.duration}ms)`);
        }
      }
    });
  });

  observer.observe({ entryTypes: ['resource'] });
};

// CSS bundle analysis
export const analyzeCSSBundle = () => {
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  const inlineStyles = document.querySelectorAll('style');
  
  const analysis = {
    externalStylesheets: Array.from(stylesheets).map(link => ({
      href: link.getAttribute('href'),
      size: 'unknown',
    })),
    inlineStyles: Array.from(inlineStyles).map(style => ({
      content: style.textContent?.substring(0, 100) + '...',
      size: style.textContent?.length || 0,
    })),
    totalExternal: stylesheets.length,
    totalInline: inlineStyles.length,
  };

  return analysis;
};

// CSS optimization recommendations
export const getCSSOptimizationRecommendations = () => {
  const analysis = analyzeCSSBundle();
  const recommendations = [];
  
  if (analysis.totalExternal > 5) {
    recommendations.push('Consider merging external stylesheets to reduce HTTP requests');
  }
  
  if (analysis.totalInline > 3) {
    recommendations.push('Consider moving inline styles to external stylesheets');
  }
  
  return recommendations;
};

// CSS critical path optimization
export const optimizeCriticalPath = () => {
  // Extract critical CSS
  const criticalCSS = extractCriticalCSS();
  
  // Inline critical CSS
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  style.setAttribute('data-critical', 'true');
  document.head.insertBefore(style, document.head.firstChild);
  
  // Defer non-critical CSS
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
  stylesheets.forEach(link => {
    link.setAttribute('media', 'print');
    (link as HTMLLinkElement).onload = () => {
      link.setAttribute('media', 'all');
    };
  });
};

// CSS compression
export const compressCSS = (css: string): string => {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
    .replace(/{\s*/g, '{') // Remove space after opening brace
    .replace(/\s*}/g, '}') // Remove space before closing brace
    .replace(/:\s*/g, ':') // Remove space after colon
    .replace(/;\s*/g, ';') // Remove space after semicolon
    .replace(/,\s*/g, ',') // Remove space after comma
    .trim();
};

// CSS optimization hook
export const useCSSOptimization = (css: string, options: CSSOptimizationOptions = {}) => {
  const [optimizedCSS, setOptimizedCSS] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const optimize = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const service = CSSOptimizationService.getInstance();
        const optimized = await service.optimizeCSS(css, options);
        setOptimizedCSS(optimized);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setOptimizedCSS(css); // Fallback to original
      } finally {
        setIsLoading(false);
      }
    };

    optimize();
  }, [css, options]);

  return { optimizedCSS, isLoading, error };
};