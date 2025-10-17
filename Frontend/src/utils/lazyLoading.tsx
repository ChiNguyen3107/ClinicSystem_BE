import { ComponentType, lazy, Suspense } from 'react';
import { componentCache } from './cache';

// Lazy loading utilities for better performance
export const createLazyComponent = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc);
  
  return (props: P) => {
    return (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

// Default fallback component
const DefaultFallback = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
  </div>
);

// Preload component for better UX
export const preloadComponent = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>
) => {
  return importFunc().then(module => {
    componentCache.set(module.default.name || 'Component', module.default);
    return module;
  });
};

// Route-based lazy loading
export const createLazyRoute = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc);
  
  return (props: P) => (
    <Suspense fallback={fallback || <RouteFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Route fallback component
const RouteFallback = () => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <p className="text-sm text-gray-600">Đang tải trang...</p>
  </div>
);

// Dynamic import with retry mechanism
export const dynamicImport = async <T>(
  importFunc: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFunc();
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
};

// Lazy load with intersection observer
export const useLazyLoad = (
  threshold: number = 0.1,
  rootMargin: string = '50px'
) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const elementRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasLoaded]);

  return { elementRef, isVisible, hasLoaded };
};

// Lazy load images
export const LazyImage: React.FC<{
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}> = ({ src, alt, placeholder, className, onLoad, onError }) => {
  const { elementRef, isVisible } = useLazyLoad();
  const [imageSrc, setImageSrc] = React.useState(placeholder || '');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (isVisible && src) {
      setImageSrc(src);
    }
  }, [isVisible, src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    onError?.();
  };

  return (
    <div ref={elementRef} className={className}>
      {isLoading && (
        <div className="flex items-center justify-center h-32 bg-gray-100">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: isLoading ? 'none' : 'block' }}
        className={className}
      />
    </div>
  );
};

// Lazy load with progressive enhancement
export const ProgressiveLazyLoad: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}> = ({ children, fallback, threshold = 0.1, rootMargin = '50px' }) => {
  const { elementRef, isVisible } = useLazyLoad(threshold, rootMargin);

  return (
    <div ref={elementRef}>
      {isVisible ? children : fallback}
    </div>
  );
};

// Preload critical resources
export const preloadCriticalResources = async () => {
  const criticalResources = [
    '/src/pages/Dashboard.tsx',
    '/src/pages/Login.tsx',
    '/src/components/layout/MainLayout.tsx',
  ];

  const preloadPromises = criticalResources.map(resource => {
    return dynamicImport(() => import(resource));
  });

  try {
    await Promise.all(preloadPromises);
    console.log('Critical resources preloaded successfully');
  } catch (error) {
    console.warn('Failed to preload some critical resources:', error);
  }
};

// Lazy load with error boundary
export const LazyLoadWithErrorBoundary: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}> = ({ children, fallback, errorFallback }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return errorFallback || <div>Lỗi tải component</div>;
  }

  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// Route preloading utility
export const preloadRoute = (routePath: string) => {
  const routeMap: Record<string, () => Promise<any>> = {
    '/': () => import('@/pages/Dashboard'),
    '/patients': () => import('@/pages/patients/PatientsPage'),
    '/appointments': () => import('@/pages/appointments/AppointmentsPage'),
    '/doctors': () => import('@/pages/doctors/DoctorsPage'),
    '/visits': () => import('@/pages/visits/VisitsPage'),
    '/services': () => import('@/pages/services/ServicesPage'),
    '/prescriptions': () => import('@/pages/prescriptions/PrescriptionsPage'),
    '/billing': () => import('@/pages/billing/BillingPage'),
    '/reports': () => import('@/pages/reports/ReportsPage'),
    '/settings': () => import('@/pages/settings/SettingsPage'),
  };

  const importFunc = routeMap[routePath];
  if (importFunc) {
    return importFunc();
  }
  
  return Promise.reject(new Error(`Route ${routePath} not found`));
};

// Batch preload routes
export const preloadRoutes = async (routes: string[]) => {
  const preloadPromises = routes.map(route => preloadRoute(route));
  return Promise.allSettled(preloadPromises);
};
