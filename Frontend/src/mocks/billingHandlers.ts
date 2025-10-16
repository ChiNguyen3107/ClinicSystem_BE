import { http, HttpResponse } from 'msw';
import type { 
  Billing, 
  BillingStatistics, 
  BillingFilters, 
  CreateBillingRequest, 
  UpdateBillingRequest, 
  ProcessPaymentRequest,
  DiscountCode,
  CreateDiscountCodeRequest,
  UpdateDiscountCodeRequest,
  BillingStatus,
  PaymentMethod,
  DiscountType
} from '@/types';

// Mock billing data
const mockBillings: Billing[] = [
  {
    id: '1',
    code: 'HD001',
    patientId: '1',
    patientName: 'Nguyễn Văn An',
    visitId: '1',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    total: 350000,
    subtotal: 300000,
    discountAmount: 0,
    vatAmount: 30000,
    vatRate: 10,
    status: 'PAID',
    paymentMethod: 'CASH',
    paidAt: '2024-01-20T10:30:00Z',
    notes: 'Thanh toán bằng tiền mặt',
    services: [
      {
        id: '1',
        serviceId: '1',
        serviceName: 'Khám tim mạch',
        quantity: 1,
        unitPrice: 200000,
        totalPrice: 200000
      },
      {
        id: '2',
        serviceId: '2',
        serviceName: 'Đo huyết áp',
        quantity: 1,
        unitPrice: 50000,
        totalPrice: 50000
      },
      {
        id: '3',
        serviceId: '3',
        serviceName: 'Điện tâm đồ',
        quantity: 1,
        unitPrice: 50000,
        totalPrice: 50000
      }
    ],
    medications: [
      {
        id: '1',
        medicationId: '1',
        medicationName: 'Paracetamol 500mg',
        quantity: 20,
        unitPrice: 2000,
        totalPrice: 40000
      },
      {
        id: '2',
        medicationId: '2',
        medicationName: 'Vitamin C',
        quantity: 30,
        unitPrice: 1000,
        totalPrice: 30000
      }
    ]
  },
  {
    id: '2',
    code: 'HD002',
    patientId: '2',
    patientName: 'Trần Thị Bình',
    visitId: '2',
    createdAt: '2024-01-21T09:00:00Z',
    updatedAt: '2024-01-21T09:00:00Z',
    total: 180000,
    subtotal: 200000,
    discountAmount: 20000,
    discountPercentage: 10,
    vatAmount: 18000,
    vatRate: 10,
    status: 'PENDING',
    paymentMethod: 'TRANSFER',
    notes: 'Giảm giá 10% cho khách hàng VIP',
    services: [
      {
        id: '1',
        serviceId: '4',
        serviceName: 'Khám nhi khoa',
        quantity: 1,
        unitPrice: 150000,
        totalPrice: 150000
      },
      {
        id: '2',
        serviceId: '5',
        serviceName: 'Tiêm chủng',
        quantity: 1,
        unitPrice: 50000,
        totalPrice: 50000
      }
    ],
    medications: []
  },
  {
    id: '3',
    code: 'HD003',
    patientId: '3',
    patientName: 'Lê Văn Cường',
    visitId: '3',
    createdAt: '2024-01-22T14:00:00Z',
    updatedAt: '2024-01-22T14:00:00Z',
    total: 550000,
    subtotal: 500000,
    discountAmount: 0,
    vatAmount: 50000,
    vatRate: 10,
    status: 'PAID',
    paymentMethod: 'CARD',
    paidAt: '2024-01-22T14:30:00Z',
    notes: 'Thanh toán bằng thẻ tín dụng',
    services: [
      {
        id: '1',
        serviceId: '6',
        serviceName: 'Phẫu thuật nội soi',
        quantity: 1,
        unitPrice: 500000,
        totalPrice: 500000
      }
    ],
    medications: []
  }
];

// Mock discount codes
const mockDiscountCodes: DiscountCode[] = [
  {
    id: '1',
    code: 'VIP10',
    name: 'Giảm giá VIP 10%',
    description: 'Giảm giá 10% cho khách hàng VIP',
    type: 'PERCENTAGE',
    value: 10,
    minOrderAmount: 100000,
    maxDiscountAmount: 50000,
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-12-31T23:59:59Z',
    usageLimit: 100,
    usedCount: 15,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    code: 'WELCOME20',
    name: 'Chào mừng khách hàng mới',
    description: 'Giảm giá 20% cho khách hàng lần đầu',
    type: 'PERCENTAGE',
    value: 20,
    minOrderAmount: 50000,
    maxDiscountAmount: 100000,
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-06-30T23:59:59Z',
    usageLimit: 50,
    usedCount: 8,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    code: 'FIXED50K',
    name: 'Giảm giá cố định 50K',
    description: 'Giảm giá cố định 50,000 VNĐ',
    type: 'FIXED_AMOUNT',
    value: 50000,
    minOrderAmount: 200000,
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-12-31T23:59:59Z',
    usageLimit: 200,
    usedCount: 45,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock billing statistics
const mockBillingStatistics: BillingStatistics = {
  totalRevenue: 1080000,
  totalBills: 3,
  averageBillValue: 360000,
  revenueByMethod: {
    CASH: 350000,
    TRANSFER: 0,
    CARD: 550000,
    E_WALLET: 180000
  },
  revenueByPeriod: {
    daily: [
      { date: '2024-01-20', revenue: 350000 },
      { date: '2024-01-21', revenue: 0 },
      { date: '2024-01-22', revenue: 550000 }
    ],
    weekly: [
      { week: 'Tuần 1', revenue: 900000 },
      { week: 'Tuần 2', revenue: 180000 }
    ],
    monthly: [
      { month: 'Tháng 1', revenue: 1080000 }
    ]
  },
  topServices: [
    { serviceName: 'Khám tim mạch', revenue: 200000, count: 1 },
    { serviceName: 'Phẫu thuật nội soi', revenue: 500000, count: 1 },
    { serviceName: 'Khám nhi khoa', revenue: 150000, count: 1 }
  ],
  topMedications: [
    { medicationName: 'Paracetamol 500mg', revenue: 40000, count: 20 },
    { medicationName: 'Vitamin C', revenue: 30000, count: 30 }
  ]
};

export const billingHandlers = [
  // Get billings with filters
  http.get('/api/billings', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    const status = url.searchParams.get('status');
    const paymentMethod = url.searchParams.get('paymentMethod');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const search = url.searchParams.get('search');

    let filteredBillings = [...mockBillings];

    if (status) {
      filteredBillings = filteredBillings.filter(b => b.status === status);
    }
    if (paymentMethod) {
      filteredBillings = filteredBillings.filter(b => b.paymentMethod === paymentMethod);
    }
    if (dateFrom) {
      filteredBillings = filteredBillings.filter(b => b.createdAt >= dateFrom);
    }
    if (dateTo) {
      filteredBillings = filteredBillings.filter(b => b.createdAt <= dateTo);
    }
    if (search) {
      filteredBillings = filteredBillings.filter(b => 
        b.code.toLowerCase().includes(search.toLowerCase()) ||
        b.patientName.toLowerCase().includes(search.toLowerCase())
      );
    }

    const start = page * size;
    const end = start + size;
    const content = filteredBillings.slice(start, end);

    return HttpResponse.json({
      content,
      totalElements: filteredBillings.length,
      totalPages: Math.ceil(filteredBillings.length / size),
      size,
      number: page,
      first: page === 0,
      last: page >= Math.ceil(filteredBillings.length / size) - 1
    });
  }),

  // Get billing by ID
  http.get('/api/billings/:id', ({ params }) => {
    const id = params.id as string;
    const billing = mockBillings.find(b => b.id === id);
    
    if (!billing) {
      return HttpResponse.json({ message: 'Không tìm thấy hóa đơn' }, { status: 404 });
    }
    
    return HttpResponse.json({
      success: true,
      data: billing,
      message: 'Lấy thông tin hóa đơn thành công'
    });
  }),

  // Create billing
  http.post('/api/billings', async ({ request }) => {
    const data = await request.json() as CreateBillingRequest;
    
    const newBilling: Billing = {
      id: (mockBillings.length + 1).toString(),
      code: `HD${String(mockBillings.length + 1).padStart(3, '0')}`,
      patientId: '1', // Mock patient ID
      patientName: 'Bệnh nhân mới',
      visitId: data.visitId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      total: 0, // Will be calculated
      subtotal: 0, // Will be calculated
      discountAmount: data.discountAmount || 0,
      discountPercentage: data.discountPercentage,
      discountCode: data.discountCode,
      vatAmount: 0, // Will be calculated
      vatRate: 10,
      status: 'DRAFT',
      paymentMethod: 'CASH',
      notes: data.notes,
      services: data.services.map(s => ({
        id: Math.random().toString(),
        serviceId: s.serviceId,
        serviceName: `Dịch vụ ${s.serviceId}`,
        quantity: s.quantity,
        unitPrice: 100000,
        totalPrice: 100000 * s.quantity
      })),
      medications: data.medications.map(m => ({
        id: Math.random().toString(),
        medicationId: m.medicationId,
        medicationName: `Thuốc ${m.medicationId}`,
        quantity: m.quantity,
        unitPrice: 5000,
        totalPrice: 5000 * m.quantity
      }))
    };

    // Calculate totals
    const serviceTotal = newBilling.services.reduce((sum, s) => sum + s.totalPrice, 0);
    const medicationTotal = newBilling.medications.reduce((sum, m) => sum + m.totalPrice, 0);
    newBilling.subtotal = serviceTotal + medicationTotal;
    
    const discountAmount = newBilling.discountPercentage 
      ? Math.round((newBilling.subtotal * newBilling.discountPercentage) / 100)
      : (newBilling.discountAmount || 0);
    
    const afterDiscount = Math.max(0, newBilling.subtotal - discountAmount);
    newBilling.discountAmount = discountAmount;
    newBilling.vatAmount = Math.round((afterDiscount * newBilling.vatRate) / 100);
    newBilling.total = afterDiscount + newBilling.vatAmount;

    mockBillings.push(newBilling);
    
    return HttpResponse.json({
      success: true,
      data: newBilling,
      message: 'Tạo hóa đơn thành công'
    }, { status: 201 });
  }),

  // Update billing
  http.put('/api/billings/:id', async ({ params, request }) => {
    const id = params.id as string;
    const data = await request.json() as UpdateBillingRequest;
    const index = mockBillings.findIndex(b => b.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ message: 'Không tìm thấy hóa đơn' }, { status: 404 });
    }
    
    mockBillings[index] = {
      ...mockBillings[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return HttpResponse.json({
      success: true,
      data: mockBillings[index],
      message: 'Cập nhật hóa đơn thành công'
    });
  }),

  // Delete billing
  http.delete('/api/billings/:id', ({ params }) => {
    const id = params.id as string;
    const index = mockBillings.findIndex(b => b.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ message: 'Không tìm thấy hóa đơn' }, { status: 404 });
    }
    
    mockBillings.splice(index, 1);
    
    return HttpResponse.json({
      success: true,
      message: 'Xóa hóa đơn thành công'
    });
  }),

  // Process payment
  http.post('/api/billings/:id/payment', async ({ params, request }) => {
    const id = params.id as string;
    const data = await request.json() as ProcessPaymentRequest;
    const index = mockBillings.findIndex(b => b.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ message: 'Không tìm thấy hóa đơn' }, { status: 404 });
    }
    
    mockBillings[index] = {
      ...mockBillings[index],
      status: 'PAID',
      paymentMethod: data.method,
      paidAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return HttpResponse.json({
      success: true,
      data: mockBillings[index],
      message: 'Thanh toán thành công'
    });
  }),

  // Get billing statistics
  http.get('/api/billings/statistics', ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'month';
    
    return HttpResponse.json({
      success: true,
      data: mockBillingStatistics,
      message: 'Lấy thống kê hóa đơn thành công'
    });
  }),

  // Export billings
  http.get('/api/billings/export', ({ request }) => {
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'excel';
    
    // Mock export file
    const content = format === 'excel' 
      ? 'Mock Excel content' 
      : 'Mock PDF content';
    
    const blob = new Blob([content], { 
      type: format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf' 
    });
    
    return new HttpResponse(blob, {
      headers: {
        'Content-Type': format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf',
        'Content-Disposition': `attachment; filename="billings.${format === 'excel' ? 'xlsx' : 'pdf'}"`
      }
    });
  }),

  // Send invoice by email
  http.post('/api/billings/:id/send-email', async ({ params, request }) => {
    const id = params.id as string;
    const { email } = await request.json() as { email: string };
    
    const billing = mockBillings.find(b => b.id === id);
    if (!billing) {
      return HttpResponse.json({ message: 'Không tìm thấy hóa đơn' }, { status: 404 });
    }
    
    return HttpResponse.json({
      success: true,
      message: `Hóa đơn đã được gửi đến ${email}`
    });
  }),

  // Print invoice
  http.get('/api/billings/:id/print', ({ params }) => {
    const id = params.id as string;
    const billing = mockBillings.find(b => b.id === id);
    
    if (!billing) {
      return HttpResponse.json({ message: 'Không tìm thấy hóa đơn' }, { status: 404 });
    }
    
    // Mock PDF content
    const pdfContent = `PDF content for billing ${billing.code}`;
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    
    return new HttpResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="hoa-don-${billing.code}.pdf"`
      }
    });
  }),

  // Discount Code handlers
  // Get discount codes
  http.get('/api/discount-codes', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    const search = url.searchParams.get('search');

    let filteredCodes = [...mockDiscountCodes];

    if (search) {
      filteredCodes = filteredCodes.filter(c => 
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const start = page * size;
    const end = start + size;
    const content = filteredCodes.slice(start, end);

    return HttpResponse.json({
      content,
      totalElements: filteredCodes.length,
      totalPages: Math.ceil(filteredCodes.length / size),
      size,
      number: page,
      first: page === 0,
      last: page >= Math.ceil(filteredCodes.length / size) - 1
    });
  }),

  // Get discount code by ID
  http.get('/api/discount-codes/:id', ({ params }) => {
    const id = params.id as string;
    const code = mockDiscountCodes.find(c => c.id === id);
    
    if (!code) {
      return HttpResponse.json({ message: 'Không tìm thấy mã giảm giá' }, { status: 404 });
    }
    
    return HttpResponse.json({
      success: true,
      data: code,
      message: 'Lấy thông tin mã giảm giá thành công'
    });
  }),

  // Create discount code
  http.post('/api/discount-codes', async ({ request }) => {
    const data = await request.json() as CreateDiscountCodeRequest;
    
    const newCode: DiscountCode = {
      id: (mockDiscountCodes.length + 1).toString(),
      ...data,
      usedCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockDiscountCodes.push(newCode);
    
    return HttpResponse.json({
      success: true,
      data: newCode,
      message: 'Tạo mã giảm giá thành công'
    }, { status: 201 });
  }),

  // Update discount code
  http.put('/api/discount-codes/:id', async ({ params, request }) => {
    const id = params.id as string;
    const data = await request.json() as UpdateDiscountCodeRequest;
    const index = mockDiscountCodes.findIndex(c => c.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ message: 'Không tìm thấy mã giảm giá' }, { status: 404 });
    }
    
    mockDiscountCodes[index] = {
      ...mockDiscountCodes[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return HttpResponse.json({
      success: true,
      data: mockDiscountCodes[index],
      message: 'Cập nhật mã giảm giá thành công'
    });
  }),

  // Delete discount code
  http.delete('/api/discount-codes/:id', ({ params }) => {
    const id = params.id as string;
    const index = mockDiscountCodes.findIndex(c => c.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ message: 'Không tìm thấy mã giảm giá' }, { status: 404 });
    }
    
    mockDiscountCodes.splice(index, 1);
    
    return HttpResponse.json({
      success: true,
      message: 'Xóa mã giảm giá thành công'
    });
  }),

  // Toggle discount code status
  http.patch('/api/discount-codes/:id/status', async ({ params, request }) => {
    const id = params.id as string;
    const { isActive } = await request.json() as { isActive: boolean };
    const index = mockDiscountCodes.findIndex(c => c.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ message: 'Không tìm thấy mã giảm giá' }, { status: 404 });
    }
    
    mockDiscountCodes[index] = {
      ...mockDiscountCodes[index],
      isActive,
      updatedAt: new Date().toISOString()
    };
    
    return HttpResponse.json({
      success: true,
      data: mockDiscountCodes[index],
      message: 'Cập nhật trạng thái mã giảm giá thành công'
    });
  }),

  // Validate discount code
  http.post('/api/discount-codes/validate', async ({ request }) => {
    const { code, orderAmount } = await request.json() as { code: string; orderAmount: number };
    
    const discountCode = mockDiscountCodes.find(c => c.code === code && c.isActive);
    
    if (!discountCode) {
      return HttpResponse.json({
        success: true,
        data: {
          isValid: false,
          discountAmount: 0,
          message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn'
        }
      });
    }

    // Check minimum order amount
    if (discountCode.minOrderAmount && orderAmount < discountCode.minOrderAmount) {
      return HttpResponse.json({
        success: true,
        data: {
          isValid: false,
          discountAmount: 0,
          message: `Đơn hàng phải có giá trị tối thiểu ${discountCode.minOrderAmount.toLocaleString()} VNĐ`
        }
      });
    }

    // Check usage limit
    if (discountCode.usageLimit && discountCode.usedCount >= discountCode.usageLimit) {
      return HttpResponse.json({
        success: true,
        data: {
          isValid: false,
          discountAmount: 0,
          message: 'Mã giảm giá đã hết lượt sử dụng'
        }
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discountCode.type === 'PERCENTAGE') {
      discountAmount = Math.round((orderAmount * discountCode.value) / 100);
      if (discountCode.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, discountCode.maxDiscountAmount);
      }
    } else {
      discountAmount = discountCode.value;
    }

    return HttpResponse.json({
      success: true,
      data: {
        isValid: true,
        discountAmount,
        message: 'Mã giảm giá hợp lệ'
      }
    });
  }),

  // Get discount code stats
  http.get('/api/discount-codes/:id/stats', ({ params }) => {
    const id = params.id as string;
    const code = mockDiscountCodes.find(c => c.id === id);
    
    if (!code) {
      return HttpResponse.json({ message: 'Không tìm thấy mã giảm giá' }, { status: 404 });
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        totalUsage: code.usedCount,
        totalDiscount: code.usedCount * (code.type === 'PERCENTAGE' ? 50000 : code.value),
        usageByDate: [
          { date: '2024-01-20', count: 5, amount: 250000 },
          { date: '2024-01-21', count: 3, amount: 150000 },
          { date: '2024-01-22', count: 7, amount: 350000 }
        ]
      },
      message: 'Lấy thống kê mã giảm giá thành công'
    });
  })
];
