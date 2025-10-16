import { http, HttpResponse } from 'msw';
import type { MedicalService, PriceHistory, ServiceStats, BulkPriceUpdate } from '@/types/service';
import type { Indicator } from '@/types/indicator';

// Mock data for Medical Services
export const mockMedicalServices: MedicalService[] = [
  {
    id: 'service-1',
    name: 'Khám tổng quát',
    description: 'Khám sức khỏe tổng quát định kỳ',
    category: 'EXAMINATION',
    price: 200000,
    unit: 'lần',
    duration: 30,
    preparation: 'Nhịn ăn 8 tiếng trước khi khám',
    notes: 'Bao gồm đo huyết áp, nhịp tim, cân nặng',
    status: 'ACTIVE',
    indicators: [],
    priceHistory: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'service-2',
    name: 'Xét nghiệm máu',
    description: 'Xét nghiệm công thức máu cơ bản',
    category: 'DIAGNOSTIC',
    price: 150000,
    unit: 'lần',
    duration: 15,
    preparation: 'Nhịn ăn 12 tiếng trước khi lấy máu',
    notes: 'Kết quả có sau 2-3 ngày làm việc',
    status: 'ACTIVE',
    indicators: [],
    priceHistory: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'service-3',
    name: 'Siêu âm tim',
    description: 'Siêu âm tim Doppler màu',
    category: 'DIAGNOSTIC',
    price: 300000,
    unit: 'lần',
    duration: 45,
    preparation: 'Không cần chuẩn bị đặc biệt',
    notes: 'Bác sĩ chuyên khoa tim mạch thực hiện',
    status: 'ACTIVE',
    indicators: [],
    priceHistory: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'service-4',
    name: 'Tư vấn dinh dưỡng',
    description: 'Tư vấn chế độ ăn uống phù hợp',
    category: 'CONSULTATION',
    price: 100000,
    unit: 'buổi',
    duration: 30,
    preparation: 'Mang theo thực đơn hiện tại',
    notes: 'Chuyên gia dinh dưỡng tư vấn',
    status: 'ACTIVE',
    indicators: [],
    priceHistory: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'service-5',
    name: 'Vật lý trị liệu',
    description: 'Điều trị phục hồi chức năng',
    category: 'TREATMENT',
    price: 250000,
    unit: 'buổi',
    duration: 60,
    preparation: 'Mang quần áo thể thao',
    notes: 'Kỹ thuật viên vật lý trị liệu thực hiện',
    status: 'ACTIVE',
    indicators: [],
    priceHistory: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock data for Indicators
export const mockIndicators: Indicator[] = [
  {
    id: 'indicator-1',
    name: 'Huyết áp tâm thu',
    description: 'Áp lực máu khi tim co bóp',
    type: 'NUMBER',
    unit: 'mmHg',
    normalRange: {
      min: 90,
      max: 140,
      unit: 'mmHg'
    },
    required: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'indicator-2',
    name: 'Huyết áp tâm trương',
    description: 'Áp lực máu khi tim giãn',
    type: 'NUMBER',
    unit: 'mmHg',
    normalRange: {
      min: 60,
      max: 90,
      unit: 'mmHg'
    },
    required: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'indicator-3',
    name: 'Nhịp tim',
    description: 'Số lần tim đập trong 1 phút',
    type: 'NUMBER',
    unit: 'bpm',
    normalRange: {
      min: 60,
      max: 100,
      unit: 'bpm'
    },
    required: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'indicator-4',
    name: 'Nhiệt độ cơ thể',
    description: 'Nhiệt độ cơ thể đo tại nách',
    type: 'NUMBER',
    unit: '°C',
    normalRange: {
      min: 36.1,
      max: 37.2,
      unit: '°C'
    },
    required: false,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'indicator-5',
    name: 'Triệu chứng',
    description: 'Mô tả các triệu chứng hiện tại',
    type: 'TEXT',
    required: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock price history
export const mockPriceHistory: PriceHistory[] = [
  {
    id: 'price-1',
    serviceId: 'service-1',
    oldPrice: 180000,
    newPrice: 200000,
    effectiveDate: '2024-01-15T00:00:00Z',
    reason: 'Tăng giá theo quy định mới',
    createdBy: 'admin',
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'price-2',
    serviceId: 'service-2',
    oldPrice: 120000,
    newPrice: 150000,
    effectiveDate: '2024-02-01T00:00:00Z',
    reason: 'Cập nhật giá xét nghiệm',
    createdBy: 'admin',
    createdAt: '2024-02-01T09:00:00Z'
  }
];

// Medical Services handlers
export const medicalServiceHandlers = [
  // Get all services
  http.get('/api/medical-services', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const category = url.searchParams.get('category');
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    const sortBy = url.searchParams.get('sortBy') || 'name';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';

    let filteredServices = [...mockMedicalServices];

    // Apply filters
    if (search) {
      filteredServices = filteredServices.filter(service =>
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredServices = filteredServices.filter(service => service.category === category);
    }

    if (status) {
      filteredServices = filteredServices.filter(service => service.status === status);
    }

    // Apply sorting
    filteredServices.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    // Apply pagination
    const start = page * size;
    const end = start + size;
    const content = filteredServices.slice(start, end);

    return HttpResponse.json({
      content,
      totalElements: filteredServices.length,
      totalPages: Math.ceil(filteredServices.length / size),
      size,
      number: page,
      first: page === 0,
      last: page >= Math.ceil(filteredServices.length / size) - 1
    });
  }),

  // Get service by ID
  http.get('/api/medical-services/:id', ({ params }) => {
    const service = mockMedicalServices.find(s => s.id === params.id);
    if (!service) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(service);
  }),

  // Create service
  http.post('/api/medical-services', async ({ request }) => {
    const data = await request.json() as any;
    const newService: MedicalService = {
      id: `service-${Date.now()}`,
      ...data,
      status: 'ACTIVE',
      indicators: [],
      priceHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockMedicalServices.push(newService);
    return HttpResponse.json(newService, { status: 201 });
  }),

  // Update service
  http.put('/api/medical-services/:id', async ({ params, request }) => {
    const data = await request.json() as any;
    const index = mockMedicalServices.findIndex(s => s.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockMedicalServices[index] = {
      ...mockMedicalServices[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return HttpResponse.json(mockMedicalServices[index]);
  }),

  // Delete service
  http.delete('/api/medical-services/:id', ({ params }) => {
    const index = mockMedicalServices.findIndex(s => s.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockMedicalServices.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // Get service statistics
  http.get('/api/medical-services/stats', () => {
    const stats: ServiceStats = {
      totalServices: mockMedicalServices.length,
      activeServices: mockMedicalServices.filter(s => s.status === 'ACTIVE').length,
      totalRevenue: mockMedicalServices.reduce((sum, s) => sum + s.price, 0),
      topServices: mockMedicalServices
        .sort((a, b) => b.price - a.price)
        .slice(0, 5)
        .map(s => ({
          serviceId: s.id,
          serviceName: s.name,
          usageCount: Math.floor(Math.random() * 100),
          revenue: s.price * Math.floor(Math.random() * 50)
        })),
      revenueByCategory: [
        { category: 'EXAMINATION', revenue: 500000, percentage: 40 },
        { category: 'DIAGNOSTIC', revenue: 300000, percentage: 24 },
        { category: 'TREATMENT', revenue: 250000, percentage: 20 },
        { category: 'CONSULTATION', revenue: 200000, percentage: 16 }
      ]
    };
    return HttpResponse.json(stats);
  }),

  // Get price history
  http.get('/api/medical-services/:id/price-history', ({ params }) => {
    const history = mockPriceHistory.filter(h => h.serviceId === params.id);
    return HttpResponse.json(history);
  }),

  // Update service price
  http.post('/api/medical-services/:id/price', async ({ params, request }) => {
    const data = await request.json() as any;
    const service = mockMedicalServices.find(s => s.id === params.id);
    if (!service) {
      return new HttpResponse(null, { status: 404 });
    }

    const oldPrice = service.price;
    service.price = data.newPrice;
    service.updatedAt = new Date().toISOString();

    const priceHistory: PriceHistory = {
      id: `price-${Date.now()}`,
      serviceId: service.id,
      oldPrice,
      newPrice: data.newPrice,
      effectiveDate: data.effectiveDate,
      reason: data.reason,
      createdBy: 'admin',
      createdAt: new Date().toISOString()
    };

    mockPriceHistory.push(priceHistory);
    return HttpResponse.json(priceHistory);
  }),

  // Bulk update prices
  http.post('/api/medical-services/bulk-price-update', async ({ request }) => {
    const data = await request.json() as any;
    const updates = data.updates as BulkPriceUpdate[];
    
    let success = 0;
    let failed = 0;

    for (const update of updates) {
      const service = mockMedicalServices.find(s => s.id === update.serviceId);
      if (service) {
        const oldPrice = service.price;
        service.price = update.newPrice;
        service.updatedAt = new Date().toISOString();

        const priceHistory: PriceHistory = {
          id: `price-${Date.now()}-${Math.random()}`,
          serviceId: service.id,
          oldPrice,
          newPrice: update.newPrice,
          effectiveDate: update.effectiveDate,
          reason: update.reason,
          createdBy: 'admin',
          createdAt: new Date().toISOString()
        };

        mockPriceHistory.push(priceHistory);
        success++;
      } else {
        failed++;
      }
    }

    return HttpResponse.json({ success, failed });
  })
];

// Indicators handlers
export const indicatorHandlers = [
  // Get all indicators
  http.get('/api/service-indicators', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const type = url.searchParams.get('type');
    const isActive = url.searchParams.get('isActive');
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');

    let filteredIndicators = [...mockIndicators];

    if (search) {
      filteredIndicators = filteredIndicators.filter(indicator =>
        indicator.name.toLowerCase().includes(search.toLowerCase()) ||
        indicator.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type) {
      filteredIndicators = filteredIndicators.filter(indicator => indicator.type === type);
    }

    if (isActive !== null) {
      const activeFilter = isActive === 'true';
      filteredIndicators = filteredIndicators.filter(indicator => indicator.isActive === activeFilter);
    }

    const start = page * size;
    const end = start + size;
    const content = filteredIndicators.slice(start, end);

    return HttpResponse.json({
      content,
      totalElements: filteredIndicators.length,
      totalPages: Math.ceil(filteredIndicators.length / size),
      size,
      number: page,
      first: page === 0,
      last: page >= Math.ceil(filteredIndicators.length / size) - 1
    });
  }),

  // Get indicator by ID
  http.get('/api/service-indicators/:id', ({ params }) => {
    const indicator = mockIndicators.find(i => i.id === params.id);
    if (!indicator) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(indicator);
  }),

  // Create indicator
  http.post('/api/service-indicators', async ({ request }) => {
    const data = await request.json() as any;
    const newIndicator: Indicator = {
      id: `indicator-${Date.now()}`,
      ...data,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockIndicators.push(newIndicator);
    return HttpResponse.json(newIndicator, { status: 201 });
  }),

  // Update indicator
  http.put('/api/service-indicators/:id', async ({ params, request }) => {
    const data = await request.json() as any;
    const index = mockIndicators.findIndex(i => i.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockIndicators[index] = {
      ...mockIndicators[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return HttpResponse.json(mockIndicators[index]);
  }),

  // Delete indicator
  http.delete('/api/service-indicators/:id', ({ params }) => {
    const index = mockIndicators.findIndex(i => i.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockIndicators.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  })
];
