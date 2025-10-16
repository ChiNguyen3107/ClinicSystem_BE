// Vietnamese error messages for form validation
export const errorMessages = {
  // Common validation messages
  common: {
    required: 'Trường này không được để trống',
    invalid: 'Giá trị không hợp lệ',
    tooShort: 'Quá ngắn',
    tooLong: 'Quá dài',
    notFound: 'Không tìm thấy',
    alreadyExists: 'Đã tồn tại',
    notAvailable: 'Không khả dụng',
    expired: 'Đã hết hạn',
    invalidFormat: 'Định dạng không đúng',
    notMatch: 'Không khớp',
    tooSmall: 'Quá nhỏ',
    tooLarge: 'Quá lớn',
    notInRange: 'Ngoài phạm vi cho phép',
  },

  // Field-specific messages
  fields: {
    // Personal information
    fullName: {
      required: 'Họ tên không được để trống',
      minLength: 'Họ tên phải có ít nhất 2 ký tự',
      maxLength: 'Họ tên không được quá 150 ký tự',
      invalid: 'Họ tên chỉ được chứa chữ cái và khoảng trắng',
    },
    email: {
      required: 'Email không được để trống',
      invalid: 'Email không hợp lệ',
      alreadyExists: 'Email đã được sử dụng',
    },
    phone: {
      required: 'Số điện thoại không được để trống',
      invalid: 'Số điện thoại phải gồm đúng 10 chữ số bắt đầu bằng 0',
      alreadyExists: 'Số điện thoại đã được sử dụng',
    },
    password: {
      required: 'Mật khẩu không được để trống',
      minLength: 'Mật khẩu phải có ít nhất 8 ký tự',
      invalid: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
    },
    confirmPassword: {
      required: 'Xác nhận mật khẩu không được để trống',
      notMatch: 'Mật khẩu xác nhận không khớp',
    },
    dateOfBirth: {
      required: 'Ngày sinh không được để trống',
      invalid: 'Ngày sinh không hợp lệ',
      tooYoung: 'Tuổi phải từ 0 đến 120',
      tooOld: 'Tuổi phải từ 0 đến 120',
    },
    gender: {
      required: 'Giới tính không được để trống',
      invalid: 'Giới tính không hợp lệ',
    },
    address: {
      maxLength: 'Địa chỉ không được quá 255 ký tự',
    },
    note: {
      maxLength: 'Ghi chú không được quá 500 ký tự',
    },

    // Medical information
    specialty: {
      required: 'Chuyên khoa không được để trống',
      minLength: 'Chuyên khoa phải có ít nhất 1 ký tự',
      maxLength: 'Chuyên khoa không được quá 120 ký tự',
    },
    licenseNumber: {
      required: 'Số giấy phép không được để trống',
      invalid: 'Số giấy phép không hợp lệ',
      alreadyExists: 'Số giấy phép đã được sử dụng',
      minLength: 'Số giấy phép phải có ít nhất 6 ký tự',
      maxLength: 'Số giấy phép không được quá 20 ký tự',
    },
    examinationRoom: {
      maxLength: 'Phòng khám không được quá 60 ký tự',
    },
    biography: {
      maxLength: 'Tiểu sử không được quá 255 ký tự',
    },

    // Appointment information
    patientId: {
      required: 'Bệnh nhân không được để trống',
      notFound: 'Bệnh nhân không tồn tại',
    },
    doctorId: {
      required: 'Bác sĩ không được để trống',
      notFound: 'Bác sĩ không tồn tại',
    },
    clinicRoomId: {
      required: 'Phòng khám không được để trống',
      notFound: 'Phòng khám không tồn tại',
    },
    scheduledAt: {
      required: 'Thời gian khám không được để trống',
      invalid: 'Thời gian khám không hợp lệ',
      past: 'Thời gian khám không được trong quá khứ',
    },
    reason: {
      maxLength: 'Lý do khám không được quá 500 ký tự',
    },
    notes: {
      maxLength: 'Ghi chú không được quá 500 ký tự',
    },
    duration: {
      required: 'Thời lượng khám không được để trống',
      min: 'Thời lượng khám phải ít nhất 15 phút',
      max: 'Thời lượng khám không được quá 240 phút',
    },

    // Visit information
    preliminaryDx: {
      required: 'Chẩn đoán sơ bộ không được để trống',
      minLength: 'Chẩn đoán sơ bộ phải có ít nhất 1 ký tự',
      maxLength: 'Chẩn đoán sơ bộ không được quá 500 ký tự',
    },
    symptoms: {
      required: 'Triệu chứng không được để trống',
      minLength: 'Triệu chứng phải có ít nhất 1 ký tự',
      maxLength: 'Triệu chứng không được quá 1000 ký tự',
    },
    clinicalNotes: {
      maxLength: 'Ghi chú lâm sàng không được quá 1000 ký tự',
    },
    status: {
      invalid: 'Trạng thái không hợp lệ',
    },

    // Service information
    serviceName: {
      required: 'Tên dịch vụ không được để trống',
      minLength: 'Tên dịch vụ phải có ít nhất 1 ký tự',
      maxLength: 'Tên dịch vụ không được quá 150 ký tự',
    },
    description: {
      maxLength: 'Mô tả không được quá 500 ký tự',
    },
    price: {
      required: 'Giá dịch vụ không được để trống',
      min: 'Giá dịch vụ không được âm',
      invalid: 'Giá dịch vụ không hợp lệ',
    },
    category: {
      required: 'Danh mục không được để trống',
      minLength: 'Danh mục phải có ít nhất 1 ký tự',
      maxLength: 'Danh mục không được quá 100 ký tự',
    },

    // Prescription information
    medicationId: {
      required: 'Thuốc không được để trống',
      notFound: 'Thuốc không tồn tại',
    },
    dosage: {
      required: 'Liều lượng không được để trống',
      minLength: 'Liều lượng phải có ít nhất 1 ký tự',
      maxLength: 'Liều lượng không được quá 100 ký tự',
    },
    quantity: {
      required: 'Số lượng không được để trống',
      min: 'Số lượng phải ít nhất 1',
      invalid: 'Số lượng không hợp lệ',
    },
    unit: {
      required: 'Đơn vị không được để trống',
      minLength: 'Đơn vị phải có ít nhất 1 ký tự',
      maxLength: 'Đơn vị không được quá 20 ký tự',
    },
    usageNotes: {
      maxLength: 'Hướng dẫn sử dụng không được quá 200 ký tự',
    },

    // Billing information
    discount: {
      min: 'Giảm giá không được âm',
      max: 'Giảm giá không được quá 100%',
      invalid: 'Giảm giá không hợp lệ',
    },
    discountReason: {
      maxLength: 'Lý do giảm giá không được quá 200 ký tự',
    },

    // Public booking information
    patientName: {
      required: 'Tên không được để trống',
      minLength: 'Tên phải có ít nhất 2 ký tự',
      maxLength: 'Tên không được quá 150 ký tự',
      invalid: 'Tên chỉ được chứa chữ cái và khoảng trắng',
    },
    patientPhone: {
      required: 'Số điện thoại không được để trống',
      invalid: 'Số điện thoại phải gồm đúng 10 chữ số bắt đầu bằng 0',
    },
    patientEmail: {
      required: 'Email không được để trống',
      invalid: 'Email không hợp lệ',
    },
    patientDob: {
      invalid: 'Ngày sinh không hợp lệ',
    },
    appointmentDate: {
      required: 'Vui lòng chọn ngày khám',
      invalid: 'Ngày khám không hợp lệ',
      past: 'Ngày khám không được trong quá khứ',
    },
    appointmentTime: {
      required: 'Vui lòng chọn giờ khám',
      invalid: 'Giờ khám không hợp lệ',
      notAvailable: 'Thời gian này không khả dụng',
    },
    symptoms: {
      maxLength: 'Triệu chứng không được quá 1000 ký tự',
    },
    paymentMethod: {
      invalid: 'Phương thức thanh toán không hợp lệ',
    },
    notes: {
      maxLength: 'Ghi chú không được quá 500 ký tự',
    },

    // Service indicator information
    indicatorCode: {
      required: 'Mã chỉ số không được để trống',
      minLength: 'Mã chỉ số phải có ít nhất 1 ký tự',
      maxLength: 'Mã chỉ số tối đa 60 ký tự',
    },
    indicatorName: {
      required: 'Tên chỉ số không được để trống',
      minLength: 'Tên chỉ số phải có ít nhất 1 ký tự',
      maxLength: 'Tên chỉ số tối đa 150 ký tự',
    },
    indicatorUnit: {
      maxLength: 'Đơn vị tối đa 30 ký tự',
    },
    normalMin: {
      invalid: 'Giá trị chuẩn không hợp lệ',
    },
    normalMax: {
      invalid: 'Giá trị chuẩn không hợp lệ',
    },
    criticalMin: {
      invalid: 'Giá trị cảnh báo không hợp lệ',
    },
    criticalMax: {
      invalid: 'Giá trị cảnh báo không hợp lệ',
    },
    referenceNote: {
      maxLength: 'Ghi chú tối đa 500 ký tự',
    },
  },

  // Network and server errors
  network: {
    connection: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
    timeout: 'Yêu cầu hết thời gian chờ. Vui lòng thử lại.',
    server: 'Lỗi máy chủ. Vui lòng thử lại sau.',
    notFound: 'Không tìm thấy tài nguyên.',
    forbidden: 'Bạn không có quyền thực hiện hành động này.',
    unauthorized: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    badRequest: 'Yêu cầu không hợp lệ.',
    conflict: 'Dữ liệu đã tồn tại.',
    tooManyRequests: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
    internalError: 'Lỗi hệ thống. Vui lòng liên hệ quản trị viên.',
  },

  // Business logic errors
  business: {
    appointmentConflict: 'Thời gian này đã có lịch hẹn khác.',
    doctorNotAvailable: 'Bác sĩ không khả dụng trong thời gian này.',
    serviceNotAvailable: 'Dịch vụ không khả dụng.',
    patientNotFound: 'Không tìm thấy thông tin bệnh nhân.',
    doctorNotFound: 'Không tìm thấy thông tin bác sĩ.',
    appointmentNotFound: 'Không tìm thấy lịch hẹn.',
    visitNotFound: 'Không tìm thấy phiên khám.',
    prescriptionNotFound: 'Không tìm thấy đơn thuốc.',
    billingNotFound: 'Không tìm thấy hóa đơn.',
    medicationNotFound: 'Không tìm thấy thuốc.',
    serviceNotFound: 'Không tìm thấy dịch vụ.',
    roomNotAvailable: 'Phòng khám không khả dụng.',
    scheduleConflict: 'Lịch trình bị trùng lặp.',
    capacityExceeded: 'Đã vượt quá sức chứa.',
    invalidTimeSlot: 'Khung giờ không hợp lệ.',
    pastAppointment: 'Không thể đặt lịch trong quá khứ.',
    weekendAppointment: 'Không thể đặt lịch vào cuối tuần.',
    holidayAppointment: 'Không thể đặt lịch vào ngày lễ.',
  },

  // File upload errors
  file: {
    tooLarge: 'Kích thước file quá lớn.',
    invalidType: 'Định dạng file không được hỗ trợ.',
    uploadFailed: 'Tải file lên thất bại.',
    processingFailed: 'Xử lý file thất bại.',
    corrupted: 'File bị hỏng.',
    virusDetected: 'File có thể chứa virus.',
    quotaExceeded: 'Đã vượt quá dung lượng cho phép.',
  },

  // Form submission errors
  form: {
    invalidData: 'Dữ liệu không hợp lệ.',
    missingFields: 'Thiếu thông tin bắt buộc.',
    validationFailed: 'Xác thực dữ liệu thất bại.',
    submitFailed: 'Gửi form thất bại.',
    saveFailed: 'Lưu dữ liệu thất bại.',
    updateFailed: 'Cập nhật dữ liệu thất bại.',
    deleteFailed: 'Xóa dữ liệu thất bại.',
  },
};

// Helper function to get error message
export const getErrorMessage = (
  field: string,
  errorType: string,
  customMessage?: string
): string => {
  if (customMessage) return customMessage;

  const fieldMessages = errorMessages.fields[field as keyof typeof errorMessages.fields];
  if (fieldMessages && fieldMessages[errorType as keyof typeof fieldMessages]) {
    return fieldMessages[errorType as keyof typeof fieldMessages] as string;
  }

  const commonMessages = errorMessages.common[errorType as keyof typeof errorMessages.common];
  if (commonMessages) return commonMessages;

  return errorMessages.common.invalid;
};

// Helper function to get network error message
export const getNetworkErrorMessage = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return errorMessages.network.badRequest;
    case 401:
      return errorMessages.network.unauthorized;
    case 403:
      return errorMessages.network.forbidden;
    case 404:
      return errorMessages.network.notFound;
    case 409:
      return errorMessages.network.conflict;
    case 429:
      return errorMessages.network.tooManyRequests;
    case 500:
      return errorMessages.network.server;
    case 502:
    case 503:
    case 504:
      return errorMessages.network.server;
    default:
      return errorMessages.network.internalError;
  }
};

// Helper function to get business error message
export const getBusinessErrorMessage = (errorCode: string): string => {
  const businessMessages = errorMessages.business[errorCode as keyof typeof errorMessages.business];
  return businessMessages || 'Lỗi hệ thống. Vui lòng liên hệ quản trị viên.';
};

// Helper function to get file error message
export const getFileErrorMessage = (errorType: string): string => {
  const fileMessages = errorMessages.file[errorType as keyof typeof errorMessages.file];
  return fileMessages || errorMessages.file.uploadFailed;
};

// Helper function to get form error message
export const getFormErrorMessage = (errorType: string): string => {
  const formMessages = errorMessages.form[errorType as keyof typeof errorMessages.form];
  return formMessages || errorMessages.form.submitFailed;
};
