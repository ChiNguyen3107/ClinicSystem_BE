import { apiClient } from './axios';

export interface SystemSettings {
  clinicName: string;
  clinicCode: string;
  taxCode: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  businessHours: {
    mondayToFriday: { start: string; end: string };
    saturday: { start: string; end: string; enabled: boolean };
    sunday: { start: string; end: string; enabled: boolean };
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    appointmentReminders: boolean;
    reminderTime: string;
    systemAlerts: boolean;
    maintenanceAlerts: boolean;
  };
}

export interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  avatar: string;
  bio: string;
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    theme: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    appointmentNotifications: boolean;
    systemNotifications: boolean;
    marketingEmails: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    sessionTimeout: string;
  };
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: string;
  backupCodes: string[];
  sessionTimeout: string;
  maxConcurrentSessions: string;
  requireReauthForSensitive: boolean;
  ipWhitelist: string[];
  allowedCountries: string[];
  blockSuspiciousIPs: boolean;
  auditLogging: boolean;
  logRetentionDays: string;
  alertOnSuspiciousActivity: boolean;
}

export interface IntegrationSettings {
  email: {
    provider: string;
    smtpHost: string;
    smtpPort: string;
    smtpUsername: string;
    smtpPassword: string;
    smtpEncryption: string;
    fromEmail: string;
    fromName: string;
    status: string;
  };
  sms: {
    provider: string;
    apiKey: string;
    apiSecret: string;
    fromNumber: string;
    status: string;
  };
  payment: {
    provider: string;
    merchantId: string;
    secretKey: string;
    environment: string;
    status: string;
  };
  thirdParty: {
    googleAnalytics: string;
    facebookPixel: string;
    zaloOA: string;
    telegramBot: string;
    webhookUrl: string;
  };
}

export interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: string;
  backupTime: string;
  backupRetention: string;
  cloudBackup: boolean;
  localBackup: boolean;
  exportFormat: string;
  includeFiles: boolean;
  includeImages: boolean;
  allowImport: boolean;
  requireValidation: boolean;
  backupBeforeImport: boolean;
}

export interface BackupHistory {
  id: number;
  date: string;
  type: string;
  size: string;
  status: string;
  location: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  ip: string;
  status: string;
  details: string;
}

export const settingsService = {
  // System Settings
  getSystemSettings: async (): Promise<SystemSettings> => {
    const response = await apiClient.get('/api/settings/system');
    return response.data;
  },

  updateSystemSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    const response = await apiClient.put('/api/settings/system', settings);
    return response.data;
  },

  // User Settings
  getUserSettings: async (): Promise<UserSettings> => {
    const response = await apiClient.get('/api/settings/user');
    return response.data;
  },

  updateUserSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    const response = await apiClient.put('/api/settings/user', settings);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/api/settings/user/change-password', {
      currentPassword,
      newPassword
    });
  },

  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post('/api/settings/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Security Settings
  getSecuritySettings: async (): Promise<SecuritySettings> => {
    const response = await apiClient.get('/api/settings/security');
    return response.data;
  },

  updateSecuritySettings: async (settings: Partial<SecuritySettings>): Promise<SecuritySettings> => {
    const response = await apiClient.put('/api/settings/security', settings);
    return response.data;
  },

  enable2FA: async (method: string): Promise<{ qrCode: string; backupCodes: string[] }> => {
    const response = await apiClient.post('/api/settings/security/2fa/enable', { method });
    return response.data;
  },

  disable2FA: async (): Promise<void> => {
    await apiClient.post('/api/settings/security/2fa/disable');
  },

  generateBackupCodes: async (): Promise<string[]> => {
    const response = await apiClient.post('/api/settings/security/2fa/backup-codes');
    return response.data;
  },

  getAuditLogs: async (page: number = 1, limit: number = 50): Promise<{ logs: AuditLog[]; total: number }> => {
    const response = await apiClient.get(`/api/settings/security/audit-logs?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Integration Settings
  getIntegrationSettings: async (): Promise<IntegrationSettings> => {
    const response = await apiClient.get('/api/settings/integration');
    return response.data;
  },

  updateIntegrationSettings: async (settings: Partial<IntegrationSettings>): Promise<IntegrationSettings> => {
    const response = await apiClient.put('/api/settings/integration', settings);
    return response.data;
  },

  testConnection: async (service: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post(`/api/settings/integration/test/${service}`);
    return response.data;
  },

  // Backup Settings
  getBackupSettings: async (): Promise<BackupSettings> => {
    const response = await apiClient.get('/api/settings/backup');
    return response.data;
  },

  updateBackupSettings: async (settings: Partial<BackupSettings>): Promise<BackupSettings> => {
    const response = await apiClient.put('/api/settings/backup', settings);
    return response.data;
  },

  getBackupHistory: async (): Promise<BackupHistory[]> => {
    const response = await apiClient.get('/api/settings/backup/history');
    return response.data;
  },

  createBackup: async (): Promise<{ id: number; status: string }> => {
    const response = await apiClient.post('/api/settings/backup/create');
    return response.data;
  },

  restoreBackup: async (backupId: number): Promise<void> => {
    await apiClient.post(`/api/settings/backup/restore/${backupId}`);
  },

  deleteBackup: async (backupId: number): Promise<void> => {
    await apiClient.delete(`/api/settings/backup/${backupId}`);
  },

  exportData: async (format: string, options: { includeFiles: boolean; includeImages: boolean }): Promise<{ downloadUrl: string }> => {
    const response = await apiClient.post('/api/settings/backup/export', { format, ...options });
    return response.data;
  },

  importData: async (file: File): Promise<{ status: string; message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/settings/backup/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
