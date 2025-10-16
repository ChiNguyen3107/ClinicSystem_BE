import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  Users,
  AlertTriangle,
  TrendingUp,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  DollarSign,
  Activity,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import components
import StatCard from '@/components/dashboard/StatCard';
import MiniTable from '@/components/dashboard/MiniTable';
import ChartCard from '@/components/dashboard/ChartCard';
import StatsCards from '@/components/dashboard/StatsCards';

// Import services
import { dashboardService } from '@/api/dashboard.service';
import { DashboardPeriod } from '@/types';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState<DashboardPeriod>('month');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // State for dashboard data
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [patientData, setPatientData] = useState<any[]>([]);
  const [doctorStats, setDoctorStats] = useState<any[]>([]);
  const [serviceStats, setServiceStats] = useState<any[]>([]);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        todayAppts,
        upcomingAppts,
        pendingTasksData,
        revenueChartData,
        patientChartData,
        doctorStatsData,
        serviceStatsData
      ] = await Promise.all([
        dashboardService.getTodayAppointments(),
        dashboardService.getUpcomingAppointments(),
        dashboardService.getPendingTasks(),
        dashboardService.getRevenueChart(period),
        dashboardService.getPatientChart(period),
        dashboardService.getDoctorStats(),
        dashboardService.getServiceStats()
      ]);

      setTodayAppointments(todayAppts.data || []);
      setUpcomingAppointments(upcomingAppts.data || []);
      setPendingTasks(pendingTasksData.data || []);
      setRevenueData(revenueChartData.data || []);
      setPatientData(patientChartData.data || []);
      setDoctorStats(doctorStatsData.data || []);
      setServiceStats(serviceStatsData.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Export data
  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export dashboard data');
  };

  // Quick actions
  const handleQuickAction = (action: string, id: number) => {
    switch (action) {
      case 'view':
        navigate(`/appointments/${id}`);
        break;
      case 'edit':
        navigate(`/appointments/${id}/edit`);
        break;
      case 'cancel':
        // TODO: Implement cancel appointment
        console.log('Cancel appointment:', id);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  // Format revenue data for display
  const formatRevenue = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Tổng quan về hoạt động của phòng khám
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Khoảng thời gian:</span>
        <Tabs value={period} onValueChange={(value) => setPeriod(value as DashboardPeriod)}>
          <TabsList>
            <TabsTrigger value="today">Hôm nay</TabsTrigger>
            <TabsTrigger value="week">Tuần</TabsTrigger>
            <TabsTrigger value="month">Tháng</TabsTrigger>
            <TabsTrigger value="year">Năm</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Cards */}
      <StatsCards period={period} />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          <TabsTrigger value="tasks">Công việc</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Today's Appointments */}
            <MiniTable
              title="Lịch hẹn hôm nay"
              description="Các cuộc hẹn trong ngày"
              items={todayAppointments.map(appt => ({
                id: appt.id,
                title: appt.patient,
                subtitle: appt.doctor,
                status: appt.status,
                time: appt.time,
                priority: appt.priority,
                actions: [
                  {
                    label: 'Xem',
                    icon: <Eye className="w-4 h-4" />,
                    onClick: () => handleQuickAction('view', appt.id)
                  },
                  {
                    label: 'Sửa',
                    icon: <Edit className="w-4 h-4" />,
                    onClick: () => handleQuickAction('edit', appt.id)
                  }
                ]
              }))}
              loading={loading}
              onViewAll={() => navigate('/appointments')}
            />

            {/* Upcoming Appointments */}
            <MiniTable
              title="Lịch hẹn sắp tới"
              description="Các cuộc hẹn trong 3 ngày tới"
              items={upcomingAppointments.map(appt => ({
                id: appt.id,
                title: appt.patient,
                subtitle: appt.doctor,
                status: appt.status,
                time: appt.time,
                date: appt.date,
                priority: appt.priority,
                actions: [
                  {
                    label: 'Xem',
                    icon: <Eye className="w-4 h-4" />,
                    onClick: () => handleQuickAction('view', appt.id)
                  }
                ]
              }))}
              loading={loading}
              onViewAll={() => navigate('/appointments')}
            />

            {/* Pending Tasks */}
            <MiniTable
              title="Công việc chờ xử lý"
              description="Các nhiệm vụ cần chú ý"
              items={pendingTasks.map(task => ({
                id: task.id,
                title: task.title,
                subtitle: task.subtitle,
                status: task.status,
                priority: task.priority,
                time: task.time,
                actions: [
                  {
                    label: 'Xử lý',
                    icon: <CheckCircle className="w-4 h-4" />,
                    onClick: () => console.log('Handle task:', task.id)
                  }
                ]
              }))}
              loading={loading}
              onViewAll={() => setActiveTab('tasks')}
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard
              title="Doanh thu theo tháng"
              description="Biểu đồ doanh thu và số bệnh nhân"
              data={revenueData}
              type="line"
              loading={loading}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />

            <ChartCard
              title="Bệnh nhân theo ngày trong tuần"
              description="Thống kê bệnh nhân và lịch hẹn"
              data={patientData}
              type="bar"
              loading={loading}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <MiniTable
              title="Lịch hẹn hôm nay"
              description="Tất cả lịch hẹn trong ngày"
              items={todayAppointments.map(appt => ({
                id: appt.id,
                title: appt.patient,
                subtitle: appt.doctor,
                status: appt.status,
                time: appt.time,
                priority: appt.priority,
                actions: [
                  {
                    label: 'Xem',
                    icon: <Eye className="w-4 h-4" />,
                    onClick: () => handleQuickAction('view', appt.id)
                  },
                  {
                    label: 'Sửa',
                    icon: <Edit className="w-4 h-4" />,
                    onClick: () => handleQuickAction('edit', appt.id)
                  }
                ]
              }))}
              loading={loading}
              maxItems={10}
            />

            <MiniTable
              title="Lịch hẹn sắp tới"
              description="Các cuộc hẹn trong tuần tới"
              items={upcomingAppointments.map(appt => ({
                id: appt.id,
                title: appt.patient,
                subtitle: appt.doctor,
                status: appt.status,
                time: appt.time,
                date: appt.date,
                priority: appt.priority,
                actions: [
                  {
                    label: 'Xem',
                    icon: <Eye className="w-4 h-4" />,
                    onClick: () => handleQuickAction('view', appt.id)
                  }
                ]
              }))}
              loading={loading}
              maxItems={10}
            />
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard
              title="Thống kê bác sĩ"
              description="Số lịch hẹn và bệnh nhân theo bác sĩ"
              data={doctorStats}
              type="bar"
              loading={loading}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />

            <ChartCard
              title="Phân bố dịch vụ"
              description="Tỷ lệ các loại dịch vụ"
              data={serviceStats}
              type="pie"
              loading={loading}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard
              title="Doanh thu theo tháng"
              description="Xu hướng doanh thu"
              data={revenueData}
              type="area"
              loading={loading}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />

            <ChartCard
              title="Bệnh nhân theo ngày"
              description="Thống kê bệnh nhân hàng ngày"
              data={patientData}
              type="line"
              loading={loading}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <MiniTable
              title="Bệnh nhân cần chú ý"
              description="Các trường hợp cần theo dõi"
              items={pendingTasks.map(task => ({
                id: task.id,
                title: task.title,
                subtitle: task.subtitle,
                status: task.status,
                priority: task.priority,
                time: task.time,
                actions: [
                  {
                    label: 'Xử lý',
                    icon: <CheckCircle className="w-4 h-4" />,
                    onClick: () => console.log('Handle task:', task.id)
                  }
                ]
              }))}
              loading={loading}
              maxItems={10}
            />

            <Card>
              <CardHeader>
                <CardTitle>Thông báo hệ thống</CardTitle>
                <CardDescription>
                  Các thông báo và cảnh báo quan trọng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Thuốc sắp hết hạn</p>
                      <p className="text-xs text-gray-500">5 loại thuốc sắp hết hạn trong 30 ngày</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium">Hóa đơn chưa thanh toán</p>
                      <p className="text-xs text-gray-500">3 hóa đơn quá hạn thanh toán</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Lịch hẹn sắp tới</p>
                      <p className="text-xs text-gray-500">2 lịch hẹn trong 30 phút tới</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
