import { http, HttpResponse } from 'msw';

// Mock data for Advanced Features
const mockAIMessages = [
  {
    id: '1',
    type: 'system',
    content: 'Xin chào! Tôi là AI Assistant của phòng khám. Tôi có thể giúp bạn gợi ý chẩn đoán, tư vấn thuốc và lịch hẹn thông minh.',
    timestamp: new Date().toISOString(),
    suggestions: [
      'Phân tích triệu chứng',
      'Gợi ý chẩn đoán',
      'Tư vấn thuốc',
      'Lịch hẹn thông minh'
    ]
  }
];

const mockVideoCalls = [
  {
    id: 'call-001',
    patientId: 'patient-001',
    patientName: 'Trần Thị B',
    doctorId: 'doctor-001',
    doctorName: 'Dr. Nguyễn Văn A',
    startTime: new Date().toISOString(),
    duration: 0,
    status: 'active',
    participants: [
      {
        id: '1',
        name: 'Dr. Nguyễn Văn A',
        role: 'doctor',
        isVideoOn: true,
        isAudioOn: true,
        isSharing: false
      },
      {
        id: '2',
        name: 'Bệnh nhân Trần Thị B',
        role: 'patient',
        isVideoOn: true,
        isAudioOn: true,
        isSharing: false
      }
    ]
  }
];

const mockIoTDevices = [
  {
    id: 'device-001',
    name: 'Máy đo huyết áp Omron',
    type: 'blood_pressure',
    status: 'online',
    batteryLevel: 85,
    lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    location: 'Phòng khám A',
    patientId: 'patient-001',
    patientName: 'Nguyễn Văn A',
    dataPoints: 156,
    alerts: 2,
    firmware: 'v2.1.3',
    signalStrength: 85
  },
  {
    id: 'device-002',
    name: 'Máy đo đường huyết Accu-Chek',
    type: 'glucose_meter',
    status: 'online',
    batteryLevel: 45,
    lastSync: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    location: 'Phòng khám B',
    patientId: 'patient-002',
    patientName: 'Trần Thị B',
    dataPoints: 89,
    alerts: 0,
    firmware: 'v1.8.2',
    signalStrength: 72
  },
  {
    id: 'device-003',
    name: 'Nhiệt kế điện tử Braun',
    type: 'thermometer',
    status: 'offline',
    batteryLevel: 15,
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    location: 'Phòng khám C',
    patientId: 'patient-003',
    patientName: 'Lê Văn C',
    dataPoints: 23,
    alerts: 1,
    firmware: 'v1.5.1',
    signalStrength: 0
  }
];

const mockAnalyticsInsights = [
  {
    id: '1',
    title: 'Tăng 15% bệnh nhân mắc tiểu đường',
    type: 'trend',
    confidence: 0.87,
    value: 15,
    unit: '%',
    change: 15,
    changeType: 'increase',
    description: 'Dự đoán số lượng bệnh nhân tiểu đường sẽ tăng 15% trong quý tới dựa trên dữ liệu lịch sử',
    category: 'patient',
    priority: 'high',
    actionable: true,
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Giảm 8% doanh thu khám ngoại trú',
    type: 'anomaly',
    confidence: 0.92,
    value: -8,
    unit: '%',
    change: -8,
    changeType: 'decrease',
    description: 'Phát hiện xu hướng giảm doanh thu khám ngoại trú so với cùng kỳ năm trước',
    category: 'revenue',
    priority: 'high',
    actionable: true,
    timestamp: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Tối ưu hóa lịch khám',
    type: 'recommendation',
    confidence: 0.78,
    value: 23,
    unit: 'phút',
    change: 23,
    changeType: 'increase',
    description: 'Có thể tiết kiệm 23 phút/ngày bằng cách tối ưu hóa lịch khám',
    category: 'efficiency',
    priority: 'medium',
    actionable: true,
    timestamp: new Date().toISOString()
  }
];

const mockIntegrations = [
  {
    id: '1',
    name: 'HIS - Bệnh viện ABC',
    type: 'his',
    status: 'active',
    endpoint: 'https://his.abc-hospital.com/api/v2',
    apiKey: 'his_***abc123',
    lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    syncCount: 1247,
    errorCount: 3,
    description: 'Kết nối hệ thống thông tin bệnh viện',
    version: 'v2.1.3',
    health: 'healthy'
  },
  {
    id: '2',
    name: 'PACS - Hình ảnh y tế',
    type: 'pacs',
    status: 'active',
    endpoint: 'https://pacs.medical.com/dicom',
    apiKey: 'pacs_***def456',
    lastSync: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    syncCount: 892,
    errorCount: 1,
    description: 'Hệ thống lưu trữ và truyền tải hình ảnh y tế',
    version: 'v3.0.1',
    health: 'healthy'
  }
];

const mockWebhooks = [
  {
    id: '1',
    name: 'Patient Created',
    url: 'https://webhook.site/abc123',
    events: ['patient.created', 'patient.updated'],
    status: 'active',
    lastTriggered: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    triggerCount: 156,
    successRate: 0.98,
    secret: 'wh_***secret123',
    retryCount: 2
  },
  {
    id: '2',
    name: 'Appointment Status',
    url: 'https://webhook.site/def456',
    events: ['appointment.created', 'appointment.cancelled'],
    status: 'active',
    lastTriggered: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    triggerCount: 89,
    successRate: 0.95,
    secret: 'wh_***secret456',
    retryCount: 0
  }
];

const mockApiKeys = [
  {
    id: '1',
    name: 'Mobile App Key',
    key: 'ak_***mobile123',
    permissions: ['read:patients', 'write:appointments'],
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    usage: 1247
  },
  {
    id: '2',
    name: 'Third-party Integration',
    key: 'ak_***thirdparty456',
    permissions: ['read:patients', 'read:appointments'],
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastUsed: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    usage: 892
  }
];

export const advancedHandlers = [
  // AI Assistant endpoints
  http.post('/ai/chat', async ({ request }) => {
    const { message } = await request.json() as { message: string };
    
    const aiResponse = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Tôi đã nhận được tin nhắn: "${message}". Đây là phản hồi từ AI Assistant.`,
      timestamp: new Date().toISOString(),
      suggestions: [
        'Phân tích triệu chứng',
        'Gợi ý chẩn đoán',
        'Tư vấn thuốc',
        'Lịch hẹn thông minh'
      ]
    };

    return HttpResponse.json(aiResponse);
  }),

  http.get('/ai/suggestions', () => {
    return HttpResponse.json([
      'Phân tích triệu chứng',
      'Gợi ý chẩn đoán',
      'Tư vấn thuốc',
      'Lịch hẹn thông minh'
    ]);
  }),

  http.post('/ai/diagnosis', async ({ request }) => {
    const { symptoms } = await request.json() as { symptoms: string[] };
    
    return HttpResponse.json({
      confidence: 0.85,
      conditions: [
        {
          name: 'Cảm cúm thông thường',
          probability: 0.7,
          symptoms: ['Sốt', 'Ho', 'Nghẹt mũi']
        },
        {
          name: 'Viêm họng',
          probability: 0.6,
          symptoms: ['Đau họng', 'Khó nuốt', 'Sốt nhẹ']
        }
      ]
    });
  }),

  http.post('/ai/medication', async ({ request }) => {
    const { condition } = await request.json() as { condition: string };
    
    return HttpResponse.json({
      name: 'Paracetamol 500mg',
      dosage: '2 viên/ngày, sau ăn',
      interactions: ['Không dùng chung với rượu', 'Thận trọng với bệnh gan']
    });
  }),

  // Telemedicine endpoints
  http.post('/telemedicine/call/start', async ({ request }) => {
    const { patientId, doctorId } = await request.json() as { patientId: string; doctorId: string };
    
    const newCall = {
      id: 'call-' + Date.now(),
      patientId,
      patientName: 'Bệnh nhân',
      doctorId,
      doctorName: 'Bác sĩ',
      startTime: new Date().toISOString(),
      duration: 0,
      status: 'active',
      participants: [
        {
          id: '1',
          name: 'Bác sĩ',
          role: 'doctor',
          isVideoOn: true,
          isAudioOn: true,
          isSharing: false
        },
        {
          id: '2',
          name: 'Bệnh nhân',
          role: 'patient',
          isVideoOn: true,
          isAudioOn: true,
          isSharing: false
        }
      ]
    };

    return HttpResponse.json(newCall);
  }),

  http.post('/telemedicine/call/:callId/end', () => {
    return HttpResponse.json({ success: true });
  }),

  http.get('/telemedicine/calls/history', () => {
    return HttpResponse.json(mockVideoCalls);
  }),

  http.get('/telemedicine/calls/upcoming', () => {
    return HttpResponse.json([]);
  }),

  // IoT endpoints
  http.get('/iot/devices', () => {
    return HttpResponse.json(mockIoTDevices);
  }),

  http.post('/iot/devices/:deviceId/sync', () => {
    return HttpResponse.json({ success: true });
  }),

  http.post('/iot/devices/sync-all', () => {
    return HttpResponse.json({ success: true });
  }),

  http.get('/iot/devices/:deviceId/data', () => {
    return HttpResponse.json([]);
  }),

  http.get('/iot/alerts', () => {
    return HttpResponse.json([]);
  }),

  // Analytics endpoints
  http.get('/analytics/insights', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    
    let insights = mockAnalyticsInsights;
    if (category && category !== 'all') {
      insights = mockAnalyticsInsights.filter(insight => insight.category === category);
    }
    
    return HttpResponse.json(insights);
  }),

  http.get('/analytics/models', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Mô hình dự đoán bệnh tim',
        accuracy: 0.89,
        lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        predictions: 1247,
        status: 'active'
      },
      {
        id: '2',
        name: 'Mô hình tối ưu lịch khám',
        accuracy: 0.82,
        lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        predictions: 892,
        status: 'active'
      }
    ]);
  }),

  http.post('/analytics/reports', async ({ request }) => {
    const { type, parameters } = await request.json() as { type: string; parameters: any };
    
    return HttpResponse.json({
      id: 'report-' + Date.now(),
      type,
      parameters,
      status: 'generated',
      url: '/reports/report-' + Date.now() + '.pdf'
    });
  }),

  http.get('/analytics/dashboard', () => {
    return HttpResponse.json({
      totalInsights: mockAnalyticsInsights.length,
      highPriorityInsights: mockAnalyticsInsights.filter(i => i.priority === 'high').length,
      actionableInsights: mockAnalyticsInsights.filter(i => i.actionable).length,
      avgConfidence: mockAnalyticsInsights.reduce((sum, i) => sum + i.confidence, 0) / mockAnalyticsInsights.length
    });
  }),

  // Integration endpoints
  http.get('/integrations', () => {
    return HttpResponse.json(mockIntegrations);
  }),

  http.post('/integrations', async ({ request }) => {
    const integration = await request.json();
    const newIntegration = {
      id: 'integration-' + Date.now(),
      ...integration,
      lastSync: new Date().toISOString(),
      syncCount: 0,
      errorCount: 0
    };
    
    return HttpResponse.json(newIntegration);
  }),

  http.put('/integrations/:id', async ({ request }) => {
    const integration = await request.json();
    return HttpResponse.json(integration);
  }),

  http.post('/integrations/:id/test', () => {
    return HttpResponse.json({ success: true, message: 'Integration test successful' });
  }),

  http.get('/webhooks', () => {
    return HttpResponse.json(mockWebhooks);
  }),

  http.post('/webhooks', async ({ request }) => {
    const webhook = await request.json();
    const newWebhook = {
      id: 'webhook-' + Date.now(),
      ...webhook,
      lastTriggered: new Date().toISOString(),
      triggerCount: 0,
      successRate: 1.0,
      retryCount: 0
    };
    
    return HttpResponse.json(newWebhook);
  }),

  http.get('/api-keys', () => {
    return HttpResponse.json(mockApiKeys);
  }),

  http.post('/api-keys', async ({ request }) => {
    const apiKey = await request.json();
    const newApiKey = {
      id: 'apikey-' + Date.now(),
      ...apiKey,
      lastUsed: new Date().toISOString(),
      usage: 0
    };
    
    return HttpResponse.json(newApiKey);
  }),

  http.delete('/api-keys/:id', () => {
    return HttpResponse.json({ success: true });
  })
];
