import { client } from '../axios';
import { 
  ReportFilters, 
  DashboardStats, 
  RevenueData, 
  PatientData, 
  AppointmentData, 
  ServiceData,
  ExportOptions,
  ScheduledReport
} from '@/types/report';

export class ReportService {
  // Dashboard Stats
  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await client.get('/reports/dashboard-stats');
    return response.data;
  }

  // Revenue Reports
  static async getRevenueReport(filters: ReportFilters): Promise<RevenueData> {
    const response = await client.post('/reports/revenue', filters);
    return response.data;
  }

  // Patient Reports
  static async getPatientReport(filters: ReportFilters): Promise<PatientData> {
    const response = await client.post('/reports/patients', filters);
    return response.data;
  }

  // Appointment Reports
  static async getAppointmentReport(filters: ReportFilters): Promise<AppointmentData> {
    const response = await client.post('/reports/appointments', filters);
    return response.data;
  }

  // Service Reports
  static async getServiceReport(filters: ReportFilters): Promise<ServiceData> {
    const response = await client.post('/reports/services', filters);
    return response.data;
  }

  // Export Reports
  static async exportReport(options: ExportOptions): Promise<Blob> {
    const response = await client.post('/reports/export', options, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Print Reports
  static async printReport(options: ExportOptions): Promise<void> {
    await client.post('/reports/print', options);
  }

  // Scheduled Reports
  static async getScheduledReports(): Promise<ScheduledReport[]> {
    const response = await client.get('/reports/scheduled');
    return response.data;
  }

  static async createScheduledReport(report: Omit<ScheduledReport, 'id'>): Promise<ScheduledReport> {
    const response = await client.post('/reports/scheduled', report);
    return response.data;
  }

  static async updateScheduledReport(id: string, report: Partial<ScheduledReport>): Promise<ScheduledReport> {
    const response = await client.put(`/reports/scheduled/${id}`, report);
    return response.data;
  }

  static async deleteScheduledReport(id: string): Promise<void> {
    await client.delete(`/reports/scheduled/${id}`);
  }

  static async toggleScheduledReport(id: string, isActive: boolean): Promise<ScheduledReport> {
    const response = await client.patch(`/reports/scheduled/${id}/toggle`, { isActive });
    return response.data;
  }

  // Report Templates
  static async getReportTemplates(): Promise<any[]> {
    const response = await client.get('/reports/templates');
    return response.data;
  }

  static async createReportTemplate(template: any): Promise<any> {
    const response = await client.post('/reports/templates', template);
    return response.data;
  }

  static async updateReportTemplate(id: string, template: any): Promise<any> {
    const response = await client.put(`/reports/templates/${id}`, template);
    return response.data;
  }

  static async deleteReportTemplate(id: string): Promise<void> {
    await client.delete(`/reports/templates/${id}`);
  }

  // Report Analytics
  static async getReportAnalytics(): Promise<any> {
    const response = await client.get('/reports/analytics');
    return response.data;
  }

  // Custom Reports
  static async createCustomReport(config: any): Promise<any> {
    const response = await client.post('/reports/custom', config);
    return response.data;
  }

  static async getCustomReports(): Promise<any[]> {
    const response = await client.get('/reports/custom');
    return response.data;
  }

  static async updateCustomReport(id: string, config: any): Promise<any> {
    const response = await client.put(`/reports/custom/${id}`, config);
    return response.data;
  }

  static async deleteCustomReport(id: string): Promise<void> {
    await client.delete(`/reports/custom/${id}`);
  }

  // Report Sharing
  static async shareReport(reportId: string, shareConfig: any): Promise<string> {
    const response = await client.post(`/reports/${reportId}/share`, shareConfig);
    return response.data.shareUrl;
  }

  static async getSharedReport(shareToken: string): Promise<any> {
    const response = await client.get(`/reports/shared/${shareToken}`);
    return response.data;
  }

  // Report History
  static async getReportHistory(): Promise<any[]> {
    const response = await client.get('/reports/history');
    return response.data;
  }

  static async getReportHistoryById(id: string): Promise<any> {
    const response = await client.get(`/reports/history/${id}`);
    return response.data;
  }

  // Report Favorites
  static async getFavoriteReports(): Promise<any[]> {
    const response = await client.get('/reports/favorites');
    return response.data;
  }

  static async addToFavorites(reportId: string): Promise<void> {
    await client.post(`/reports/${reportId}/favorite`);
  }

  static async removeFromFavorites(reportId: string): Promise<void> {
    await client.delete(`/reports/${reportId}/favorite`);
  }

  // Report Comments
  static async addReportComment(reportId: string, comment: string): Promise<void> {
    await client.post(`/reports/${reportId}/comments`, { comment });
  }

  static async getReportComments(reportId: string): Promise<any[]> {
    const response = await client.get(`/reports/${reportId}/comments`);
    return response.data;
  }

  static async updateReportComment(commentId: string, comment: string): Promise<void> {
    await client.put(`/reports/comments/${commentId}`, { comment });
  }

  static async deleteReportComment(commentId: string): Promise<void> {
    await client.delete(`/reports/comments/${commentId}`);
  }
}