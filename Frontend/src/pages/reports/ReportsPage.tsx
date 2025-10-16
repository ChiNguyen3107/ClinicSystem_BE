import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterBar } from '@/components/reports/FilterBar';
import { 
  RevenueChart, 
  PatientChart, 
  AppointmentChart, 
  ServiceChart 
} from '@/components/reports/ChartSuite';
import { ReportService } from '@/api/services/report.service';
import { 
  ReportFilters, 
  RevenueData, 
  PatientData, 
  AppointmentData, 
  ServiceData,
  DashboardStats 
} from '@/types/report';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Package,
  Download,
  RefreshCw
} from 'lucide-react';

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    },
  });

  // Load dashboard stats on mount
  useEffect(() => {
    loadDashboardStats();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (activeTab !== 'dashboard') {
      loadReportData(activeTab);
    }
  }, [activeTab, filters]);

  const loadDashboardStats = async () => {
    setIsLoading(true);
    try {
      const stats = await ReportService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReportData = async (reportType: string) => {
    setIsLoading(true);
    try {
      switch (reportType) {
        case 'revenue':
          const revenue = await ReportService.getRevenueReport(filters);
          setRevenueData(revenue);
          break;
        case 'patients':
          const patients = await ReportService.getPatientReport(filters);
          setPatientData(patients);
          break;
        case 'appointments':
          const appointments = await ReportService.getAppointmentReport(filters);
          setAppointmentData(appointments);
          break;
        case 'services':
          const services = await ReportService.getServiceReport(filters);
          setServiceData(services);
          break;
      }
    } catch (error) {
      console.error(`Error loading ${reportType} report:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: ReportFilters) => {
    setFilters(newFilters);
  };

  const handleExport = async () => {
    try {
      const blob = await ReportService.exportReport({
        format: 'excel',
        includeCharts: true,
        dateRange: filters.dateRange,
        sections: [activeTab as any],
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bao-cao-${activeTab}-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const handleSchedule = () => {
    // TODO: Implement schedule report dialog
    console.log('Schedule report');
  };

  const handleRefresh = () => {
    if (activeTab === 'dashboard') {
      loadDashboardStats();
    } else {
      loadReportData(activeTab);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    growth, 
    icon: Icon, 
    isLoading: cardLoading = false 
  }: {
    title: string;
    value: string | number;
    growth?: number;
    icon: React.ComponentType<{ className?: string }>;
    isLoading?: boolean;
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {cardLoading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
            {growth !== undefined && !cardLoading && (
              <div className="flex items-center mt-1">
                <Badge 
                  variant={growth >= 0 ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                </Badge>
              </div>
            )}
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Báo cáo & Thống kê</h1>
          <p className="text-muted-foreground">
            Phân tích dữ liệu và xu hướng của phòng khám
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button onClick={handleExport} disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
        onSchedule={handleSchedule}
        isLoading={isLoading}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Tổng quan</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="patients">Bệnh nhân</TabsTrigger>
          <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
          <TabsTrigger value="services">Dịch vụ</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : dashboardStats ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Tổng doanh thu"
                  value={`${dashboardStats.totalRevenue.toLocaleString('vi-VN')} VND`}
                  growth={dashboardStats.revenueGrowth}
                  icon={TrendingUp}
                />
                <StatCard
                  title="Tổng bệnh nhân"
                  value={dashboardStats.totalPatients}
                  growth={dashboardStats.patientGrowth}
                  icon={Users}
                />
                <StatCard
                  title="Tổng lịch hẹn"
                  value={dashboardStats.totalAppointments}
                  growth={dashboardStats.appointmentGrowth}
                  icon={Calendar}
                />
                <StatCard
                  title="Tỷ lệ hoàn thành"
                  value={`${dashboardStats.completionRate.toFixed(1)}%`}
                  icon={Package}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bác sĩ có hiệu suất cao nhất</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {dashboardStats.topPerformingDoctor.name}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Doanh thu: {dashboardStats.topPerformingDoctor.revenue.toLocaleString('vi-VN')} VND
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Doanh thu trung bình/bệnh nhân</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {dashboardStats.averageRevenuePerPatient.toLocaleString('vi-VN')} VND
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : null}
        </TabsContent>

        <TabsContent value="revenue">
          {revenueData ? (
            <RevenueChart data={revenueData} isLoading={isLoading} />
          ) : isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="patients">
          {patientData ? (
            <PatientChart data={patientData} isLoading={isLoading} />
          ) : isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="appointments">
          {appointmentData ? (
            <AppointmentChart data={appointmentData} isLoading={isLoading} />
          ) : isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="services">
          {serviceData ? (
            <ServiceChart data={serviceData} isLoading={isLoading} />
          ) : isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
