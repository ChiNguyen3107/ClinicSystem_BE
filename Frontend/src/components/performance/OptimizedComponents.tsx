import React, { Suspense, ComponentType, ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Optimized Suspense component with better error handling
export const OptimizedSuspense: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
}> = ({ children, fallback, delay = 200 }) => {
  const [showFallback, setShowFallback] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowFallback(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Suspense fallback={showFallback ? fallback : null}>
      {children}
    </Suspense>
  );
};

// Error fallback component
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary,
}) => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4 p-4">
    <div className="text-red-500 text-center">
      <h2 className="text-lg font-semibold mb-2">Đã xảy ra lỗi</h2>
      <p className="text-sm text-gray-600 mb-4">
        {error.message || 'Có lỗi không mong muốn xảy ra'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Thử lại
      </button>
    </div>
  </div>
);

// Optimized Error Boundary with better error handling
export const OptimizedErrorBoundary: React.FC<{
  children: ReactNode;
  fallback?: ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
}> = ({ children, fallback: Fallback = ErrorFallback }) => {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error('Error caught by boundary:', error, errorInfo);
    // Here you can send error to monitoring service
  };

  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onError={handleError}
      onReset={() => {
        // Reset app state if needed
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

// Memoized component wrapper for performance
export const withMemo = <P extends object>(
  Component: ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return React.memo(Component, areEqual);
};

// Lazy component wrapper with preloading
export const withLazy = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode
) => {
  const LazyComponent = React.lazy(importFunc);
  
  return React.forwardRef<any, P>((props, ref) => (
    <OptimizedSuspense fallback={fallback}>
      <LazyComponent {...props} ref={ref} />
    </OptimizedSuspense>
  ));
};

// Component for preloading routes
export const PreloadRoute: React.FC<{
  path: string;
  importFunc: () => Promise<any>;
}> = ({ path, importFunc }) => {
  React.useEffect(() => {
    // Preload component when route is likely to be visited
    const timer = setTimeout(() => {
      importFunc();
    }, 1000);

    return () => clearTimeout(timer);
  }, [importFunc]);

  return null;
};

// Performance monitoring component
export const PerformanceMonitor: React.FC<{
  componentName: string;
  children: ReactNode;
}> = ({ componentName, children }) => {
  const startTime = React.useRef<number>(0);

  React.useEffect(() => {
    startTime.current = performance.now();
  }, []);

  React.useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    if (renderTime > 16) { // More than one frame
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  });

  return <>{children}</>;
};

// Virtual scrolling component for large lists
export const VirtualList: React.FC<{
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => ReactNode;
}> = ({ items, itemHeight, containerHeight, renderItem }) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  
  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};