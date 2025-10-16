import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Đã xảy ra lỗi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ quản trị viên nếu lỗi vẫn tiếp tục.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer">Chi tiết lỗi</summary>
                <pre className="mt-2 p-2 bg-muted rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex gap-2">
              <Button
                onClick={this.handleReset}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
              <Button
                onClick={() => window.location.reload()}
                size="sm"
                className="flex-1"
              >
                Tải lại trang
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Hook for error boundary
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

// Error display component
interface ErrorDisplayProps {
  error?: Error | string;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title = 'Đã xảy ra lỗi',
  description = 'Có lỗi xảy ra. Vui lòng thử lại.',
  onRetry,
  onDismiss,
  showDetails = false,
}) => {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {description}
        </p>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800 font-medium">
              {errorMessage}
            </p>
          </div>
        )}

        {showDetails && errorStack && (
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer">Chi tiết lỗi</summary>
            <pre className="mt-2 p-2 bg-muted rounded overflow-auto">
              {errorStack}
            </pre>
          </details>
        )}

        <div className="flex gap-2">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          )}
          {onDismiss && (
            <Button
              onClick={onDismiss}
              size="sm"
              className="flex-1"
            >
              Đóng
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Form error display component
interface FormErrorDisplayProps {
  errors: Record<string, string>;
  title?: string;
  onClear?: () => void;
}

export const FormErrorDisplay: React.FC<FormErrorDisplayProps> = ({
  errors,
  title = 'Lỗi xác thực',
  onClear,
}) => {
  const errorEntries = Object.entries(errors);

  if (errorEntries.length === 0) return null;

  return (
    <Card className="w-full border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-red-600">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </div>
          {onClear && (
            <Button
              onClick={onClear}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              Đóng
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {errorEntries.map(([field, message]) => (
            <li key={field} className="text-sm text-red-800">
              <span className="font-medium">{field}:</span> {message}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
