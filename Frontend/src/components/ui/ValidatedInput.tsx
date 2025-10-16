import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/FormField';
import { cn } from '@/utils/cn';
import { useFormValidation } from '@/utils/validationHelpers';

interface ValidatedInputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  title?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className,
  inputClassName,
  labelClassName,
  errorClassName,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  title,
  onBlur,
  onChange,
}) => {
  const { register, formState: { errors } } = useFormContext();
  const { getFieldError, hasFieldError } = useFormValidation();
  
  const error = getFieldError(errors, name);
  const hasError = hasFieldError(errors, name);

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      className={className}
      errorClassName={errorClassName}
      labelClassName={labelClassName}
    >
      <Input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        title={title}
        onBlur={onBlur}
        onChange={onChange}
        className={cn(
          hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          inputClassName
        )}
      />
    </FormField>
  );
};

interface ValidatedTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  textareaClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  rows?: number;
  maxLength?: number;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ValidatedTextarea: React.FC<ValidatedTextareaProps> = ({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  className,
  textareaClassName,
  labelClassName,
  errorClassName,
  rows = 3,
  maxLength,
  onBlur,
  onChange,
}) => {
  const { register, formState: { errors } } = useFormContext();
  const { getFieldError, hasFieldError } = useFormValidation();
  
  const error = getFieldError(errors, name);
  const hasError = hasFieldError(errors, name);

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      className={className}
      errorClassName={errorClassName}
      labelClassName={labelClassName}
    >
      <textarea
        {...register(name)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        onBlur={onBlur}
        onChange={onChange}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          textareaClassName
        )}
      />
    </FormField>
  );
};

interface ValidatedSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  selectClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  onValueChange?: (value: string) => void;
}

export const ValidatedSelect: React.FC<ValidatedSelectProps> = ({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  className,
  selectClassName,
  labelClassName,
  errorClassName,
  options,
  onValueChange,
}) => {
  const { register, formState: { errors } } = useFormContext();
  const { getFieldError, hasFieldError } = useFormValidation();
  
  const error = getFieldError(errors, name);
  const hasError = hasFieldError(errors, name);

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      className={className}
      errorClassName={errorClassName}
      labelClassName={labelClassName}
    >
      <select
        {...register(name)}
        disabled={disabled}
        onChange={(e) => {
          register(name).onChange(e);
          onValueChange?.(e.target.value);
        }}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          selectClassName
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

interface ValidatedCheckboxProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const ValidatedCheckbox: React.FC<ValidatedCheckboxProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  className,
  checkboxClassName,
  labelClassName,
  errorClassName,
  onCheckedChange,
}) => {
  const { register, formState: { errors } } = useFormContext();
  const { getFieldError, hasFieldError } = useFormValidation();
  
  const error = getFieldError(errors, name);
  const hasError = hasFieldError(errors, name);

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      className={className}
      errorClassName={errorClassName}
      labelClassName={labelClassName}
    >
      <div className="flex items-center space-x-2">
        <input
          {...register(name)}
          type="checkbox"
          disabled={disabled}
          onChange={(e) => {
            register(name).onChange(e);
            onCheckedChange?.(e.target.checked);
          }}
          className={cn(
            'h-4 w-4 rounded border border-input bg-background text-primary ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            checkboxClassName
          )}
        />
        <label
          htmlFor={name}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            hasError && 'text-red-500',
            labelClassName
          )}
        >
          {label}
        </label>
      </div>
    </FormField>
  );
};
