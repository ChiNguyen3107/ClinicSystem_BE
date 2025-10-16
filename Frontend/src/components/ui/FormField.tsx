import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/utils/cn';
import { useFormValidation } from '@/utils/validationHelpers';

interface FormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  errorClassName?: string;
  labelClassName?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  required = false,
  children,
  className,
  errorClassName,
  labelClassName,
}) => {
  const { formState: { errors } } = useFormContext();
  const { getFieldError, hasFieldError } = useFormValidation();
  
  const error = getFieldError(errors, name);
  const hasError = hasFieldError(errors, name);

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={name}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          hasError && 'text-red-500',
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {children}
      </div>
      
      {error && (
        <p className={cn(
          'text-sm text-red-500',
          errorClassName
        )}>
          {error}
        </p>
      )}
    </div>
  );
};

interface FormFieldWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
};

interface FormErrorProps {
  error?: string;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  error,
  className,
}) => {
  if (!error) return null;

  return (
    <div className={cn(
      'text-sm text-red-500 mt-1',
      className
    )}>
      {error}
    </div>
  );
};

interface FormSuccessProps {
  message?: string;
  className?: string;
}

export const FormSuccess: React.FC<FormSuccessProps> = ({
  message,
  className,
}) => {
  if (!message) return null;

  return (
    <div className={cn(
      'text-sm text-green-500 mt-1',
      className
    )}>
      {message}
    </div>
  );
};
