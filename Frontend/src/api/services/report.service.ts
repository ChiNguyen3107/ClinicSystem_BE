import { 
  ReportFilters, 
  RevenueData, 
  PatientData, 
  AppointmentData, 
  ServiceData, 
  DashboardStats,
  ScheduledReport,
  ExportOptions 
} from '@/types/report';

// Mock data generators
const generateRevenueData = (filters: ReportFilters): RevenueData => {
  const days = Math.ceil((filters.dateRange.to.getTime() - filters.dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    period: `${filters.dateRange.from.toLocaleDateString()} - ${filters.dateRange.to.toLocaleDateString()}`,
    total: Math.floor(Math.random() * 50000000) + 10000000, // 10M - 60M VND
    byDoctor: [
      { doctorId: '1', doctorName: 'BS. Nguyễn Văn A', amount: Math.floor(Math.random() * 15000000) + 5000000 },
      { doctorId: '2', doctorName: 'BS. Trần Thị B', amount: Math.floor(Math.random() * 12000000) + 4000000 },
      { doctorId: '3', doctorName: 'BS. Lê Văn C', amount: Math.floor(Math.random() * 10000000) + 3000000 },
    ],
    byService: [
      { serviceId: '1', serviceName: 'Khám tổng quát', amount: Math.floor(Math.random() * 8000000) + 2000000, count: Math.floor(Math.random() * 200) + 50 },
      { serviceId: '2', serviceName: 'Xét nghiệm máu', amount: Math.floor(Math.random() * 6000000) + 1500000, count: Math.floor(Math.random() * 150) + 30 },
      { serviceId: '3', serviceName: 'Siêu âm', amount: Math.floor(Math.random() * 4000000) + 1000000, count: Math.floor(Math.random() * 100) + 20 },
    ],
    trends: Array.from({ length: days }, (_, i) => {
      const date = new Date(filters.dateRange.from);
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 2000000) + 500000,
        appointments: Math.floor(Math.random() * 20) + 5,
      };
    }),
    forecast: Array.from({ length: 7 }, (_, i) => {
      const date = new Date(filters.dateRange.to);
      date.setDate(date.getDate() + i + 1);
      return {
        date: date.toISOString().split('T')[0],
        predicted: Math.floor(Math.random() * 2000000) + 500000,
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
      };
    }),
  };
};

const generatePatientData = (filters: ReportFilters): PatientData => {
  const total = Math.floor(Math.random() * 500) + 200;
  const newPatients = Math.floor(total * (Math.random() * 0.4 + 0.2)); // 20-60% new patients
  
  return {
    total,
    newPatients,
    returningPatients: total - newPatients,
    byAge: [
      { ageGroup: '0-18', count: Math.floor(total * 0.15), percentage: 15 },
      { ageGroup: '19-35', count: Math.floor(total * 0.35), percentage: 35 },
      { ageGroup: '36-50', count: Math.floor(total * 0.25), percentage: 25 },
      { ageGroup: '51-65', count: Math.floor(total * 0.15), percentage: 15 },
      { ageGroup: '65+', count: Math.floor(total * 0.10), percentage: 10 },
    ],
    byGender: [
      { gender: 'Nam', count: Math.floor(total * 0.45), percentage: 45 },
      { gender: 'Nữ', count: Math.floor(total * 0.55), percentage: 55 },
    ],
    byLocation: [
      { location: 'TP.HCM', count: Math.floor(total * 0.40), percentage: 40 },
      { location: 'Hà Nội', count: Math.floor(total * 0.25), percentage: 25 },
      { location: 'Đà Nẵng', count: Math.floor(total * 0.15), percentage: 15 },
      { location: 'Khác', count: Math.floor(total * 0.20), percentage: 20 },
    ],
    trends: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 29 + i);
      return {
        date: date.toISOString().split('T')[0],
        newPatients: Math.floor(Math.random() * 10) + 1,
        totalPatients: Math.floor(Math.random() * 20) + 5,
      };
    }),
  };
};

const generateAppointmentData = (filters: ReportFilters): AppointmentData => {
  const total = Math.floor(Math.random() * 300) + 100;
  const completed = Math.floor(total * (Math.random() * 0.2 + 0.7)); // 70-90% completion
  const cancelled = total - completed - Math.floor(Math.random() * 10);
  const pending = total - completed - cancelled;
  
  return {
    total,
    completed,
    cancelled,
    pending,
    completionRate: (completed / total) * 100,
    averageWaitingTime: Math.floor(Math.random() * 30) + 10, // 10-40 minutes
    byDoctor: [
      { doctorId: '1', doctorName: 'BS. Nguyễn Văn A', total: Math.floor(total * 0.4), completed: Math.floor(completed * 0.4), cancelled: Math.floor(cancelled * 0.4), completionRate: Math.random() * 20 + 70 },
      { doctorId: '2', doctorName: 'BS. Trần Thị B', total: Math.floor(total * 0.35), completed: Math.floor(completed * 0.35), cancelled: Math.floor(cancelled * 0.35), completionRate: Math.random() * 20 + 70 },
      { doctorId: '3', doctorName: 'BS. Lê Văn C', total: Math.floor(total * 0.25), completed: Math.floor(completed * 0.25), cancelled: Math.floor(cancelled * 0.25), completionRate: Math.random() * 20 + 70 },
    ],
    byTimeSlot: [
      { timeSlot: '8:00-10:00', count: Math.floor(total * 0.3), completionRate: Math.random() * 20 + 70 },
      { timeSlot: '10:00-12:00', count: Math.floor(total * 0.25), completionRate: Math.random() * 20 + 70 },
      { timeSlot: '14:00-16:00', count: Math.floor(total * 0.25), completionRate: Math.random() * 20 + 70 },
      { timeSlot: '16:00-18:00', count: Math.floor(total * 0.2), completionRate: Math.random() * 20 + 70 },
    ],
    cancelReasons: [
      { reason: 'Bệnh nhân hủy', count: Math.floor(cancelled * 0.4), percentage: 40 },
      { reason: 'Bác sĩ nghỉ', count: Math.floor(cancelled * 0.2), percentage: 20 },
      { reason: 'Khẩn cấp', count: Math.floor(cancelled * 0.15), percentage: 15 },
      { reason: 'Khác', count: Math.floor(cancelled * 0.25), percentage: 25 },
    ],
    trends: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 29 + i);
      return {
        date: date.toISOString().split('T')[0],
        scheduled: Math.floor(Math.random() * 15) + 5,
        completed: Math.floor(Math.random() * 12) + 4,
        cancelled: Math.floor(Math.random() * 3) + 1,
      };
    }),
  };
};

const generateServiceData = (filters: ReportFilters): ServiceData => {
  return {
    topServices: [
      { serviceId: '1', serviceName: 'Khám tổng quát', usageCount: Math.floor(Math.random() * 200) + 100, revenue: Math.floor(Math.random() * 8000000) + 2000000, averagePrice: 150000 },
      { serviceId: '2', serviceName: 'Xét nghiệm máu', usageCount: Math.floor(Math.random() * 150) + 50, revenue: Math.floor(Math.random() * 6000000) + 1500000, averagePrice: 200000 },
      { serviceId: '3', serviceName: 'Siêu âm', usageCount: Math.floor(Math.random() * 100) + 30, revenue: Math.floor(Math.random() * 4000000) + 1000000, averagePrice: 300000 },
      { serviceId: '4', serviceName: 'Chụp X-quang', usageCount: Math.floor(Math.random() * 80) + 20, revenue: Math.floor(Math.random() * 3000000) + 800000, averagePrice: 250000 },
    ],
    topMedications: [
      { medicationId: '1', medicationName: 'Paracetamol', usageCount: Math.floor(Math.random() * 300) + 100, revenue: Math.floor(Math.random() * 2000000) + 500000, averagePrice: 50000 },
      { medicationId: '2', medicationName: 'Amoxicillin', usageCount: Math.floor(Math.random() * 200) + 80, revenue: Math.floor(Math.random() * 1500000) + 400000, averagePrice: 80000 },
      { medicationId: '3', medicationName: 'Vitamin C', usageCount: Math.floor(Math.random() * 150) + 50, revenue: Math.floor(Math.random() * 1000000) + 300000, averagePrice: 60000 },
    ],
    inventory: [
      { itemId: '1', itemName: 'Paracetamol 500mg', currentStock: 150, minStock: 50, status: 'normal' },
      { itemId: '2', itemName: 'Amoxicillin 250mg', currentStock: 30, minStock: 50, status: 'low' },
      { itemId: '3', itemName: 'Vitamin C 1000mg', currentStock: 200, minStock: 100, status: 'high' },
      { itemId: '4', itemName: 'Ibuprofen 400mg', currentStock: 25, minStock: 30, status: 'low' },
    ],
    revenueByCategory: [
      { category: 'Khám bệnh', revenue: Math.floor(Math.random() * 20000000) + 5000000, percentage: 60 },
      { category: 'Xét nghiệm', revenue: Math.floor(Math.random() * 10000000) + 3000000, percentage: 25 },
      { category: 'Thuốc', revenue: Math.floor(Math.random() * 5000000) + 1000000, percentage: 15 },
    ],
  };
};

// API Service
export class ReportService {
  static async getDashboardStats(): Promise<DashboardStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalRevenue: Math.floor(Math.random() * 50000000) + 10000000,
      revenueGrowth: Math.random() * 20 - 10, // -10% to +10%
      totalPatients: Math.floor(Math.random() * 1000) + 500,
      patientGrowth: Math.random() * 15 - 5, // -5% to +15%
      totalAppointments: Math.floor(Math.random() * 2000) + 1000,
      appointmentGrowth: Math.random() * 10 - 5, // -5% to +10%
      completionRate: Math.random() * 20 + 70, // 70-90%
      averageRevenuePerPatient: Math.floor(Math.random() * 200000) + 50000,
      topPerformingDoctor: {
        id: '1',
        name: 'BS. Nguyễn Văn A',
        revenue: Math.floor(Math.random() * 10000000) + 5000000,
      },
      recentTrends: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 6 + i);
        return {
          date: date.toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 2000000) + 500000,
          patients: Math.floor(Math.random() * 20) + 5,
          appointments: Math.floor(Math.random() * 25) + 10,
        };
      }),
    };
  }

  static async getRevenueReport(filters: ReportFilters): Promise<RevenueData> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateRevenueData(filters);
  }

  static async getPatientReport(filters: ReportFilters): Promise<PatientData> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return generatePatientData(filters);
  }

  static async getAppointmentReport(filters: ReportFilters): Promise<AppointmentData> {
    await new Promise(resolve => setTimeout(resolve, 700));
    return generateAppointmentData(filters);
  }

  static async getServiceReport(filters: ReportFilters): Promise<ServiceData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateServiceData(filters);
  }

  static async getScheduledReports(): Promise<ScheduledReport[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        name: 'Báo cáo doanh thu hàng ngày',
        type: 'revenue',
        frequency: 'daily',
        recipients: ['admin@clinic.com', 'manager@clinic.com'],
        filters: {
          dateRange: {
            from: new Date(Date.now() - 24 * 60 * 60 * 1000),
            to: new Date(),
          },
        },
        isActive: true,
        lastSent: new Date(Date.now() - 2 * 60 * 60 * 1000),
        nextSend: new Date(Date.now() + 22 * 60 * 60 * 1000),
      },
      {
        id: '2',
        name: 'Báo cáo bệnh nhân hàng tuần',
        type: 'patients',
        frequency: 'weekly',
        recipients: ['admin@clinic.com'],
        filters: {
          dateRange: {
            from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            to: new Date(),
          },
        },
        isActive: true,
        lastSent: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        nextSend: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  static async createScheduledReport(report: Omit<ScheduledReport, 'id'>): Promise<ScheduledReport> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      ...report,
      id: Math.random().toString(36).substr(2, 9),
    };
  }

  static async updateScheduledReport(id: string, updates: Partial<ScheduledReport>): Promise<ScheduledReport> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const reports = await this.getScheduledReports();
    const report = reports.find(r => r.id === id);
    if (!report) throw new Error('Report not found');
    
    return { ...report, ...updates };
  }

  static async deleteScheduledReport(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  static async exportReport(options: ExportOptions): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate file generation
    const content = `Báo cáo ${options.format.toUpperCase()}\nThời gian: ${options.dateRange.from.toLocaleDateString()} - ${options.dateRange.to.toLocaleDateString()}\nCác phần: ${options.sections.join(', ')}`;
    
    if (options.format === 'excel') {
      return new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    } else {
      return new Blob([content], { type: 'application/pdf' });
    }
  }
}
