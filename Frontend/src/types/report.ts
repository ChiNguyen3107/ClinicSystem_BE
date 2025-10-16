export interface DateRange {
  from: Date;
  to: Date;
}

export interface ReportFilters {
  dateRange: DateRange;
  doctorIds?: string[];
  serviceIds?: string[];
  patientType?: 'new' | 'returning' | 'all';
  status?: 'completed' | 'cancelled' | 'pending' | 'all';
}

// Revenue Reports
export interface RevenueData {
  period: string;
  total: number;
  byDoctor: Array<{
    doctorId: string;
    doctorName: string;
    amount: number;
  }>;
  byService: Array<{
    serviceId: string;
    serviceName: string;
    amount: number;
    count: number;
  }>;
  trends: Array<{
    date: string;
    revenue: number;
    appointments: number;
  }>;
  forecast?: Array<{
    date: string;
    predicted: number;
    confidence: number;
  }>;
}

// Patient Reports
export interface PatientData {
  total: number;
  newPatients: number;
  returningPatients: number;
  byAge: Array<{
    ageGroup: string;
    count: number;
    percentage: number;
  }>;
  byGender: Array<{
    gender: string;
    count: number;
    percentage: number;
  }>;
  byLocation: Array<{
    location: string;
    count: number;
    percentage: number;
  }>;
  trends: Array<{
    date: string;
    newPatients: number;
    totalPatients: number;
  }>;
}

// Appointment Reports
export interface AppointmentData {
  total: number;
  completed: number;
  cancelled: number;
  pending: number;
  completionRate: number;
  averageWaitingTime: number; // minutes
  byDoctor: Array<{
    doctorId: string;
    doctorName: string;
    total: number;
    completed: number;
    cancelled: number;
    completionRate: number;
  }>;
  byTimeSlot: Array<{
    timeSlot: string;
    count: number;
    completionRate: number;
  }>;
  cancelReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
  trends: Array<{
    date: string;
    scheduled: number;
    completed: number;
    cancelled: number;
  }>;
}

// Service Reports
export interface ServiceData {
  topServices: Array<{
    serviceId: string;
    serviceName: string;
    usageCount: number;
    revenue: number;
    averagePrice: number;
  }>;
  topMedications: Array<{
    medicationId: string;
    medicationName: string;
    usageCount: number;
    revenue: number;
    averagePrice: number;
  }>;
  inventory: Array<{
    itemId: string;
    itemName: string;
    currentStock: number;
    minStock: number;
    status: 'low' | 'normal' | 'high';
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
}

// Export Options
export interface ExportOptions {
  format: 'excel' | 'pdf';
  includeCharts: boolean;
  dateRange: DateRange;
  sections: ('revenue' | 'patients' | 'appointments' | 'services')[];
}

// Scheduled Reports
export interface ScheduledReport {
  id: string;
  name: string;
  type: 'revenue' | 'patients' | 'appointments' | 'services' | 'all';
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  filters: ReportFilters;
  isActive: boolean;
  lastSent?: Date;
  nextSend?: Date;
}

// Dashboard Stats
export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  totalPatients: number;
  patientGrowth: number;
  totalAppointments: number;
  appointmentGrowth: number;
  completionRate: number;
  averageRevenuePerPatient: number;
  topPerformingDoctor: {
    id: string;
    name: string;
    revenue: number;
  };
  recentTrends: Array<{
    date: string;
    revenue: number;
    patients: number;
    appointments: number;
  }>;
}
