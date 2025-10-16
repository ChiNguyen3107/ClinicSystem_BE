// CSS optimization utilities
export interface CSSOptimizationOptions {
  minify?: boolean;
  removeUnused?: boolean;
  criticalCSS?: boolean;
  purgeCSS?: boolean;
  autoprefixer?: boolean;
  compress?: boolean;
}

export interface CSSAnalysisResult {
  totalSize: number;
  unusedRules: number;
  duplicateRules: number;
  criticalSize: number;
  nonCriticalSize: number;
  recommendations: string[];
}

// CSS optimization class
export class CSSOptimizer {
  private static instance: CSSOptimizer;
  private cache = new Map<string, string>();

  static getInstance(): CSSOptimizer {
    if (!CSSOptimizer.instance) {
      CSSOptimizer.instance = new CSSOptimizer();
    }
    return CSSOptimizer.instance;
  }

  // Optimize CSS string
  optimizeCSS(css: string, options: CSSOptimizationOptions = {}): string {
    const {
      minify = true,
      removeUnused = false,
      criticalCSS = false,
      purgeCSS = false,
      autoprefixer = true,
      compress = true,
    } = options;

    let optimizedCSS = css;

    // Remove comments
    if (minify) {
      optimizedCSS = optimizedCSS.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    // Remove unnecessary whitespace
    if (compress) {
      optimizedCSS = optimizedCSS
        .replace(/\s+/g, ' ')
        .replace(/;\s*}/g, '}')
        .replace(/\s*{\s*/g, '{')
        .replace(/;\s*/g, ';')
        .trim();
    }

    // Add autoprefixer (simplified version)
    if (autoprefixer) {
      optimizedCSS = this.addVendorPrefixes(optimizedCSS);
    }

    // Remove unused CSS (simplified version)
    if (removeUnused) {
      optimizedCSS = this.removeUnusedCSS(optimizedCSS);
    }

    return optimizedCSS;
  }

  // Add vendor prefixes
  private addVendorPrefixes(css: string): string {
    const prefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];
    const properties = [
      'transform',
      'transition',
      'animation',
      'border-radius',
      'box-shadow',
      'flex',
      'grid',
    ];

    let prefixedCSS = css;

    properties.forEach(property => {
      const regex = new RegExp(`(${property}):\\s*([^;]+);`, 'g');
      prefixedCSS = prefixedCSS.replace(regex, (match, prop, value) => {
        let result = match;
        prefixes.forEach(prefix => {
          result = `${prefix}${prop}: ${value};\n${result}`;
        });
        return result;
      });
    });

    return prefixedCSS;
  }

  // Remove unused CSS (simplified version)
  private removeUnusedCSS(css: string): string {
    // This is a simplified version - in production you'd use PurgeCSS
    const usedClasses = this.getUsedClasses();
    const cssRules = this.parseCSSRules(css);
    
    const usedRules = cssRules.filter(rule => {
      return rule.selectors.some(selector => {
        return usedClasses.some(usedClass => 
          selector.includes(usedClass)
        );
      });
    });

    return usedRules.map(rule => rule.toString()).join('\n');
  }

  // Get used CSS classes from DOM
  private getUsedClasses(): string[] {
    if (typeof window === 'undefined') return [];
    
    const classes = new Set<string>();
    const elements = document.querySelectorAll('*');
    
    elements.forEach(element => {
      const classList = element.classList;
      classList.forEach(className => classes.add(className));
    });

    return Array.from(classes);
  }

  // Parse CSS rules
  private parseCSSRules(css: string): Array<{
    selectors: string[];
    properties: string[];
    toString(): string;
  }> {
    const rules: any[] = [];
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let match;

    while ((match = ruleRegex.exec(css)) !== null) {
      const selectors = match[1].split(',').map(s => s.trim());
      const properties = match[2].split(';').map(p => p.trim()).filter(p => p);
      
      rules.push({
        selectors,
        properties,
        toString() {
          return `${this.selectors.join(', ')} { ${this.properties.join('; ')} }`;
        }
      });
    }

    return rules;
  }

  // Analyze CSS
  analyzeCSS(css: string): CSSAnalysisResult {
    const rules = this.parseCSSRules(css);
    const usedClasses = this.getUsedClasses();
    
    let totalSize = css.length;
    let unusedRules = 0;
    let duplicateRules = 0;
    let criticalSize = 0;
    let nonCriticalSize = 0;

    // Count unused rules
    rules.forEach(rule => {
      const isUsed = rule.selectors.some(selector => {
        return usedClasses.some(usedClass => 
          selector.includes(usedClass)
        );
      });
      
      if (!isUsed) {
        unusedRules++;
        nonCriticalSize += rule.toString().length;
      } else {
        criticalSize += rule.toString().length;
      }
    });

    // Count duplicate rules (simplified)
    const ruleStrings = rules.map(rule => rule.toString());
    const uniqueRules = new Set(ruleStrings);
    duplicateRules = ruleStrings.length - uniqueRules.size;

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (unusedRules > 0) {
      recommendations.push(`Remove ${unusedRules} unused CSS rules`);
    }
    
    if (duplicateRules > 0) {
      recommendations.push(`Remove ${duplicateRules} duplicate CSS rules`);
    }
    
    if (nonCriticalSize > criticalSize) {
      recommendations.push('Consider critical CSS extraction');
    }
    
    if (totalSize > 100000) { // > 100KB
      recommendations.push('CSS bundle is large, consider splitting');
    }

    return {
      totalSize,
      unusedRules,
      duplicateRules,
      criticalSize,
      nonCriticalSize,
      recommendations,
    };
  }

  // Generate critical CSS
  generateCriticalCSS(css: string, viewport: string = 'above-the-fold'): string {
    const rules = this.parseCSSRules(css);
    const criticalSelectors = this.getCriticalSelectors(viewport);
    
    const criticalRules = rules.filter(rule => {
      return rule.selectors.some(selector => {
        return criticalSelectors.some(criticalSelector => 
          selector.includes(criticalSelector)
        );
      });
    });

    return criticalRules.map(rule => rule.toString()).join('\n');
  }

  // Get critical selectors
  private getCriticalSelectors(viewport: string): string[] {
    const commonSelectors = [
      'body', 'html', 'head', 'title',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'a', 'img', 'div', 'span',
      'button', 'input', 'form', 'label',
      'nav', 'header', 'footer', 'main',
      'section', 'article', 'aside',
    ];

    if (viewport === 'above-the-fold') {
      return [
        ...commonSelectors,
        '.container', '.wrapper', '.content',
        '.header', '.navbar', '.hero',
        '.btn', '.button', '.link',
      ];
    }

    return commonSelectors;
  }

  // Inline critical CSS
  inlineCriticalCSS(css: string): string {
    const criticalCSS = this.generateCriticalCSS(css);
    return `<style>${criticalCSS}</style>`;
  }

  // Preload non-critical CSS
  preloadCSS(href: string): string {
    return `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">`;
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

// CSS optimization hook
export const useCSSOptimization = () => {
  const optimizer = CSSOptimizer.getInstance();

  const optimizeCSS = useCallback(
    (css: string, options?: CSSOptimizationOptions) => {
      return optimizer.optimizeCSS(css, options);
    },
    [optimizer]
  );

  const analyzeCSS = useCallback(
    (css: string) => {
      return optimizer.analyzeCSS(css);
    },
    [optimizer]
  );

  const generateCriticalCSS = useCallback(
    (css: string, viewport?: string) => {
      return optimizer.generateCriticalCSS(css, viewport);
    },
    [optimizer]
  );

  return {
    optimizeCSS,
    analyzeCSS,
    generateCriticalCSS,
  };
};

// CSS optimization component
export const OptimizedCSS: React.FC<{
  css: string;
  critical?: boolean;
  inline?: boolean;
  options?: CSSOptimizationOptions;
}> = ({ css, critical = false, inline = false, options = {} }) => {
  const { optimizeCSS, generateCriticalCSS } = useCSSOptimization();
  const [optimizedCSS, setOptimizedCSS] = useState('');

  useEffect(() => {
    let processedCSS = css;
    
    if (critical) {
      processedCSS = generateCriticalCSS(css);
    }
    
    const optimized = optimizeCSS(processedCSS, options);
    setOptimizedCSS(optimized);
  }, [css, critical, options, optimizeCSS, generateCriticalCSS]);

  if (inline) {
    return React.createElement('style', { dangerouslySetInnerHTML: { __html: optimizedCSS } });
  }

  return null;
};

// CSS optimization utilities
export const cssOptimizationUtils = {
  // Check if CSS is critical
  isCriticalCSS(selector: string): boolean {
    const criticalSelectors = [
      'body', 'html', 'head', 'title',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'a', 'img', 'div', 'span',
      'button', 'input', 'form', 'label',
      'nav', 'header', 'footer', 'main',
    ];

    return criticalSelectors.some(critical => 
      selector.includes(critical)
    );
  },

  // Get CSS performance score
  getCSSPerformanceScore(analysis: CSSAnalysisResult): number {
    let score = 100;
    
    // Penalize for unused CSS
    if (analysis.unusedRules > 0) {
      score -= Math.min(30, analysis.unusedRules * 2);
    }
    
    // Penalize for duplicate CSS
    if (analysis.duplicateRules > 0) {
      score -= Math.min(20, analysis.duplicateRules * 3);
    }
    
    // Penalize for large CSS
    if (analysis.totalSize > 100000) { // > 100KB
      score -= 20;
    }
    
    // Bonus for critical CSS
    if (analysis.criticalSize > analysis.nonCriticalSize) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  },

  // Generate CSS report
  generateCSSReport(analysis: CSSAnalysisResult): string {
    let report = '# CSS Optimization Report\n\n';
    report += `## Analysis Results\n`;
    report += `- Total Size: ${(analysis.totalSize / 1024).toFixed(2)}KB\n`;
    report += `- Unused Rules: ${analysis.unusedRules}\n`;
    report += `- Duplicate Rules: ${analysis.duplicateRules}\n`;
    report += `- Critical Size: ${(analysis.criticalSize / 1024).toFixed(2)}KB\n`;
    report += `- Non-Critical Size: ${(analysis.nonCriticalSize / 1024).toFixed(2)}KB\n\n`;
    
    report += `## Recommendations\n`;
    analysis.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
    
    const score = this.getCSSPerformanceScore(analysis);
    report += `\n## Performance Score: ${score}/100\n`;
    
    return report;
  },
};
