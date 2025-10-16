import { useForm, UseFormProps, FieldValues, Path } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { yup } from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { ValidationErrorHandler, NetworkErrorHandler } from '@/utils/validationHelpers';
import { asyncValidators, asyncValidationMethods } from '@/utils/asyncValidators';

interface UseFormValidationOptions<T extends FieldValues> extends UseFormProps<T> {
  schema: yup.ObjectSchema<any>;
  enableAsyncValidation?: boolean;
  debounceMs?: number;
}

export const useFormValidation = <T extends FieldValues>({
  schema,
  enableAsyncValidation = false,
  debounceMs = 500,
  ...formOptions
}: UseFormValidationOptions<T>) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const form = useForm<T>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    ...formOptions,
  });

  const { handleSubmit, watch, setError, clearErrors, formState: { errors } } = form;

  // Async validation for specific fields
  const validateFieldAsync = useCallback(async (fieldName: Path<T>, value: any) => {
    if (!enableAsyncValidation) return;

    setIsValidating(true);
    
    try {
      // Email validation
      if (fieldName === 'email' && value) {
        const exists = await asyncValidators.checkEmailExists(value);
        if (exists) {
          setError(fieldName, { message: 'Email đã được sử dụng' });
        } else {
          clearErrors(fieldName);
        }
      }

      // Phone validation
      if (fieldName === 'phone' && value) {
        const exists = await asyncValidators.checkPhoneExists(value);
        if (exists) {
          setError(fieldName, { message: 'Số điện thoại đã được sử dụng' });
        } else {
          clearErrors(fieldName);
        }
      }

      // License number validation
      if (fieldName === 'licenseNumber' && value) {
        const exists = await asyncValidators.checkLicenseNumberExists(value);
        if (exists) {
          setError(fieldName, { message: 'Số giấy phép đã được sử dụng' });
        } else {
          clearErrors(fieldName);
        }
      }
    } catch (error) {
      console.error(`Async validation error for ${fieldName}:`, error);
    } finally {
      setIsValidating(false);
    }
  }, [enableAsyncValidation, setError, clearErrors]);

  // Debounced validation
  const debouncedValidate = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (fieldName: Path<T>, value: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          validateFieldAsync(fieldName, value);
        }, debounceMs);
      };
    })(),
    [validateFieldAsync, debounceMs]
  );

  // Watch for field changes and trigger async validation
  useEffect(() => {
    if (!enableAsyncValidation) return;

    const subscription = watch((value, { name, type }) => {
      if (name && type === 'change') {
        debouncedValidate(name as Path<T>, value[name as keyof T]);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedValidate, enableAsyncValidation]);

  // Enhanced submit handler with error handling
  const handleFormSubmit = useCallback(
    (onSubmit: (data: T) => Promise<void> | void) => {
      return handleSubmit(async (data) => {
        try {
          setIsValidating(true);
          await onSubmit(data);
        } catch (error: any) {
          const errorMessage = NetworkErrorHandler.handleNetworkError(error);
          setValidationErrors({ root: errorMessage });
        } finally {
          setIsValidating(false);
        }
      });
    },
    [handleSubmit]
  );

  // Get field error
  const getFieldError = useCallback((fieldName: Path<T>): string | undefined => {
    return errors[fieldName]?.message || validationErrors[fieldName];
  }, [errors, validationErrors]);

  // Check if field has error
  const hasFieldError = useCallback((fieldName: Path<T>): boolean => {
    return !!(errors[fieldName] || validationErrors[fieldName]);
  }, [errors, validationErrors]);

  // Get all errors
  const getAllErrors = useCallback((): string[] => {
    const formErrors = ValidationErrorHandler.formatErrors(errors);
    const asyncErrors = Object.values(validationErrors);
    return [...formErrors, ...asyncErrors];
  }, [errors, validationErrors]);

  // Check if form has errors
  const hasErrors = useCallback((): boolean => {
    return Object.keys(errors).length > 0 || Object.keys(validationErrors).length > 0;
  }, [errors, validationErrors]);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    clearErrors();
    setValidationErrors({});
  }, [clearErrors]);

  // Set field error manually
  const setFieldError = useCallback((fieldName: Path<T>, message: string) => {
    setError(fieldName, { message });
  }, [setError]);

  // Set multiple errors
  const setMultipleErrors = useCallback((errors: Record<string, string>) => {
    Object.entries(errors).forEach(([field, message]) => {
      setError(field as Path<T>, { message });
    });
  }, [setError]);

  return {
    ...form,
    handleFormSubmit,
    getFieldError,
    hasFieldError,
    getAllErrors,
    hasErrors,
    clearAllErrors,
    setFieldError,
    setMultipleErrors,
    isValidating,
    validationErrors,
  };
};

// Hook for real-time validation
export const useRealTimeValidation = () => {
  const [validatingFields, setValidatingFields] = useState<Set<string>>(new Set());
  const [validationResults, setValidationResults] = useState<Record<string, boolean>>({});

  const validateField = useCallback(async (
    fieldName: string,
    value: any,
    validator: (value: any) => Promise<boolean>
  ) => {
    setValidatingFields(prev => new Set(prev).add(fieldName));
    
    try {
      const isValid = await validator(value);
      setValidationResults(prev => ({ ...prev, [fieldName]: isValid }));
      return isValid;
    } catch (error) {
      console.error(`Validation error for ${fieldName}:`, error);
      setValidationResults(prev => ({ ...prev, [fieldName]: false }));
      return false;
    } finally {
      setValidatingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }
  }, []);

  const isFieldValidating = useCallback((fieldName: string) => {
    return validatingFields.has(fieldName);
  }, [validatingFields]);

  const isFieldValid = useCallback((fieldName: string) => {
    return validationResults[fieldName] || false;
  }, [validationResults]);

  return {
    validateField,
    isFieldValidating,
    isFieldValid,
    validatingFields: Array.from(validatingFields),
    validationResults,
  };
};

// Hook for cross-field validation
export const useCrossFieldValidation = <T extends FieldValues>() => {
  const validateCrossFields = useCallback((
    values: T,
    rules: Array<{
      fields: (keyof T)[];
      validator: (values: T) => boolean;
      message: string;
    }>
  ): Record<keyof T, string> => {
    const errors: Record<keyof T, string> = {} as Record<keyof T, string>;

    rules.forEach(rule => {
      if (!rule.validator(values)) {
        rule.fields.forEach(field => {
          errors[field] = rule.message;
        });
      }
    });

    return errors;
  }, []);

  return { validateCrossFields };
};

// Hook for file validation
export const useFileValidation = () => {
  const validateFile = useCallback((
    file: File,
    options: {
      maxSize?: number;
      allowedTypes?: string[];
      minSize?: number;
    } = {}
  ) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
      minSize = 0
    } = options;

    if (file.size < minSize) {
      return `File phải có kích thước ít nhất ${Math.round(minSize / 1024)}KB`;
    }

    if (file.size > maxSize) {
      return `File không được quá ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return `Chỉ chấp nhận các định dạng: ${allowedTypes.join(', ')}`;
    }

    return null;
  }, []);

  return { validateFile };
};

// Hook for form state management
export const useFormState = <T extends FieldValues>(initialValues: T) => {
  const [isDirty, setIsDirty] = useState(false);
  const [changedFields, setChangedFields] = useState<Set<keyof T>>(new Set());

  const checkDirty = useCallback((currentValues: T) => {
    const dirty = JSON.stringify(initialValues) !== JSON.stringify(currentValues);
    setIsDirty(dirty);

    if (dirty) {
      const changed = new Set<keyof T>();
      Object.keys(currentValues).forEach(key => {
        if (initialValues[key as keyof T] !== currentValues[key as keyof T]) {
          changed.add(key as keyof T);
        }
      });
      setChangedFields(changed);
    } else {
      setChangedFields(new Set());
    }
  }, [initialValues]);

  const resetToInitial = useCallback((setValue: (name: keyof T, value: any) => void) => {
    Object.keys(initialValues).forEach(key => {
      setValue(key as keyof T, initialValues[key as keyof T]);
    });
    setIsDirty(false);
    setChangedFields(new Set());
  }, [initialValues]);

  return {
    isDirty,
    changedFields: Array.from(changedFields),
    checkDirty,
    resetToInitial,
  };
};
