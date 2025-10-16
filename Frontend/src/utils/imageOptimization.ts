// Image optimization utilities
import { imageCache } from './cache';

// Image optimization options
interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  width?: number;
  height?: number;
  lazy?: boolean;
  placeholder?: string;
}

// Optimize image URL
export const optimizeImageUrl = (
  src: string,
  options: ImageOptimizationOptions = {}
): string => {
  const {
    quality = 80,
    format = 'webp',
    width,
    height,
  } = options;

  // If it's already an optimized URL, return as is
  if (src.includes('optimized') || src.includes('format=')) {
    return src;
  }

  // For external images, you might want to use a service like Cloudinary or ImageKit
  if (src.startsWith('http')) {
    const params = new URLSearchParams();
    params.set('format', format);
    params.set('quality', quality.toString());
    if (width) params.set('width', width.toString());
    if (height) params.set('height', height.toString());
    
    return `${src}?${params.toString()}`;
  }

  return src;
};

// Lazy load image with optimization
export const LazyOptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  options?: ImageOptimizationOptions;
  onLoad?: () => void;
  onError?: () => void;
}> = ({ src, alt, className, options = {}, onLoad, onError }) => {
  const [imageSrc, setImageSrc] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  // Check cache first
  React.useEffect(() => {
    const cached = imageCache.get(src);
    if (cached) {
      setImageSrc(cached);
      setIsLoading(false);
      return;
    }

    // Optimize image URL
    const optimizedSrc = optimizeImageUrl(src, options);
    setImageSrc(optimizedSrc);
  }, [src, options]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    imageCache.set(src, imageSrc);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <span className="text-gray-500 text-sm">Lỗi tải hình ảnh</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {isLoading && (
        <div className="flex items-center justify-center bg-gray-100 h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: isLoading ? 'none' : 'block' }}
        loading={options.lazy ? 'lazy' : 'eager'}
        className={className}
      />
    </div>
  );
};

// Image preloader
export const preloadImage = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cached = imageCache.get(src);
    if (cached) {
      resolve(cached);
      return;
    }

    const img = new Image();
    img.onload = () => {
      imageCache.set(src, src);
      resolve(src);
    };
    img.onerror = reject;
    img.src = src;
  });
};

// Batch preload images
export const preloadImages = async (srcs: string[]): Promise<string[]> => {
  const promises = srcs.map(src => preloadImage(src));
  return Promise.allSettled(promises).then(results => {
    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<string>).value);
  });
};

// Responsive image component
export const ResponsiveImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  srcSet?: string;
  options?: ImageOptimizationOptions;
}> = ({ src, alt, className, sizes, srcSet, options = {} }) => {
  const [imageSrc, setImageSrc] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const optimizedSrc = optimizeImageUrl(src, options);
    setImageSrc(optimizedSrc);
  }, [src, options]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={className}>
      {isLoading && (
        <div className="flex items-center justify-center bg-gray-100 h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        sizes={sizes}
        srcSet={srcSet}
        onLoad={handleLoad}
        loading="lazy"
        style={{ display: isLoading ? 'none' : 'block' }}
        className={className}
      />
    </div>
  );
};

// Image optimization service
export class ImageOptimizationService {
  private static instance: ImageOptimizationService;
  private cache = new Map<string, string>();

  static getInstance(): ImageOptimizationService {
    if (!ImageOptimizationService.instance) {
      ImageOptimizationService.instance = new ImageOptimizationService();
    }
    return ImageOptimizationService.instance;
  }

  async optimizeImage(
    src: string,
    options: ImageOptimizationOptions = {}
  ): Promise<string> {
    const cacheKey = `${src}_${JSON.stringify(options)}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const optimizedSrc = optimizeImageUrl(src, options);
      this.cache.set(cacheKey, optimizedSrc);
      return optimizedSrc;
    } catch (error) {
      console.error('Failed to optimize image:', error);
      return src;
    }
  }

  async batchOptimizeImages(
    srcs: string[],
    options: ImageOptimizationOptions = {}
  ): Promise<string[]> {
    const promises = srcs.map(src => this.optimizeImage(src, options));
    return Promise.all(promises);
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Image optimization hook
export const useImageOptimization = (src: string, options: ImageOptimizationOptions = {}) => {
  const [optimizedSrc, setOptimizedSrc] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const optimize = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const service = ImageOptimizationService.getInstance();
        const optimized = await service.optimizeImage(src, options);
        setOptimizedSrc(optimized);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setOptimizedSrc(src); // Fallback to original
      } finally {
        setIsLoading(false);
      }
    };

    optimize();
  }, [src, options]);

  return { optimizedSrc, isLoading, error };
};

// Image compression utility
export const compressImage = (
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Image format detection
export const detectImageFormat = (file: File): string => {
  return file.type.split('/')[1] || 'unknown';
};

// Image size validation
export const validateImageSize = (
  file: File,
  maxSize: number = 5 * 1024 * 1024 // 5MB
): boolean => {
  return file.size <= maxSize;
};

// Image dimensions validation
export const validateImageDimensions = (
  file: File,
  maxWidth: number = 4096,
  maxHeight: number = 4096
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(img.width <= maxWidth && img.height <= maxHeight);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
};