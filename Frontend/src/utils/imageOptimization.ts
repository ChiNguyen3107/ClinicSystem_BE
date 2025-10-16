// Image optimization utilities
export interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  width?: number;
  height?: number;
  lazy?: boolean;
  placeholder?: boolean;
  blur?: boolean;
}

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// Image optimization class
export class ImageOptimizer {
  private static instance: ImageOptimizer;
  private cache = new Map<string, string>();
  private lazyObserver?: IntersectionObserver;

  static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer();
    }
    return ImageOptimizer.instance;
  }

  // Generate optimized image URL
  generateOptimizedURL(
    src: string,
    options: ImageOptimizationOptions = {}
  ): string {
    const {
      quality = 80,
      format = 'webp',
      width,
      height,
    } = options;

    // Check cache first
    const cacheKey = `${src}-${quality}-${format}-${width}-${height}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // In a real implementation, you would use an image optimization service
    // like Cloudinary, ImageKit, or Next.js Image Optimization
    let optimizedURL = src;

    // Add query parameters for optimization
    const params = new URLSearchParams();
    
    if (quality !== 80) params.set('q', quality.toString());
    if (format !== 'webp') params.set('f', format);
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());

    if (params.toString()) {
      optimizedURL += (src.includes('?') ? '&' : '?') + params.toString();
    }

    // Cache the result
    this.cache.set(cacheKey, optimizedURL);
    return optimizedURL;
  }

  // Generate responsive image sources
  generateResponsiveSources(
    src: string,
    sizes: number[] = [320, 640, 768, 1024, 1280, 1920],
    options: ImageOptimizationOptions = {}
  ): { src: string; width: number; media?: string }[] {
    return sizes.map((width, index) => ({
      src: this.generateOptimizedURL(src, { ...options, width }),
      width,
      media: index === 0 ? undefined : `(min-width: ${width}px)`,
    }));
  }

  // Generate blur placeholder
  generateBlurPlaceholder(width: number = 10, height: number = 10): string {
    // Generate a simple blur placeholder
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a simple gradient blur
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(1, '#e5e7eb');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    return canvas.toDataURL('image/jpeg', 0.1);
  }

  // Lazy load images
  setupLazyLoading(): void {
    if (typeof window === 'undefined') return;

    this.lazyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              this.lazyObserver?.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );
  }

  // Observe image for lazy loading
  observeImage(img: HTMLImageElement): void {
    if (this.lazyObserver) {
      this.lazyObserver.observe(img);
    }
  }

  // Preload critical images
  preloadImage(src: string, options: ImageOptimizationOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = this.generateOptimizedURL(src, options);
    });
  }

  // Get image dimensions
  getImageDimensions(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  // Optimize image for different devices
  getDeviceOptimizedImage(
    src: string,
    deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
  ): string {
    const deviceConfigs = {
      mobile: { width: 375, quality: 75, format: 'webp' as const },
      tablet: { width: 768, quality: 80, format: 'webp' as const },
      desktop: { width: 1200, quality: 85, format: 'webp' as const },
    };

    const config = deviceConfigs[deviceType];
    return this.generateOptimizedURL(src, config);
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// React hook for image optimization
export const useImageOptimization = () => {
  const optimizer = ImageOptimizer.getInstance();

  const optimizeImage = useCallback(
    (src: string, options: ImageOptimizationOptions = {}) => {
      return optimizer.generateOptimizedURL(src, options);
    },
    [optimizer]
  );

  const getResponsiveImages = useCallback(
    (src: string, sizes?: number[], options?: ImageOptimizationOptions) => {
      return optimizer.generateResponsiveSources(src, sizes, options);
    },
    [optimizer]
  );

  const preloadImage = useCallback(
    (src: string, options?: ImageOptimizationOptions) => {
      return optimizer.preloadImage(src, options);
    },
    [optimizer]
  );

  const getBlurPlaceholder = useCallback(
    (width?: number, height?: number) => {
      return optimizer.generateBlurPlaceholder(width, height);
    },
    [optimizer]
  );

  return {
    optimizeImage,
    getResponsiveImages,
    preloadImage,
    getBlurPlaceholder,
  };
};

// Image optimization component
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 80,
  format = 'webp',
  sizes,
  placeholder = 'blur',
  blurDataURL,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const optimizer = ImageOptimizer.getInstance();

  // Generate optimized source
  const optimizedSrc = useMemo(() => {
    return optimizer.generateOptimizedURL(src, {
      quality,
      format,
      width,
      height,
    });
  }, [src, quality, format, width, height, optimizer]);

  // Generate blur placeholder
  const placeholderSrc = useMemo(() => {
    if (blurDataURL) return blurDataURL;
    if (placeholder === 'blur') {
      return optimizer.generateBlurPlaceholder(width, height);
    }
    return '';
  }, [blurDataURL, placeholder, width, height, optimizer]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle image error
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  // Setup lazy loading
  useEffect(() => {
    if (!priority && imgRef.current) {
      optimizer.observeImage(imgRef.current);
    }
  }, [priority, optimizer]);

  // Preload critical images
  useEffect(() => {
    if (priority) {
      optimizer.preloadImage(src, { quality, format, width, height });
    }
  }, [priority, src, quality, format, width, height, optimizer]);

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Không thể tải hình ảnh</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          style={{ width, height }}
        />
      )}
      <img
        ref={imgRef}
        src={priority ? optimizedSrc : undefined}
        data-src={!priority ? optimizedSrc : undefined}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ width, height }}
      />
    </div>
  );
};

// Image optimization utilities
export const imageOptimizationUtils = {
  // Check if image format is supported
  isFormatSupported(format: string): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    try {
      return canvas.toDataURL(`image/${format}`).indexOf(`data:image/${format}`) === 0;
    } catch {
      return false;
    }
  },

  // Get optimal format for browser
  getOptimalFormat(): 'webp' | 'jpeg' | 'png' | 'avif' {
    if (this.isFormatSupported('avif')) return 'avif';
    if (this.isFormatSupported('webp')) return 'webp';
    return 'jpeg';
  },

  // Calculate optimal quality based on file size
  calculateOptimalQuality(fileSize: number, targetSize: number): number {
    const ratio = targetSize / fileSize;
    return Math.max(10, Math.min(100, Math.round(ratio * 100)));
  },

  // Generate responsive sizes string
  generateSizesString(breakpoints: { [key: string]: number }): string {
    return Object.entries(breakpoints)
      .sort(([, a], [, b]) => a - b)
      .map(([size, width]) => `(max-width: ${width}px) ${size}px`)
      .join(', ');
  },
};
