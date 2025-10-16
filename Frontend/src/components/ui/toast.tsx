import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'default' | 'destructive';
  }>;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  actions
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 w-80 max-w-sm transform transition-all duration-300 ease-in-out',
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div
        className={cn(
          'rounded-lg border shadow-lg p-4',
          getBackgroundColor()
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900">
              {title}
            </h4>
            {message && (
              <p className="text-sm text-gray-600 mt-1">
                {message}
              </p>
            )}
            
            {actions && actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={cn(
                      'text-xs px-3 py-1 rounded-md font-medium transition-colors',
                      action.variant === 'destructive'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    actions?: Array<{
      label: string;
      action: () => void;
      variant?: 'default' | 'destructive';
    }>;
  }>;
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            transform: `translateY(${index * 8}px)`,
            zIndex: 1000 - index
          }}
        >
          <Toast
            {...toast}
            onClose={onClose}
          />
        </div>
      ))}
    </div>
  );
};