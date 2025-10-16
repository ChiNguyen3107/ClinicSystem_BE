import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatsCards from '@/components/dashboard/StatsCards';
import ChartCard from '@/components/dashboard/ChartCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivities from '@/components/dashboard/RecentActivities';
import { useRealTimeDashboard } from '@/hooks/useRealTimeDashboard';
import { 
  Clock,
  CheckCircle,
  Users,
  Activity,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedChart, setSelectedChart] = useState<'revenue' | 'patients' | 'appointments' | 'services'>('revenue');
  
  const {
    data,
    loading,
    error,
    isConnected,
    isConnecting,
    refresh,
    markNotificationAsRead
  } = useRealTimeDashboard();

  const handleQuickAction = (actionId: string) => {
    console.log('Quick action:', actionId);
    // Implement navigation or modal opening based on action
  };

  const handleViewAllActivities = () => {
    console.log('View all activities');
    // Navigate to activities page
  };

  const handleRefresh = async () => {
    await refresh();
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: { variant: 'secondary' as const, label: 'Chờ xác nhận' },
      CONFIRMED: { variant: 'default' as const, label: 'Đã xác nhận' },
      IN_PROGRESS: { variant: 'default' as const, label: 'Đang khám' },
      COMPLETED: { variant: 'default' as const, label: 'Hoàn thành' },
      CANCELLED: { variant: 'destructive' as const, label: 'Đã hủy' },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { variant: 'secondary' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Mock data for charts
  const chartData = {
    revenue: [
      { name: 'Tuần 1', value: 2500000, change: 5.2 },
      { name: 'Tuần 2', value: 3200000, change: 8.1 },
      { name: 'Tuần 3', value: 2800000, change: -2.3 },
      { name: 'Tuần 4', value: 3500000, change: 12.5 }
    ],
    patients: [
      { name: 'Thứ 2', value: 15, change: 3.2 },
      { name: 'Thứ 3', value: 22, change: 8.1 },
      { name: 'Thứ 4', value: 18, change: -2.3 },
      { name: 'Thứ 5', value: 25, change: 12.5 },
      { name: 'Thứ 6', value: 20, change: 5.1 }
    ],
    appointments: [
      { name: 'Sáng', value: 12, change: 2.1 },
      { name: 'Chiều', value: 18, change: 5.3 },
      { name: 'Tối', value: 8, change: -1.2 }
    ],
    services: [
      { name: 'Khám tổng quát', value: 45, change: 8.2 },
      { name: 'Xét nghiệm', value: 32, change: 12.1 },
      { name: 'Chẩn đoán hình ảnh', value: 28, change: 3.5 },
      { name: 'Phẫu thuật', value: 15, change: -2.1 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header với connection status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Tổng quan về hoạt động của phòng khám
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Connection status */}
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center space-x-1 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Kết nối real-time</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-orange-600">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isConnecting ? 'Đang kết nối...' : 'Mất kết nối'}
                </span>
              </div>
            )}
          </div>

          {/* Refresh button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Lỗi kết nối</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <StatsCards period={selectedPeriod} />

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Biểu đồ doanh thu"
          description="Doanh thu theo thời gian"
          data={chartData.revenue}
          type="line"
          period={selectedPeriod}
          onPeriodChange={(period) => setSelectedPeriod(period as any)}
          loading={loading}
        />
        
        <ChartCard
          title="Biểu đồ bệnh nhân"
          description="Số lượng bệnh nhân mới"
          data={chartData.patients}
          type="bar"
          period={selectedPeriod}
          loading={loading}
        />
      </div>

      {/* Additional Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Biểu đồ lịch hẹn"
          description="Phân bố lịch hẹn trong ngày"
          data={chartData.appointments}
          type="pie"
          loading={loading}
        />
        
        <ChartCard
          title="Biểu đồ dịch vụ"
          description="Các dịch vụ được sử dụng nhiều nhất"
          data={chartData.services}
          type="bar"
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions onAction={handleQuickAction} />
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <RecentActivities
            activities={data.activities}
            loading={loading}
            onRefresh={handleRefresh}
            onMarkAsRead={markNotificationAsRead}
            onViewAll={handleViewAllActivities}
          />
        </div>
      </div>

      {/* Today's Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lịch hẹn hôm nay</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats?.todayAppointments || 0}</div>
            <p className="text-xs text-muted-foreground">
              {data.stats?.pendingAppointments || 0} đang chờ xác nhận
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bệnh nhân mới</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats?.newPatients || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{data.stats?.newPatientsChange || 0}% so với tuần trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu hôm nay</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats?.todayRevenue ? `${(data.stats.todayRevenue / 1000000).toFixed(1)}M` : '0M'}
            </div>
            <p className="text-xs text-muted-foreground">
              +{data.stats?.revenueGrowth || 0}% so với hôm qua
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hiệu suất</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats?.successRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Tỷ lệ khám thành công
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Last updated info */}
      {data.lastUpdate && (
        <div className="text-center text-sm text-muted-foreground">
          Cập nhật lần cuối: {data.lastUpdate.toLocaleString('vi-VN')}
        </div>
      )}
    </div>
  );
};
