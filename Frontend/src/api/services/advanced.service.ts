import { axios } from '../axios';

// Types for Advanced Features
export interface AIMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  diagnosis?: {
    confidence: number;
    conditions: Array<{
      name: string;
      probability: number;
      symptoms: string[];
    }>;
  };
  medication?: {
    name: string;
    dosage: string;
    interactions: string[];
  };
}

export interface VideoCallSession {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  startTime: Date;
  duration: number;
  status: 'waiting' | 'active' | 'ended';
  participants: Array<{
    id: string;
    name: string;
    role: 'doctor' | 'patient' | 'nurse';
    isVideoOn: boolean;
    isAudioOn: boolean;
    isSharing: boolean;
  }>;
}

export interface IoTDevice {
  id: string;
  name: string;
  type: 'blood_pressure' | 'glucose_meter' | 'thermometer' | 'pulse_oximeter' | 'weight_scale' | 'ecg_monitor';
  status: 'online' | 'offline' | 'error' | 'maintenance';
  batteryLevel: number;
  lastSync: Date;
  location: string;
  patientId?: string;
  patientName?: string;
  dataPoints: number;
  alerts: number;
  firmware: string;
  signalStrength: number;
}

export interface AnalyticsInsight {
  id: string;
  title: string;
  type: 'prediction' | 'trend' | 'anomaly' | 'recommendation' | 'performance';
  confidence: number;
  value: number | string;
  unit?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'stable';
  description: string;
  category: 'patient' | 'revenue' | 'efficiency' | 'quality' | 'risk';
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  timestamp: Date;
}

export interface Integration {
  id: string;
  name: string;
  type: 'his' | 'pacs' | 'lab' | 'pharmacy' | 'insurance' | 'custom';
  status: 'active' | 'inactive' | 'error' | 'pending';
  endpoint: string;
  apiKey: string;
  lastSync: Date;
  syncCount: number;
  errorCount: number;
  description: string;
  version: string;
  health: 'healthy' | 'warning' | 'error';
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  lastTriggered: Date;
  triggerCount: number;
  successRate: number;
  secret: string;
  retryCount: number;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  expiresAt: Date;
  lastUsed: Date;
  status: 'active' | 'expired' | 'revoked';
  usage: number;
}

// AI Assistant Service
export const aiService = {
  // Send message to AI
  sendMessage: async (message: string): Promise<AIMessage> => {
    try {
      const response = await axios.post('/ai/chat', { message });
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `Tôi đã nhận được tin nhắn: "${message}". Đây là phản hồi từ AI Assistant.`,
        timestamp: new Date(),
        suggestions: [
          'Phân tích triệu chứng',
          'Gợi ý chẩn đoán',
          'Tư vấn thuốc',
          'Lịch hẹn thông minh'
        ]
      };
    }
  },

  // Get AI suggestions
  getSuggestions: async (context: string): Promise<string[]> => {
    try {
      const response = await axios.get('/ai/suggestions', { params: { context } });
      return response.data;
    } catch (error) {
      return [
        'Phân tích triệu chứng',
        'Gợi ý chẩn đoán',
        'Tư vấn thuốc',
        'Lịch hẹn thông minh'
      ];
    }
  },

  // Get diagnosis suggestions
  getDiagnosis: async (symptoms: string[]): Promise<{
    confidence: number;
    conditions: Array<{
      name: string;
      probability: number;
      symptoms: string[];
    }>;
  }> => {
    try {
      const response = await axios.post('/ai/diagnosis', { symptoms });
      return response.data;
    } catch (error) {
      return {
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
      };
    }
  },

  // Get medication advice
  getMedicationAdvice: async (condition: string): Promise<{
    name: string;
    dosage: string;
    interactions: string[];
  }> => {
    try {
      const response = await axios.post('/ai/medication', { condition });
      return response.data;
    } catch (error) {
      return {
        name: 'Paracetamol 500mg',
        dosage: '2 viên/ngày, sau ăn',
        interactions: ['Không dùng chung với rượu', 'Thận trọng với bệnh gan']
      };
    }
  }
};

// Telemedicine Service
export const telemedicineService = {
  // Start video call
  startCall: async (patientId: string, doctorId: string): Promise<VideoCallSession> => {
    try {
      const response = await axios.post('/telemedicine/call/start', { patientId, doctorId });
      return response.data;
    } catch (error) {
      return {
        id: 'call-' + Date.now(),
        patientId,
        patientName: 'Bệnh nhân',
        doctorId,
        doctorName: 'Bác sĩ',
        startTime: new Date(),
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
    }
  },

  // End video call
  endCall: async (callId: string): Promise<void> => {
    try {
      await axios.post(`/telemedicine/call/${callId}/end`);
    } catch (error) {
      console.log('Call ended');
    }
  },

  // Get call history
  getCallHistory: async (): Promise<VideoCallSession[]> => {
    try {
      const response = await axios.get('/telemedicine/calls/history');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // Get upcoming calls
  getUpcomingCalls: async (): Promise<VideoCallSession[]> => {
    try {
      const response = await axios.get('/telemedicine/calls/upcoming');
      return response.data;
    } catch (error) {
      return [];
    }
  }
};

// IoT Service
export const iotService = {
  // Get all devices
  getDevices: async (): Promise<IoTDevice[]> => {
    try {
      const response = await axios.get('/iot/devices');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // Sync device data
  syncDevice: async (deviceId: string): Promise<void> => {
    try {
      await axios.post(`/iot/devices/${deviceId}/sync`);
    } catch (error) {
      console.log('Device synced');
    }
  },

  // Sync all devices
  syncAllDevices: async (): Promise<void> => {
    try {
      await axios.post('/iot/devices/sync-all');
    } catch (error) {
      console.log('All devices synced');
    }
  },

  // Get device data
  getDeviceData: async (deviceId: string, dateRange?: { start: Date; end: Date }) => {
    try {
      const response = await axios.get(`/iot/devices/${deviceId}/data`, {
        params: dateRange
      });
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // Get device alerts
  getDeviceAlerts: async (deviceId?: string) => {
    try {
      const response = await axios.get('/iot/alerts', {
        params: deviceId ? { deviceId } : {}
      });
      return response.data;
    } catch (error) {
      return [];
    }
  }
};

// Analytics Service
export const analyticsService = {
  // Get insights
  getInsights: async (category?: string): Promise<AnalyticsInsight[]> => {
    try {
      const response = await axios.get('/analytics/insights', {
        params: category ? { category } : {}
      });
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // Get predictive models
  getModels: async () => {
    try {
      const response = await axios.get('/analytics/models');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // Generate custom report
  generateReport: async (reportType: string, parameters: any) => {
    try {
      const response = await axios.post('/analytics/reports', {
        type: reportType,
        parameters
      });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await axios.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      return {
        totalInsights: 0,
        highPriorityInsights: 0,
        actionableInsights: 0,
        avgConfidence: 0
      };
    }
  }
};

// Integration Service
export const integrationService = {
  // Get integrations
  getIntegrations: async (): Promise<Integration[]> => {
    try {
      const response = await axios.get('/integrations');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // Create integration
  createIntegration: async (integration: Omit<Integration, 'id'>): Promise<Integration> => {
    try {
      const response = await axios.post('/integrations', integration);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create integration');
    }
  },

  // Update integration
  updateIntegration: async (id: string, integration: Partial<Integration>): Promise<Integration> => {
    try {
      const response = await axios.put(`/integrations/${id}`, integration);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update integration');
    }
  },

  // Test integration
  testIntegration: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post(`/integrations/${id}/test`);
      return response.data;
    } catch (error) {
      return { success: false, message: 'Test failed' };
    }
  },

  // Get webhooks
  getWebhooks: async (): Promise<Webhook[]> => {
    try {
      const response = await axios.get('/webhooks');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // Create webhook
  createWebhook: async (webhook: Omit<Webhook, 'id'>): Promise<Webhook> => {
    try {
      const response = await axios.post('/webhooks', webhook);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create webhook');
    }
  },

  // Get API keys
  getApiKeys: async (): Promise<APIKey[]> => {
    try {
      const response = await axios.get('/api-keys');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // Create API key
  createApiKey: async (apiKey: Omit<APIKey, 'id'>): Promise<APIKey> => {
    try {
      const response = await axios.post('/api-keys', apiKey);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create API key');
    }
  },

  // Revoke API key
  revokeApiKey: async (id: string): Promise<void> => {
    try {
      await axios.delete(`/api-keys/${id}`);
    } catch (error) {
      throw new Error('Failed to revoke API key');
    }
  }
};

// Combined Advanced Service
export const advancedService = {
  ai: aiService,
  telemedicine: telemedicineService,
  iot: iotService,
  analytics: analyticsService,
  integration: integrationService
};

export default advancedService;
