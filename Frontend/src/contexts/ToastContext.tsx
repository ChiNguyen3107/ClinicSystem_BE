import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastContainer, ToastProps } from '@/components/ui/Toast';

interface Toast {
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
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
  success: (title: string, message?: string, options?: Partial<Toast>) => void;
  error: (title: string, message?: string, options?: Partial<Toast>) => void;
  warning: (title: string, message?: string, options?: Partial<Toast>) => void;
  info: (title: string, message?: string, options?: Partial<Toast>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const success = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({
      type: 'success',
      title,
      message,
      duration: 5000,
      ...options
    });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({
      type: 'error',
      title,
      message,
      duration: 7000,
      ...options
    });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({
      type: 'warning',
      title,
      message,
      duration: 6000,
      ...options
    });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({
      type: 'info',
      title,
      message,
      duration: 5000,
      ...options
    });
  }, [addToast]);

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};
