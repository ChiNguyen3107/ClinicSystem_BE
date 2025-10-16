export interface ReportFilters {
  dateRange: {
    from: Date;
    to: Date;
  };
  doctorId?: string;
  status?: string;
  customFilters?: Record<string, any>;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  totalPatients: number;
  patientGrowth: number;
  totalAppointments: number;
  appointmentGrowth: number;
  completionRate: number;
  topPerformingDoctor: {
    name: string;
    revenue: number;
  };
  averageRevenuePerPatient: number;
}

export interface RevenueData {
  summary: {
    total: number;
    growth: number;
    average: number;
  };
  chartData: Array<{
    date: string;
    revenue: number;
    appointments: number;
  }>;
  byDoctor: Array<{
    doctorName: string;
    revenue: number;
    percentage: number;
  }>;
  byService: Array<{
    serviceName: string;
    revenue: number;
    count: number;
  }>;
}

export interface PatientData {
  summary: {
    total: number;
    new: number;
    returning: number;
    growth: number;
  };
  chartData: Array<{
    date: string;
    newPatients: number;
    totalPatients: number;
  }>;
  byAgeGroup: Array<{
    ageGroup: string;
    count: number;
    percentage: number;
  }>;
  byGender: Array<{
    gender: string;
    count: number;
    percentage: number;
  }>;
}

export interface AppointmentData {
  summary: {
    total: number;
    completed: number;
    cancelled: number;
    noShow: number;
    completionRate: number;
  };
  chartData: Array<{
    date: string;
    scheduled: number;
    completed: number;
    cancelled: number;
  }>;
  byStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  byTimeSlot: Array<{
    timeSlot: string;
    count: number;
    percentage: number;
  }>;
}

export interface ServiceData {
  summary: {
    totalServices: number;
    totalRevenue: number;
    averagePrice: number;
    growth: number;
  };
  chartData: Array<{
    serviceName: string;
    count: number;
    revenue: number;
  }>;
  byCategory: Array<{
    category: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
  popularServices: Array<{
    serviceName: string;
    count: number;
    revenue: number;
    growth: number;
  }>;
}

export interface ExportOptions {
  format: 'excel' | 'pdf' | 'csv' | 'print';
  includeCharts: boolean;
  dateRange: {
    from: Date;
    to: Date;
  };
  sections: string[];
}

export interface ScheduledReport {
  id: string;
  name: string;
  type: string;
  schedule: string;
  email: string;
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
}