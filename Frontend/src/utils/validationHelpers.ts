import { FieldErrors } from 'react-hook-form';
import * as yup from 'yup';

// Error types
export interface ValidationError {
  field: string;
  message: string;
  rejectedValue?: any;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

// Error handling utilities
export class ValidationErrorHandler {
  // Convert API errors to form errors
  static convertApiErrorsToFormErrors(apiError: ApiError): Record<string, string> {
    const formErrors: Record<string, string> = {};
    
    if (typeof apiError.message === 'string') {
      formErrors.root = apiError.message;
    } else if (Array.isArray(apiError.message)) {
      apiError.message.forEach((msg, index) => {
        formErrors[`field_${index}`] = msg;
      });
    }
    
    return formErrors;
  }

  // Extract field-specific errors from API response
  static extractFieldErrors(apiError: ApiError): Record<string, string> {
    const fieldErrors: Record<string, string> = {};
    
    // Common field mapping
    const fieldMapping: Record<string, string> = {
      'fullName': 'fullName',
      'email': 'email',
      'phone': 'phone',
      'dateOfBirth': 'dateOfBirth',
      'gender': 'gender',
      'password': 'password',
      'confirmPassword': 'confirmPassword',
    };

    if (typeof apiError.message === 'string') {
      // Try to extract field name from error message
      const fieldMatch = apiError.message.match(/(\w+)\s+không được để trống/);
      if (fieldMatch) {
        const fieldName = fieldMapping[fieldMatch[1]] || fieldMatch[1];
        fieldErrors[fieldName] = apiError.message;
      } else {
        fieldErrors.root = apiError.message;
      }
    } else if (Array.isArray(apiError.message)) {
      apiError.message.forEach((msg) => {
        const fieldMatch = msg.match(/(\w+)\s+không được để trống/);
        if (fieldMatch) {
          const fieldName = fieldMapping[fieldMatch[1]] || fieldMatch[1];
          fieldErrors[fieldName] = msg;
        } else {
          fieldErrors.root = msg;
        }
      });
    }
    
    return fieldErrors;
  }

  // Format validation errors for display
  static formatErrors(errors: FieldErrors): string[] {
    const errorMessages: string[] = [];
    
    Object.keys(errors).forEach((field) => {
      const error = errors[field];
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessages.push(String(error.message));
      }
    });
    
    return errorMessages;
  }

  // Get first error message
  static getFirstError(errors: FieldErrors): string | null {
    const errorMessages = this.formatErrors(errors);
    return errorMessages.length > 0 ? errorMessages[0] : null;
  }

  // Check if form has errors
  static hasErrors(errors: FieldErrors): boolean {
    return Object.keys(errors).length > 0;
  }

  // Get field error
  static getFieldError(errors: FieldErrors, fieldName: string): string | null {
    const error = errors[fieldName];
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return null;
  }

  // Check if field has error
  static hasFieldError(errors: FieldErrors, fieldName: string): boolean {
    return !!errors[fieldName];
  }
}

// Real-time validation utilities
export class RealTimeValidation {
  // Debounced validation
  static debounceValidation<T>(
    validationFn: (value: T) => Promise<boolean>,
    delay: number = 500
  ) {
    let timeoutId: NodeJS.Timeout;
    
    return (value: T): Promise<boolean> => {
      return new Promise((resolve) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            const isValid = await validationFn(value);
            resolve(isValid);
          } catch (error) {
            resolve(false);
          }
        }, delay);
      });
    };
  }

  // Async field validation
  static async validateField<T>(
    value: T,
    schema: yup.Schema<T>,
    fieldName: string
  ): Promise<string | null> {
    try {
      await schema.validate(value, { abortEarly: false });
      return null;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return error.message;
      }
      return 'Giá trị không hợp lệ';
    }
  }

  // Cross-field validation
  static validateCrossFields<T>(
    values: T,
    validationRules: Array<{
      fields: string[];
      validator: (values: T) => boolean;
      message: string;
    }>
  ): Record<string, string> {
    const errors: Record<string, string> = {};
    
    validationRules.forEach((rule) => {
      if (!rule.validator(values)) {
        rule.fields.forEach((field) => {
          errors[field] = rule.message;
        });
      }
    });
    
    return errors;
  }
}

// Form state utilities
export class FormStateManager {
  // Check if form is dirty
  static isDirty<T>(originalValues: T, currentValues: T): boolean {
    return JSON.stringify(originalValues) !== JSON.stringify(currentValues);
  }

  // Get changed fields
  static getChangedFields<T extends Record<string, any>>(originalValues: T, currentValues: T): string[] {
    const changedFields: string[] = [];
    
    Object.keys(currentValues).forEach((key) => {
      if (originalValues[key as keyof T] !== currentValues[key as keyof T]) {
        changedFields.push(key);
      }
    });
    
    return changedFields;
  }

  // Reset form to original values
  static resetToOriginal<T extends Record<string, any>>(
    setValue: (name: keyof T, value: any) => void,
    originalValues: T
  ) {
    Object.keys(originalValues).forEach((key) => {
      setValue(key as keyof T, originalValues[key as keyof T]);
    });
  }
}

// Network error handling
export class NetworkErrorHandler {
  // Handle network errors
  static handleNetworkError(error: any): string {
    if (error.code === 'NETWORK_ERROR') {
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.';
    }
    
    if (error.code === 'TIMEOUT') {
      return 'Yêu cầu hết thời gian chờ. Vui lòng thử lại.';
    }
    
    if (error.response?.status === 500) {
      return 'Lỗi máy chủ. Vui lòng thử lại sau.';
    }
    
    if (error.response?.status === 404) {
      return 'Không tìm thấy tài nguyên.';
    }
    
    if (error.response?.status === 403) {
      return 'Bạn không có quyền thực hiện hành động này.';
    }
    
    if (error.response?.status === 401) {
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    }
    
    return 'Có lỗi xảy ra. Vui lòng thử lại.';
  }

  // Check if error is network related
  static isNetworkError(error: any): boolean {
    return (
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT' ||
      !error.response
    );
  }

  // Check if error is server related
  static isServerError(error: any): boolean {
    return error.response?.status >= 500;
  }

  // Check if error is client related
  static isClientError(error: any): boolean {
    return error.response?.status >= 400 && error.response?.status < 500;
  }
}

// Validation message utilities
export class ValidationMessages {
  // Get field label in Vietnamese
  static getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      fullName: 'Họ và tên',
      name: 'Tên',
      email: 'Email',
      phone: 'Số điện thoại',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      dateOfBirth: 'Ngày sinh',
      gender: 'Giới tính',
      address: 'Địa chỉ',
      note: 'Ghi chú',
      specialty: 'Chuyên khoa',
      licenseNumber: 'Số giấy phép',
      examinationRoom: 'Phòng khám',
      biography: 'Tiểu sử',
      patientId: 'Bệnh nhân',
      doctorId: 'Bác sĩ',
      clinicRoomId: 'Phòng khám',
      scheduledAt: 'Thời gian khám',
      reason: 'Lý do khám',
      notes: 'Ghi chú',
      duration: 'Thời lượng khám',
      preliminaryDx: 'Chẩn đoán sơ bộ',
      symptoms: 'Triệu chứng',
      clinicalNotes: 'Ghi chú lâm sàng',
      status: 'Trạng thái',
      serviceId: 'Dịch vụ',
      performerId: 'Người thực hiện',
      result: 'Kết quả',
      medicationId: 'Thuốc',
      dosage: 'Liều lượng',
      quantity: 'Số lượng',
      unit: 'Đơn vị',
      usageNotes: 'Hướng dẫn sử dụng',
      discount: 'Giảm giá',
      discountReason: 'Lý do giảm giá',
      patientName: 'Tên bệnh nhân',
      patientPhone: 'Số điện thoại',
      patientEmail: 'Email',
      patientDob: 'Ngày sinh',
      appointmentDate: 'Ngày khám',
      appointmentTime: 'Giờ khám',
      paymentMethod: 'Phương thức thanh toán',
    };
    
    return labels[fieldName] || fieldName;
  }

  // Get validation message
  static getValidationMessage(
    fieldName: string,
    errorType: string,
    value?: any
  ): string {
    const fieldLabel = this.getFieldLabel(fieldName);
    
    const messages: Record<string, string> = {
      required: `${fieldLabel} không được để trống`,
      email: `${fieldLabel} không hợp lệ`,
      min: `${fieldLabel} phải có ít nhất ${value} ký tự`,
      max: `${fieldLabel} không được quá ${value} ký tự`,
      pattern: `${fieldLabel} không đúng định dạng`,
      oneOf: `${fieldLabel} không hợp lệ`,
      minValue: `${fieldLabel} phải ít nhất ${value}`,
      maxValue: `${fieldLabel} không được quá ${value}`,
    };
    
    return messages[errorType] || `${fieldLabel} không hợp lệ`;
  }
}

// Form validation hooks
export const useFormValidation = () => {
  // Get field error message
  const getFieldError = (errors: FieldErrors, fieldName: string): string | null => {
    return ValidationErrorHandler.getFieldError(errors, fieldName);
  };

  // Check if field has error
  const hasFieldError = (errors: FieldErrors, fieldName: string): boolean => {
    return ValidationErrorHandler.hasFieldError(errors, fieldName);
  };

  // Get all form errors
  const getAllErrors = (errors: FieldErrors): string[] => {
    return ValidationErrorHandler.formatErrors(errors);
  };

  // Get first error
  const getFirstError = (errors: FieldErrors): string | null => {
    return ValidationErrorHandler.getFirstError(errors);
  };

  // Check if form has errors
  const hasErrors = (errors: FieldErrors): boolean => {
    return ValidationErrorHandler.hasErrors(errors);
  };

  return {
    getFieldError,
    hasFieldError,
    getAllErrors,
    getFirstError,
    hasErrors,
  };
};
