import * as yup from 'yup';
import React from 'react';
import { patientService } from '@/api/services/patient.service';
import { doctorService } from '@/api/services/doctor.service';
import { userService } from '@/api/services/user.service';

// Async validation functions
export const asyncValidators = {
  // Check if email already exists
  checkEmailExists: async (email: string, excludeId?: string): Promise<boolean> => {
    try {
      // In a real app, you would call the API to check if email exists
      // For now, we'll simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock validation - return false to simulate email doesn't exist
      return false;
    } catch (error) {
      console.error('Email validation error:', error);
      return false;
    }
  },

  // Check if phone already exists
  checkPhoneExists: async (phone: string, excludeId?: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return false;
    } catch (error) {
      console.error('Phone validation error:', error);
      return false;
    }
  },

  // Check if patient code already exists
  checkPatientCodeExists: async (code: string, excludeId?: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return false;
    } catch (error) {
      console.error('Patient code validation error:', error);
      return false;
    }
  },

  // Check if license number already exists
  checkLicenseNumberExists: async (licenseNumber: string, excludeId?: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return false;
    } catch (error) {
      console.error('License number validation error:', error);
      return false;
    }
  },

  // Check if appointment time is available
  checkAppointmentTimeAvailable: async (
    doctorId: string,
    date: string,
    time: string,
    excludeId?: string
  ): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      console.error('Appointment time validation error:', error);
      return false;
    }
  },

  // Check if service is available
  checkServiceAvailable: async (serviceId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return true;
    } catch (error) {
      console.error('Service availability validation error:', error);
      return false;
    }
  },
};

// Yup async validation methods
export const asyncValidationMethods = {
  // Email uniqueness validation
  emailUnique: (excludeId?: string) => 
    yup.string().test(
      'email-unique',
      'Email đã được sử dụng',
      async function(value: any) {
        if (!value) return true;
        const exists = await asyncValidators.checkEmailExists(value, excludeId);
        return !exists;
      }
    ),

  // Phone uniqueness validation
  phoneUnique: (excludeId?: string) =>
    yup.string().test(
      'phone-unique',
      'Số điện thoại đã được sử dụng',
      async function(value: any) {
        if (!value) return true;
        const exists = await asyncValidators.checkPhoneExists(value, excludeId);
        return !exists;
      }
    ),

  // Patient code uniqueness validation
  patientCodeUnique: (excludeId?: string) =>
    yup.string().test(
      'patient-code-unique',
      'Mã bệnh nhân đã được sử dụng',
      async function(value) {
        if (!value) return true;
        const exists = await asyncValidators.checkPatientCodeExists(value, excludeId);
        return !exists;
      }
    ),

  // License number uniqueness validation
  licenseNumberUnique: (excludeId?: string) =>
    yup.string().test(
      'license-number-unique',
      'Số giấy phép đã được sử dụng',
      async function(value) {
        if (!value) return true;
        const exists = await asyncValidators.checkLicenseNumberExists(value, excludeId);
        return !exists;
      }
    ),

  // Appointment time availability validation
  appointmentTimeAvailable: (doctorId: string, date: string, excludeId?: string) =>
    yup.string().test(
      'appointment-time-available',
      'Thời gian này không khả dụng',
      async function(value) {
        if (!value || !doctorId || !date) return true;
        const available = await asyncValidators.checkAppointmentTimeAvailable(
          doctorId,
          date,
          value,
          excludeId
        );
        return available;
      }
    ),

  // Service availability validation
  serviceAvailable: () =>
    yup.string().test(
      'service-available',
      'Dịch vụ không khả dụng',
      async function(value) {
        if (!value) return true;
        const available = await asyncValidators.checkServiceAvailable(value);
        return available;
      }
    ),
};

// Real-time validation hooks
export const useAsyncValidation = () => {
  const [validating, setValidating] = React.useState<Record<string, boolean>>({});
  const [validationResults, setValidationResults] = React.useState<Record<string, boolean>>({});

  const validateField = async (fieldName: string, value: any, validator: (value: any) => Promise<boolean>) => {
    setValidating(prev => ({ ...prev, [fieldName]: true }));
    
    try {
      const isValid = await validator(value);
      setValidationResults(prev => ({ ...prev, [fieldName]: isValid }));
      return isValid;
    } catch (error) {
      console.error(`Validation error for ${fieldName}:`, error);
      setValidationResults(prev => ({ ...prev, [fieldName]: false }));
      return false;
    } finally {
      setValidating(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const isFieldValidating = (fieldName: string) => validating[fieldName] || false;
  const isFieldValid = (fieldName: string) => validationResults[fieldName] || false;

  return {
    validateField,
    isFieldValidating,
    isFieldValid,
    validating,
    validationResults,
  };
};

// Debounced validation
export const useDebouncedValidation = (delay: number = 500) => {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const debouncedValidate = (callback: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(callback, delay);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedValidate;
};

// Cross-field validation
export const useCrossFieldValidation = () => {
  const validateCrossFields = (values: any, rules: Array<{
    fields: string[];
    validator: (values: any) => boolean;
    message: string;
  }>) => {
    const errors: Record<string, string> = {};

    rules.forEach(rule => {
      if (!rule.validator(values)) {
        rule.fields.forEach(field => {
          errors[field] = rule.message;
        });
      }
    });

    return errors;
  };

  return { validateCrossFields };
};

// File validation
export const fileValidators = {
  // Image file validation
  validateImageFile: (file: File, maxSize: number = 5 * 1024 * 1024) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)';
    }
    
    if (file.size > maxSize) {
      return `Kích thước file không được quá ${Math.round(maxSize / 1024 / 1024)}MB`;
    }
    
    return null;
  },

  // Document file validation
  validateDocumentFile: (file: File, maxSize: number = 10 * 1024 * 1024) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Chỉ chấp nhận file tài liệu (PDF, DOC, DOCX, TXT)';
    }
    
    if (file.size > maxSize) {
      return `Kích thước file không được quá ${Math.round(maxSize / 1024 / 1024)}MB`;
    }
    
    return null;
  },

  // Generic file validation
  validateFile: (
    file: File,
    allowedTypes: string[],
    maxSize: number
  ) => {
    if (!allowedTypes.includes(file.type)) {
      return 'Định dạng file không được hỗ trợ';
    }
    
    if (file.size > maxSize) {
      return `Kích thước file không được quá ${Math.round(maxSize / 1024 / 1024)}MB`;
    }
    
    return null;
  },
};

// Date validation
export const dateValidators = {
  // Validate date range
  validateDateRange: (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return end >= start;
  },

  // Validate future date
  validateFutureDate: (date: string) => {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
  },

  // Validate past date
  validatePastDate: (date: string) => {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return inputDate <= today;
  },

  // Validate age range
  validateAgeRange: (dateOfBirth: string, minAge: number = 0, maxAge: number = 120) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= minAge && age <= maxAge;
  },
};

// Business logic validation
export const businessValidators = {
  // Validate appointment time is within business hours
  validateBusinessHours: (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 8 && hour <= 20;
  },

  // Validate appointment is not in the past
  validateAppointmentNotPast: (date: string, time: string) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    return appointmentDateTime > now;
  },

  // Validate working days
  validateWorkingDays: (date: string) => {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 6; // Monday to Saturday
  },
};
