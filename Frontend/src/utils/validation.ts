import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Email không hợp lệ')
  .min(1, 'Email không được để trống');

export const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, 'Số điện thoại phải gồm đúng 10 chữ số')
  .min(1, 'Số điện thoại không được để trống');

export const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số');

export const nameSchema = z
  .string()
  .min(2, 'Tên phải có ít nhất 2 ký tự')
  .max(150, 'Tên không được quá 150 ký tự')
  .regex(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂĐÊÔÔƠƯăâđêôơư\s]+$/, 'Tên chỉ được chứa chữ cái và khoảng trắng');

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

export const registerSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  phone: phoneSchema,
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Giới tính không hợp lệ' }),
  }),
  dateOfBirth: z.string().min(1, 'Ngày sinh không được để trống'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mật khẩu hiện tại không được để trống'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

// Patient validation schemas
export const createPatientSchema = z.object({
  fullName: nameSchema,
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Giới tính không hợp lệ' }),
  }),
  dateOfBirth: z.string().min(1, 'Ngày sinh không được để trống'),
  phone: phoneSchema,
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  address: z.string().max(255, 'Địa chỉ không được quá 255 ký tự').optional(),
  note: z.string().max(500, 'Ghi chú không được quá 500 ký tự').optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

// Appointment validation schemas
export const createAppointmentSchema = z.object({
  patientId: z.number().min(1, 'Bệnh nhân không được để trống'),
  doctorId: z.number().min(1, 'Bác sĩ không được để trống'),
  clinicRoomId: z.number().min(1, 'Phòng khám không được để trống'),
  scheduledAt: z.string().min(1, 'Thời gian khám không được để trống'),
  reason: z.string().max(500, 'Lý do khám không được quá 500 ký tự').optional(),
  notes: z.string().max(500, 'Ghi chú không được quá 500 ký tự').optional(),
  duration: z.number().min(15, 'Thời lượng khám phải ít nhất 15 phút').max(240, 'Thời lượng khám không được quá 240 phút'),
});

export const createAppointmentRequestSchema = z.object({
  patientId: z.number().min(1, 'Bệnh nhân không được để trống'),
  doctorId: z.number().min(1, 'Bác sĩ không được để trống').optional(),
  preferredDate: z.string().min(1, 'Ngày mong muốn không được để trống'),
  preferredTime: z.string().min(1, 'Giờ mong muốn không được để trống'),
  reason: z.string().min(1, 'Lý do khám không được để trống').max(500, 'Lý do khám không được quá 500 ký tự'),
  notes: z.string().max(500, 'Ghi chú không được quá 500 ký tự').optional(),
});

// Doctor validation schemas
export const updateDoctorSchema = z.object({
  specialty: z.string().min(1, 'Chuyên khoa không được để trống').max(120, 'Chuyên khoa không được quá 120 ký tự'),
  licenseNumber: z.string().min(1, 'Số giấy phép không được để trống').max(80, 'Số giấy phép không được quá 80 ký tự'),
  examinationRoom: z.string().max(60, 'Phòng khám không được quá 60 ký tự').optional(),
  biography: z.string().max(255, 'Tiểu sử không được quá 255 ký tự').optional(),
});

// Utility functions
export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

export function validatePhone(phone: string): boolean {
  return phoneSchema.safeParse(phone).success;
}

export function validatePassword(password: string): boolean {
  return passwordSchema.safeParse(password).success;
}

export function validateName(name: string): boolean {
  return nameSchema.safeParse(name).success;
}

// Error message formatter
export function formatValidationError(error: z.ZodError): string {
  return error.errors.map(err => err.message).join(', ');
}

// Visit validation schemas
export const createVisitSchema = z.object({
  patientId: z.string().min(1, 'Bệnh nhân không được để trống'),
  doctorId: z.string().min(1, 'Bác sĩ không được để trống'),
  appointmentId: z.string().optional(),
  preliminaryDx: z.string().min(1, 'Chẩn đoán sơ bộ không được để trống').max(500, 'Chẩn đoán sơ bộ không được quá 500 ký tự'),
  symptoms: z.string().min(1, 'Triệu chứng không được để trống').max(1000, 'Triệu chứng không được quá 1000 ký tự'),
  clinicalNotes: z.string().max(1000, 'Ghi chú lâm sàng không được quá 1000 ký tự').optional(),
});

export const updateVisitSchema = z.object({
  preliminaryDx: z.string().min(1, 'Chẩn đoán sơ bộ không được để trống').max(500, 'Chẩn đoán sơ bộ không được quá 500 ký tự').optional(),
  symptoms: z.string().min(1, 'Triệu chứng không được để trống').max(1000, 'Triệu chứng không được quá 1000 ký tự').optional(),
  clinicalNotes: z.string().max(1000, 'Ghi chú lâm sàng không được quá 1000 ký tự').optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
});

// Service Order validation schemas
export const createServiceOrderSchema = z.object({
  serviceId: z.string().min(1, 'Dịch vụ không được để trống'),
  performerId: z.string().optional(),
  notes: z.string().max(500, 'Ghi chú không được quá 500 ký tự').optional(),
});

export const updateServiceOrderSchema = z.object({
  performerId: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  result: z.string().max(1000, 'Kết quả không được quá 1000 ký tự').optional(),
  notes: z.string().max(500, 'Ghi chú không được quá 500 ký tự').optional(),
});

// Prescription validation schemas
export const createPrescriptionItemSchema = z.object({
  medicationId: z.string().min(1, 'Thuốc không được để trống'),
  dosage: z.string().min(1, 'Liều lượng không được để trống').max(100, 'Liều lượng không được quá 100 ký tự'),
  quantity: z.number().min(1, 'Số lượng phải ít nhất 1'),
  unit: z.string().min(1, 'Đơn vị không được để trống').max(20, 'Đơn vị không được quá 20 ký tự'),
  usageNotes: z.string().max(200, 'Hướng dẫn sử dụng không được quá 200 ký tự').optional(),
});

export const createPrescriptionSchema = z.object({
  medications: z.array(createPrescriptionItemSchema).min(1, 'Phải có ít nhất 1 loại thuốc'),
  notes: z.string().max(500, 'Ghi chú không được quá 500 ký tự').optional(),
});

// Billing validation schemas
export const createBillingSchema = z.object({
  discount: z.number().min(0, 'Giảm giá không được âm').max(100, 'Giảm giá không được quá 100%').optional(),
  discountReason: z.string().max(200, 'Lý do giảm giá không được quá 200 ký tự').optional(),
});

// Form field validation
export function validateField(value: any, schema: z.ZodSchema): string | null {
  const result = schema.safeParse(value);
  return result.success ? null : result.error.errors[0]?.message || 'Giá trị không hợp lệ';
}
