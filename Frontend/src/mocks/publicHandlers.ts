import { http, HttpResponse } from 'msw';
import { 
  PublicDoctor, 
  PublicService, 
  BookingRequest, 
  Rating, 
  RatingStats,
  ClinicInfo,
  CreateBookingRequest,
  CreateRatingRequest,
  PaymentRequest,
  PaymentResponse
} from '@/types/public';

// Mock data
const mockClinicInfo: ClinicInfo = {
  name: 'Phòng khám ABC',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  phone: '0123 456 789',
  email: 'info@phongkham.com',
  website: 'https://phongkham.com',
  description: 'Phòng khám chuyên khoa với đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại',
  services: ['Khám tổng quát', 'Khám chuyên khoa', 'Xét nghiệm', 'Chẩn đoán hình ảnh'],
  specialties: ['Tim mạch', 'Nội tiết', 'Thần kinh', 'Tiêu hóa', 'Da liễu'],
  workingHours: [
    { dayOfWeek: 1, startTime: '08:00', endTime: '20:00', isOpen: true },
    { dayOfWeek: 2, startTime: '08:00', endTime: '20:00', isOpen: true },
    { dayOfWeek: 3, startTime: '08:00', endTime: '20:00', isOpen: true },
    { dayOfWeek: 4, startTime: '08:00', endTime: '20:00', isOpen: true },
    { dayOfWeek: 5, startTime: '08:00', endTime: '20:00', isOpen: true },
    { dayOfWeek: 6, startTime: '08:00', endTime: '17:00', isOpen: true },
    { dayOfWeek: 0, startTime: '08:00', endTime: '12:00', isOpen: true }
  ],
  socialMedia: {
    facebook: 'https://facebook.com/phongkham',
    instagram: 'https://instagram.com/phongkham',
    youtube: 'https://youtube.com/phongkham'
  }
};

const mockDoctors: PublicDoctor[] = [
  {
    id: '1',
    fullName: 'BS. Nguyễn Văn An',
    specialty: 'Tim mạch',
    bio: 'Bác sĩ chuyên khoa tim mạch với hơn 15 năm kinh nghiệm. Chuyên điều trị các bệnh lý về tim mạch, tăng huyết áp, rối loạn nhịp tim.',
    avatar: '',
    rating: 4.8,
    totalReviews: 156,
    experience: 15,
    education: 'Tiến sĩ Y khoa - Đại học Y Hà Nội',
    certifications: ['Chứng chỉ Tim mạch học', 'Chứng chỉ Siêu âm tim'],
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    consultationFee: 500000,
    isAvailable: true,
    schedule: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '08:00', endTime: '17:00', isAvailable: true }
    ]
  },
  {
    id: '2',
    fullName: 'BS. Trần Thị Bình',
    specialty: 'Nội tiết',
    bio: 'Bác sĩ chuyên khoa nội tiết với 12 năm kinh nghiệm. Chuyên điều trị đái tháo đường, rối loạn chuyển hóa, bệnh tuyến giáp.',
    avatar: '',
    rating: 4.6,
    totalReviews: 98,
    experience: 12,
    education: 'Thạc sĩ Y khoa - Đại học Y TP.HCM',
    certifications: ['Chứng chỉ Nội tiết học', 'Chứng chỉ Đái tháo đường'],
    languages: ['Tiếng Việt', 'Tiếng Pháp'],
    consultationFee: 450000,
    isAvailable: true,
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '08:00', endTime: '16:00', isAvailable: true }
    ]
  },
  {
    id: '3',
    fullName: 'BS. Lê Văn Cường',
    specialty: 'Thần kinh',
    bio: 'Bác sĩ chuyên khoa thần kinh với 18 năm kinh nghiệm. Chuyên điều trị đau đầu, động kinh, đột quỵ, bệnh Parkinson.',
    avatar: '',
    rating: 4.9,
    totalReviews: 203,
    experience: 18,
    education: 'Tiến sĩ Y khoa - Đại học Y Hà Nội',
    certifications: ['Chứng chỉ Thần kinh học', 'Chứng chỉ Điện não đồ'],
    languages: ['Tiếng Việt', 'Tiếng Anh', 'Tiếng Nhật'],
    consultationFee: 600000,
    isAvailable: true,
    schedule: [
      { dayOfWeek: 2, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '08:00', endTime: '16:00', isAvailable: true }
    ]
  },
  {
    id: '4',
    fullName: 'BS. Phạm Thị Dung',
    specialty: 'Tiêu hóa',
    bio: 'Bác sĩ chuyên khoa tiêu hóa với 10 năm kinh nghiệm. Chuyên nội soi tiêu hóa, điều trị viêm loét dạ dày, hội chứng ruột kích thích.',
    avatar: '',
    rating: 4.7,
    totalReviews: 134,
    experience: 10,
    education: 'Thạc sĩ Y khoa - Đại học Y TP.HCM',
    certifications: ['Chứng chỉ Tiêu hóa học', 'Chứng chỉ Nội soi'],
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    consultationFee: 400000,
    isAvailable: true,
    schedule: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '08:00', endTime: '17:00', isAvailable: true }
    ]
  },
  {
    id: '5',
    fullName: 'BS. Hoàng Văn Em',
    specialty: 'Da liễu',
    bio: 'Bác sĩ chuyên khoa da liễu với 8 năm kinh nghiệm. Chuyên điều trị mụn trứng cá, viêm da, nấm da, ung thư da.',
    avatar: '',
    rating: 4.5,
    totalReviews: 87,
    experience: 8,
    education: 'Thạc sĩ Y khoa - Đại học Y Hà Nội',
    certifications: ['Chứng chỉ Da liễu học', 'Chứng chỉ Laser da'],
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    consultationFee: 350000,
    isAvailable: true,
    schedule: [
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '08:00', endTime: '16:00', isAvailable: true }
    ]
  },
  {
    id: '6',
    fullName: 'BS. Vũ Thị Phương',
    specialty: 'Sản phụ khoa',
    bio: 'Bác sĩ chuyên khoa sản phụ khoa với 14 năm kinh nghiệm. Chuyên khám thai, siêu âm thai, điều trị các bệnh phụ khoa.',
    avatar: '',
    rating: 4.8,
    totalReviews: 189,
    experience: 14,
    education: 'Tiến sĩ Y khoa - Đại học Y TP.HCM',
    certifications: ['Chứng chỉ Sản phụ khoa', 'Chứng chỉ Siêu âm thai'],
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    consultationFee: 550000,
    isAvailable: true,
    schedule: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '08:00', endTime: '16:00', isAvailable: true }
    ]
  }
];

const mockServices: PublicService[] = [
  {
    id: '1',
    name: 'Khám tổng quát',
    description: 'Khám sức khỏe tổng quát, đánh giá tình trạng sức khỏe chung',
    category: 'EXAMINATION',
    price: 200000,
    duration: 30,
    isAvailable: true
  },
  {
    id: '2',
    name: 'Khám tim mạch',
    description: 'Khám chuyên khoa tim mạch, đo điện tim, siêu âm tim',
    category: 'EXAMINATION',
    price: 500000,
    duration: 45,
    isAvailable: true
  },
  {
    id: '3',
    name: 'Xét nghiệm máu',
    description: 'Xét nghiệm công thức máu, sinh hóa máu, chức năng gan thận',
    category: 'DIAGNOSTIC',
    price: 300000,
    duration: 15,
    isAvailable: true
  },
  {
    id: '4',
    name: 'Siêu âm bụng',
    description: 'Siêu âm ổ bụng tổng quát, gan, thận, túi mật',
    category: 'DIAGNOSTIC',
    price: 400000,
    duration: 30,
    isAvailable: true
  },
  {
    id: '5',
    name: 'Nội soi dạ dày',
    description: 'Nội soi dạ dày tá tràng, phát hiện viêm loét, polyp',
    category: 'DIAGNOSTIC',
    price: 800000,
    duration: 60,
    isAvailable: true
  },
  {
    id: '6',
    name: 'Điều trị mụn trứng cá',
    description: 'Điều trị mụn trứng cá bằng laser, thuốc bôi, thuốc uống',
    category: 'TREATMENT',
    price: 600000,
    duration: 45,
    isAvailable: true
  },
  {
    id: '7',
    name: 'Tư vấn dinh dưỡng',
    description: 'Tư vấn chế độ ăn uống, dinh dưỡng phù hợp',
    category: 'CONSULTATION',
    price: 200000,
    duration: 30,
    isAvailable: true
  },
  {
    id: '8',
    name: 'Khám thai định kỳ',
    description: 'Khám thai định kỳ, siêu âm thai, theo dõi sự phát triển thai nhi',
    category: 'EXAMINATION',
    price: 400000,
    duration: 30,
    isAvailable: true
  }
];

const mockBookings: BookingRequest[] = [
  {
    id: 'booking-1',
    patientName: 'Nguyễn Văn A',
    patientPhone: '0123456789',
    patientEmail: 'nguyenvana@email.com',
    patientDob: '1990-01-01',
    doctorId: '1',
    doctor: mockDoctors[0],
    serviceId: '2',
    service: mockServices[1],
    appointmentDate: '2024-01-15',
    appointmentTime: '09:00',
    symptoms: 'Đau ngực, khó thở',
    status: 'CONFIRMED',
    paymentStatus: 'PENDING',
    paymentMethod: 'CASH',
    totalAmount: 500000,
    notes: 'Bệnh nhân có tiền sử tim mạch',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'booking-2',
    patientName: 'Trần Thị B',
    patientPhone: '0987654321',
    patientEmail: 'tranthib@email.com',
    patientDob: '1985-05-15',
    doctorId: '2',
    doctor: mockDoctors[1],
    serviceId: '3',
    service: mockServices[2],
    appointmentDate: '2024-01-16',
    appointmentTime: '14:00',
    symptoms: 'Mệt mỏi, khát nước',
    status: 'PENDING',
    paymentStatus: 'PENDING',
    paymentMethod: 'VNPAY',
    totalAmount: 300000,
    notes: '',
    createdAt: '2024-01-11T10:30:00Z',
    updatedAt: '2024-01-11T10:30:00Z'
  }
];

const mockRatings: Rating[] = [
  {
    id: 'rating-1',
    bookingId: 'booking-1',
    doctorId: '1',
    doctor: mockDoctors[0],
    patientName: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Bác sĩ rất tận tâm, khám kỹ lưỡng. Tôi rất hài lòng với dịch vụ.',
    serviceRating: 5,
    isAnonymous: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'rating-2',
    bookingId: 'booking-2',
    doctorId: '1',
    doctor: mockDoctors[0],
    patientName: 'Bệnh nhân ẩn danh',
    rating: 4,
    comment: 'Bác sĩ chuyên nghiệp, nhưng thời gian chờ hơi lâu.',
    serviceRating: 4,
    isAnonymous: true,
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z'
  }
];

// Helper functions
const generateBookingId = () => `booking-${Date.now()}`;
const generateRatingId = () => `rating-${Date.now()}`;

export const publicHandlers = [
  // Clinic Info
  http.get('/api/public/clinic-info', () => {
    return HttpResponse.json(mockClinicInfo);
  }),

  // Doctors
  http.get('/api/public/doctors', ({ request }) => {
    const url = new URL(request.url);
    const specialty = url.searchParams.get('specialty');
    const search = url.searchParams.get('search');
    const available = url.searchParams.get('available');
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');

    let filteredDoctors = [...mockDoctors];

    if (specialty) {
      filteredDoctors = filteredDoctors.filter(d => d.specialty === specialty);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredDoctors = filteredDoctors.filter(d => 
        d.fullName.toLowerCase().includes(searchLower) ||
        d.specialty.toLowerCase().includes(searchLower)
      );
    }

    if (available === 'true') {
      filteredDoctors = filteredDoctors.filter(d => d.isAvailable);
    }

    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filteredDoctors.slice(startIndex, endIndex);

    return HttpResponse.json({
      content,
      totalElements: filteredDoctors.length,
      totalPages: Math.ceil(filteredDoctors.length / size),
      size,
      number: page
    });
  }),

  http.get('/api/public/doctors/:id', ({ params }) => {
    const doctor = mockDoctors.find(d => d.id === params.id);
    if (!doctor) {
      return HttpResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }
    return HttpResponse.json(doctor);
  }),

  http.get('/api/public/doctors/:id/schedule', ({ params, request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    
    const doctor = mockDoctors.find(d => d.id === params.id);
    if (!doctor) {
      return HttpResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Mock available slots
    const availableSlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00'
    ];

    return HttpResponse.json({
      availableSlots,
      schedule: doctor.schedule
    });
  }),

  // Services
  http.get('/api/public/services', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const available = url.searchParams.get('available');
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');

    let filteredServices = [...mockServices];

    if (category) {
      filteredServices = filteredServices.filter(s => s.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredServices = filteredServices.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
      );
    }

    if (available === 'true') {
      filteredServices = filteredServices.filter(s => s.isAvailable);
    }

    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filteredServices.slice(startIndex, endIndex);

    return HttpResponse.json({
      content,
      totalElements: filteredServices.length,
      totalPages: Math.ceil(filteredServices.length / size),
      size,
      number: page
    });
  }),

  http.get('/api/public/services/:id', ({ params }) => {
    const service = mockServices.find(s => s.id === params.id);
    if (!service) {
      return HttpResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return HttpResponse.json(service);
  }),

  // Bookings
  http.post('/api/public/bookings', async ({ request }) => {
    const data = await request.json() as CreateBookingRequest;
    
    const doctor = mockDoctors.find(d => d.id === data.doctorId);
    const service = data.serviceId ? mockServices.find(s => s.id === data.serviceId) : undefined;
    
    const booking: BookingRequest = {
      id: generateBookingId(),
      ...data,
      doctor,
      service,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      totalAmount: service?.price || doctor?.consultationFee || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockBookings.push(booking);
    
    return HttpResponse.json(booking, { status: 201 });
  }),

  http.get('/api/public/bookings/:id', ({ params }) => {
    const booking = mockBookings.find(b => b.id === params.id);
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return HttpResponse.json(booking);
  }),

  http.put('/api/public/bookings/:id', async ({ params, request }) => {
    const data = await request.json() as Partial<CreateBookingRequest>;
    const bookingIndex = mockBookings.findIndex(b => b.id === params.id);
    
    if (bookingIndex === -1) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = mockBookings[bookingIndex];
    const updatedBooking = {
      ...booking,
      ...data,
      updatedAt: new Date().toISOString()
    };

    mockBookings[bookingIndex] = updatedBooking;
    return HttpResponse.json(updatedBooking);
  }),

  http.post('/api/public/bookings/:id/cancel', async ({ params, request }) => {
    const data = await request.json() as { reason?: string };
    const bookingIndex = mockBookings.findIndex(b => b.id === params.id);
    
    if (bookingIndex === -1) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = mockBookings[bookingIndex];
    const updatedBooking = {
      ...booking,
      status: 'CANCELLED' as const,
      notes: data.reason ? `${booking.notes || ''}\nLý do hủy: ${data.reason}`.trim() : booking.notes,
      updatedAt: new Date().toISOString()
    };

    mockBookings[bookingIndex] = updatedBooking;
    return HttpResponse.json(updatedBooking);
  }),

  http.get('/api/public/bookings', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const doctorId = url.searchParams.get('doctorId');
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');

    let filteredBookings = [...mockBookings];

    if (status) {
      filteredBookings = filteredBookings.filter(b => b.status === status);
    }

    if (doctorId) {
      filteredBookings = filteredBookings.filter(b => b.doctorId === doctorId);
    }

    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filteredBookings.slice(startIndex, endIndex);

    return HttpResponse.json({
      content,
      totalElements: filteredBookings.length,
      totalPages: Math.ceil(filteredBookings.length / size),
      size,
      number: page
    });
  }),

  http.get('/api/public/bookings/phone/:phone', ({ params }) => {
    const bookings = mockBookings.filter(b => b.patientPhone === params.phone);
    return HttpResponse.json(bookings);
  }),

  // Ratings
  http.post('/api/public/ratings', async ({ request }) => {
    const data = await request.json() as CreateRatingRequest;
    
    const doctor = mockDoctors.find(d => d.id === data.doctorId);
    const booking = mockBookings.find(b => b.id === data.bookingId);
    
    const rating: Rating = {
      id: generateRatingId(),
      ...data,
      doctor,
      patientName: booking?.patientName || 'Bệnh nhân ẩn danh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockRatings.push(rating);
    
    return HttpResponse.json(rating, { status: 201 });
  }),

  http.get('/api/public/doctors/:id/ratings', ({ params, request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');

    const doctorRatings = mockRatings.filter(r => r.doctorId === params.id);
    
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = doctorRatings.slice(startIndex, endIndex);

    return HttpResponse.json({
      content,
      totalElements: doctorRatings.length,
      totalPages: Math.ceil(doctorRatings.length / size),
      size,
      number: page
    });
  }),

  http.get('/api/public/doctors/:id/rating-stats', ({ params }) => {
    const doctorRatings = mockRatings.filter(r => r.doctorId === params.id);
    
    if (doctorRatings.length === 0) {
      return HttpResponse.json({
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: [],
        recentRatings: []
      });
    }

    const averageRating = doctorRatings.reduce((sum, r) => sum + r.rating, 0) / doctorRatings.length;
    
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => {
      const count = doctorRatings.filter(r => r.rating === rating).length;
      return {
        rating,
        count,
        percentage: (count / doctorRatings.length) * 100
      };
    });

    const recentRatings = doctorRatings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const stats: RatingStats = {
      averageRating,
      totalRatings: doctorRatings.length,
      ratingDistribution,
      recentRatings
    };

    return HttpResponse.json(stats);
  }),

  // Payment
  http.post('/api/public/payments', async ({ request }) => {
    const data = await request.json() as PaymentRequest;
    
    // Mock payment response
    const paymentResponse: PaymentResponse = {
      paymentUrl: data.paymentMethod === 'VNPAY' 
        ? 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=50000000&vnp_Command=pay&vnp_CreateDate=20240115120000&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang&vnp_OrderType=other&vnp_ReturnUrl=https://phongkham.com/return&vnp_TmnCode=DEMO&vnp_TxnRef=1234567890&vnp_Version=2.1.0&vnp_SecureHash=hash'
        : data.paymentMethod === 'MOMO'
        ? 'https://test-payment.momo.vn/v2/gateway/pay?partnerCode=MOMO&accessKey=accessKey&requestId=requestId&amount=500000&orderId=orderId&orderInfo=Thanh+toan+don+hang&returnUrl=https://phongkham.com/return&notifyUrl=https://phongkham.com/notify&signature=signature'
        : undefined,
      paymentId: `payment-${Date.now()}`,
      status: 'PENDING',
      message: 'Chuyển hướng đến trang thanh toán'
    };

    return HttpResponse.json(paymentResponse);
  }),

  http.get('/api/public/payments/:paymentId/status', ({ params }) => {
    // Mock payment status
    const statuses = ['PENDING', 'PAID', 'FAILED'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    const response: PaymentResponse = {
      status: randomStatus as any,
      message: randomStatus === 'PAID' ? 'Thanh toán thành công' : 
               randomStatus === 'FAILED' ? 'Thanh toán thất bại' : 'Đang xử lý'
    };

    return HttpResponse.json(response);
  }),

  // Notifications (stub)
  http.post('/api/public/notifications/booking-confirmation', async ({ request }) => {
    const data = await request.json() as { bookingId: string };
    console.log('Sending booking confirmation for:', data.bookingId);
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/public/notifications/booking-reminder', async ({ request }) => {
    const data = await request.json() as { bookingId: string };
    console.log('Sending booking reminder for:', data.bookingId);
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/public/notifications/booking-cancellation', async ({ request }) => {
    const data = await request.json() as { bookingId: string; reason?: string };
    console.log('Sending booking cancellation for:', data.bookingId, 'Reason:', data.reason);
    return HttpResponse.json({ success: true });
  })
];
