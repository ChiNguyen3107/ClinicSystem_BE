import * as yup from 'yup';

// Common validation patterns
const phoneRegex = /^0[0-9]{9}$/;
// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂĐÊÔÔƠƯăâđêôơư\s]+$/;
const licenseNumberRegex = /^[A-Z0-9]{6,20}$/;

// Base validation schemas
export const baseSchemas = {
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email không được để trống'),

  phone: yup
    .string()
    .matches(phoneRegex, 'Số điện thoại phải gồm đúng 10 chữ số bắt đầu bằng 0')
    .required('Số điện thoại không được để trống'),

  name: yup
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(150, 'Tên không được quá 150 ký tự')
    .matches(nameRegex, 'Tên chỉ được chứa chữ cái và khoảng trắng')
    .required('Tên không được để trống'),

  password: yup
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
    )
    .required('Mật khẩu không được để trống'),

  dateOfBirth: yup
    .string()
    .required('Ngày sinh không được để trống')
    .test('age', 'Tuổi phải từ 0 đến 120', function(value) {
      if (!value) return false;
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 0 && age <= 120;
    }),

  gender: yup
    .string()
    .oneOf(['MALE', 'FEMALE', 'OTHER'], 'Giới tính không hợp lệ')
    .required('Giới tính không được để trống'),

  address: yup
    .string()
    .max(255, 'Địa chỉ không được quá 255 ký tự'),

  note: yup
    .string()
    .max(500, 'Ghi chú không được quá 500 ký tự'),
};

// Auth validation schemas
export const authSchemas = {
  login: yup.object({
    email: baseSchemas.email,
    password: yup.string().required('Mật khẩu không được để trống'),
  }),

  register: yup.object({
    fullName: baseSchemas.name,
    email: baseSchemas.email,
    password: baseSchemas.password,
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
      .required('Xác nhận mật khẩu không được để trống'),
    phone: baseSchemas.phone,
    gender: baseSchemas.gender,
    dateOfBirth: baseSchemas.dateOfBirth,
  }),

  changePassword: yup.object({
    currentPassword: yup.string().required('Mật khẩu hiện tại không được để trống'),
    newPassword: baseSchemas.password,
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
      .required('Xác nhận mật khẩu không được để trống'),
  }),
};

// Patient validation schemas
export const patientSchemas = {
  create: yup.object({
    fullName: baseSchemas.name,
    gender: baseSchemas.gender,
    dateOfBirth: baseSchemas.dateOfBirth,
    phone: baseSchemas.phone,
    email: yup.string().email('Email không hợp lệ').optional(),
    address: baseSchemas.address,
    note: baseSchemas.note,
  }),

  update: yup.object({
    fullName: baseSchemas.name.optional(),
    gender: baseSchemas.gender.optional(),
    dateOfBirth: baseSchemas.dateOfBirth.optional(),
    phone: baseSchemas.phone.optional(),
    email: yup.string().email('Email không hợp lệ').optional(),
    address: baseSchemas.address,
    note: baseSchemas.note,
  }),
};

// Doctor validation schemas
export const doctorSchemas = {
  update: yup.object({
    specialty: yup
      .string()
      .min(1, 'Chuyên khoa không được để trống')
      .max(120, 'Chuyên khoa không được quá 120 ký tự')
      .required('Chuyên khoa không được để trống'),
    licenseNumber: yup
      .string()
      .matches(licenseNumberRegex, 'Số giấy phép không hợp lệ')
      .min(6, 'Số giấy phép phải có ít nhất 6 ký tự')
      .max(20, 'Số giấy phép không được quá 20 ký tự')
      .required('Số giấy phép không được để trống'),
    examinationRoom: yup
      .string()
      .max(60, 'Phòng khám không được quá 60 ký tự'),
    biography: yup
      .string()
      .max(255, 'Tiểu sử không được quá 255 ký tự'),
  }),
};

// Appointment validation schemas
export const appointmentSchemas = {
  create: yup.object({
    patientId: yup
      .number()
      .min(1, 'Bệnh nhân không được để trống')
      .required('Bệnh nhân không được để trống'),
    doctorId: yup
      .number()
      .min(1, 'Bác sĩ không được để trống')
      .required('Bác sĩ không được để trống'),
    clinicRoomId: yup
      .number()
      .min(1, 'Phòng khám không được để trống')
      .required('Phòng khám không được để trống'),
    scheduledAt: yup
      .string()
      .required('Thời gian khám không được để trống'),
    reason: yup
      .string()
      .max(500, 'Lý do khám không được quá 500 ký tự'),
    notes: yup
      .string()
      .max(500, 'Ghi chú không được quá 500 ký tự'),
    duration: yup
      .number()
      .min(15, 'Thời lượng khám phải ít nhất 15 phút')
      .max(240, 'Thời lượng khám không được quá 240 phút')
      .required('Thời lượng khám không được để trống'),
  }),

  request: yup.object({
    patientId: yup
      .number()
      .min(1, 'Bệnh nhân không được để trống')
      .required('Bệnh nhân không được để trống'),
    doctorId: yup
      .number()
      .min(1, 'Bác sĩ không được để trống')
      .optional(),
    preferredDate: yup
      .string()
      .required('Ngày mong muốn không được để trống'),
    preferredTime: yup
      .string()
      .required('Giờ mong muốn không được để trống'),
    reason: yup
      .string()
      .min(1, 'Lý do khám không được để trống')
      .max(500, 'Lý do khám không được quá 500 ký tự')
      .required('Lý do khám không được để trống'),
    notes: yup
      .string()
      .max(500, 'Ghi chú không được quá 500 ký tự'),
  }),
};

// Visit validation schemas
export const visitSchemas = {
  create: yup.object({
    patientId: yup
      .string()
      .min(1, 'Bệnh nhân không được để trống')
      .required('Bệnh nhân không được để trống'),
    doctorId: yup
      .string()
      .min(1, 'Bác sĩ không được để trống')
      .required('Bác sĩ không được để trống'),
    appointmentId: yup.string().optional(),
    preliminaryDx: yup
      .string()
      .min(1, 'Chẩn đoán sơ bộ không được để trống')
      .max(500, 'Chẩn đoán sơ bộ không được quá 500 ký tự')
      .required('Chẩn đoán sơ bộ không được để trống'),
    symptoms: yup
      .string()
      .min(1, 'Triệu chứng không được để trống')
      .max(1000, 'Triệu chứng không được quá 1000 ký tự')
      .required('Triệu chứng không được để trống'),
    clinicalNotes: yup
      .string()
      .max(1000, 'Ghi chú lâm sàng không được quá 1000 ký tự'),
  }),

  update: yup.object({
    preliminaryDx: yup
      .string()
      .min(1, 'Chẩn đoán sơ bộ không được để trống')
      .max(500, 'Chẩn đoán sơ bộ không được quá 500 ký tự')
      .optional(),
    symptoms: yup
      .string()
      .min(1, 'Triệu chứng không được để trống')
      .max(1000, 'Triệu chứng không được quá 1000 ký tự')
      .optional(),
    clinicalNotes: yup
      .string()
      .max(1000, 'Ghi chú lâm sàng không được quá 1000 ký tự'),
    status: yup
      .string()
      .oneOf(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], 'Trạng thái không hợp lệ')
      .optional(),
  }),
};

// Service validation schemas
export const serviceSchemas = {
  create: yup.object({
    name: yup
      .string()
      .min(1, 'Tên dịch vụ không được để trống')
      .max(150, 'Tên dịch vụ không được quá 150 ký tự')
      .required('Tên dịch vụ không được để trống'),
    description: yup
      .string()
      .max(500, 'Mô tả không được quá 500 ký tự'),
    price: yup
      .number()
      .min(0, 'Giá dịch vụ không được âm')
      .required('Giá dịch vụ không được để trống'),
    category: yup
      .string()
      .min(1, 'Danh mục không được để trống')
      .max(100, 'Danh mục không được quá 100 ký tự')
      .required('Danh mục không được để trống'),
    isActive: yup.boolean().default(true),
  }),

  update: yup.object({
    name: yup
      .string()
      .min(1, 'Tên dịch vụ không được để trống')
      .max(150, 'Tên dịch vụ không được quá 150 ký tự')
      .optional(),
    description: yup
      .string()
      .max(500, 'Mô tả không được quá 500 ký tự')
      .optional(),
    price: yup
      .number()
      .min(0, 'Giá dịch vụ không được âm')
      .optional(),
    category: yup
      .string()
      .min(1, 'Danh mục không được để trống')
      .max(100, 'Danh mục không được quá 100 ký tự')
      .optional(),
    isActive: yup.boolean().optional(),
  }),
};

// Prescription validation schemas
const prescriptionItemSchema = yup.object({
  medicationId: yup
    .string()
    .min(1, 'Thuốc không được để trống')
    .required('Thuốc không được để trống'),
  dosage: yup
    .string()
    .min(1, 'Liều lượng không được để trống')
    .max(100, 'Liều lượng không được quá 100 ký tự')
    .required('Liều lượng không được để trống'),
  quantity: yup
    .number()
    .min(1, 'Số lượng phải ít nhất 1')
    .required('Số lượng không được để trống'),
  unit: yup
    .string()
    .min(1, 'Đơn vị không được để trống')
    .max(20, 'Đơn vị không được quá 20 ký tự')
    .required('Đơn vị không được để trống'),
  usageNotes: yup
    .string()
    .max(200, 'Hướng dẫn sử dụng không được quá 200 ký tự'),
});

export const prescriptionSchemas = {
  item: prescriptionItemSchema,

  create: yup.object({
    medications: yup
      .array()
      .of(prescriptionItemSchema)
      .min(1, 'Phải có ít nhất 1 loại thuốc')
      .required('Danh sách thuốc không được để trống'),
    notes: yup
      .string()
      .max(500, 'Ghi chú không được quá 500 ký tự'),
  }),
};

// Billing validation schemas
export const billingSchemas = {
  create: yup.object({
    discount: yup
      .number()
      .min(0, 'Giảm giá không được âm')
      .max(100, 'Giảm giá không được quá 100%')
      .optional(),
    discountReason: yup
      .string()
      .max(200, 'Lý do giảm giá không được quá 200 ký tự')
      .optional(),
  }),
};

// Public booking validation schemas
export const publicSchemas = {
  booking: yup.object({
    patientName: yup
      .string()
      .min(2, 'Tên phải có ít nhất 2 ký tự')
      .max(150, 'Tên không được quá 150 ký tự')
      .matches(nameRegex, 'Tên chỉ được chứa chữ cái và khoảng trắng')
      .required('Tên không được để trống'),
    patientPhone: yup
      .string()
      .matches(phoneRegex, 'Số điện thoại phải gồm đúng 10 chữ số bắt đầu bằng 0')
      .required('Số điện thoại không được để trống'),
    patientEmail: yup
      .string()
      .email('Email không hợp lệ')
      .required('Email không được để trống'),
    patientDob: yup.string().optional(),
    doctorId: yup
      .string()
      .min(1, 'Vui lòng chọn bác sĩ')
      .required('Vui lòng chọn bác sĩ'),
    serviceId: yup.string().optional(),
    appointmentDate: yup
      .string()
      .min(1, 'Vui lòng chọn ngày khám')
      .required('Vui lòng chọn ngày khám'),
    appointmentTime: yup
      .string()
      .min(1, 'Vui lòng chọn giờ khám')
      .required('Vui lòng chọn giờ khám'),
    symptoms: yup
      .string()
      .max(1000, 'Triệu chứng không được quá 1000 ký tự'),
    paymentMethod: yup
      .string()
      .oneOf(['CASH', 'VNPAY', 'MOMO'], 'Phương thức thanh toán không hợp lệ')
      .optional(),
    notes: yup
      .string()
      .max(500, 'Ghi chú không được quá 500 ký tự'),
  }),
};

// Service indicator validation schemas
export const serviceIndicatorSchemas = {
  create: yup.object({
    code: yup
      .string()
      .min(1, 'Mã chỉ số không được để trống')
      .max(60, 'Mã chỉ số tối đa 60 ký tự')
      .required('Mã chỉ số không được để trống'),
    name: yup
      .string()
      .min(1, 'Tên chỉ số không được để trống')
      .max(150, 'Tên chỉ số tối đa 150 ký tự')
      .required('Tên chỉ số không được để trống'),
    unit: yup
      .string()
      .max(30, 'Đơn vị tối đa 30 ký tự'),
    normalMin: yup
      .number()
      .test('decimal', 'Giá trị chuẩn không hợp lệ', (value) => {
        if (value === undefined || value === null) return true;
        return Number.isFinite(value) && value >= 0;
      }),
    normalMax: yup
      .number()
      .test('decimal', 'Giá trị chuẩn không hợp lệ', (value) => {
        if (value === undefined || value === null) return true;
        return Number.isFinite(value) && value >= 0;
      }),
    criticalMin: yup
      .number()
      .test('decimal', 'Giá trị cảnh báo không hợp lệ', (value) => {
        if (value === undefined || value === null) return true;
        return Number.isFinite(value) && value >= 0;
      }),
    criticalMax: yup
      .number()
      .test('decimal', 'Giá trị cảnh báo không hợp lệ', (value) => {
        if (value === undefined || value === null) return true;
        return Number.isFinite(value) && value >= 0;
      }),
    referenceNote: yup
      .string()
      .max(500, 'Ghi chú tối đa 500 ký tự'),
    required: yup.boolean().default(true),
  }),
};

// Custom validation functions
export const customValidators = {
  // Async validation for checking if email exists
  checkEmailExists: async (_email: string, _excludeId?: string) => {
    // This would be implemented with actual API call
    // For now, return a promise that resolves
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Mock validation - in real app, call API
        resolve(true);
      }, 1000);
    });
  },

  // Async validation for checking if phone exists
  checkPhoneExists: async (_phone: string, _excludeId?: string) => {
    // This would be implemented with actual API call
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Mock validation - in real app, call API
        resolve(true);
      }, 1000);
    });
  },

  // Date validation
  validateDateRange: (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return end >= start;
  },

  // File validation
  validateFile: (file: File, maxSize: number = 5 * 1024 * 1024, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif']) => {
    if (file.size > maxSize) {
      return 'Kích thước file không được quá 5MB';
    }
    if (!allowedTypes.includes(file.type)) {
      return 'Định dạng file không được hỗ trợ';
    }
    return null;
  },
};

// Error message formatter
export const formatValidationError = (error: yup.ValidationError): string => {
  return error.message || 'Giá trị không hợp lệ';
};

// Validation helper functions
export const validationHelpers = {
  // Get field error
  getFieldError: (errors: any, fieldName: string): string | undefined => {
    return errors[fieldName]?.message;
  },

  // Check if field has error
  hasFieldError: (errors: any, fieldName: string): boolean => {
    return !!errors[fieldName];
  },

  // Get all form errors
  getAllErrors: (errors: any): string[] => {
    return Object.values(errors).map((error: any) => error.message).filter(Boolean);
  },
};
