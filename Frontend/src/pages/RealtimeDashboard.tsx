import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LiveChart } from '@/components/ui/LiveChart';
import { LiveCounter } from '@/components/ui/LiveCounter';
import { LiveTable } from '@/components/ui/LiveTable';
import { NotificationCenter } from '@/components/ui/NotificationCenter';
import { CollaborationPanel } from '@/components/ui/CollaborationPanel';
import { useLiveData } from '@/hooks/useLiveData';
import { useNotifications } from '@/hooks/useNotifications';
import { useCollaboration } from '@/hooks/useCollaboration';
import { useToast } from '@/contexts/ToastContext';
import { 
  Activity, 
  Users, 
  TrendingUp, 
  Bell,
  Wifi,
  WifiOff,
  RefreshCw,
  Settings
} from 'lucide-react';

export const RealtimeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userId] = useState('user-1');
  const [userName] = useState('Nguyễn Văn A');

  // Live data hooks
  const {
    charts,
    counters,
    tables,
    isConnected: dataConnected,
    lastUpdate,
    error: dataError,
    subscribe,
    unsubscribe
  } = useLiveData({
    chartChannels: ['appointments', 'revenue', 'patients'],
    counterChannels: ['total-appointments', 'total-revenue', 'active-patients'],
    tableChannels: ['recent-appointments', 'upcoming-appointments']
  });

  // Notifications
  const { notifications, unreadCount, addNotification } = useNotifications();
  const { success, error, warning, info } = useToast();

  // Collaboration
  const {
    session,
    isConnected: collabConnected,
    onlineUsers,
    cursors,
    updateCursor,
    comments
  } = useCollaboration({
    sessionId: 'clinic-session-1',
    userId,
    userName,
    userColor: '#3b82f6'
  });

  const handleRefresh = () => {
    info('Làm mới dữ liệu', 'Đang tải lại dữ liệu real-time...');
    addNotification({
      type: 'info',
      title: 'Làm mới dữ liệu',
      message: 'Đang tải lại dữ liệu real-time...',
      read: false
    });
  };

  const handleTestNotification = () => {
    success('Thông báo test', 'Đây là thông báo test để kiểm tra hệ thống real-time');
    addNotification({
      type: 'success',
      title: 'Thông báo test',
      message: 'Đây là thông báo test để kiểm tra hệ thống real-time',
      read: false,
      sound: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Real-time
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Giám sát dữ liệu và cộng tác theo thời gian thực
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  dataConnected ? 'bg-green-500' : 'bg-red-500'
                )} />
                <span className="text-sm text-gray-600">
                  {dataConnected ? 'Kết nối' : 'Mất kết nối'}
                </span>
              </div>

              {/* Notifications */}
              <NotificationCenter />

              {/* Test Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotification}
              >
                Test Thông báo
              </Button>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={!dataConnected}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Làm mới
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="charts">Biểu đồ</TabsTrigger>
            <TabsTrigger value="tables">Bảng dữ liệu</TabsTrigger>
            <TabsTrigger value="collaboration">Cộng tác</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(counters).map(([key, counter]) => (
                <LiveCounter
                  key={key}
                  counter={counter}
                  showChange={true}
                  showTrend={true}
                  size="lg"
                />
              ))}
            </div>

            {/* Quick Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(charts).slice(0, 2).map(([key, chart]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-lg">{chart.name}</CardTitle>
                    <CardDescription>
                      Dữ liệu real-time • {chart.data.length} điểm
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LiveChart
                      data={chart}
                      height={300}
                      showGrid={true}
                      showTooltip={true}
                      animate={true}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Hoạt động gần đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-500">
                          {notification.timestamp.toLocaleTimeString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(charts).map(([key, chart]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle>{chart.name}</CardTitle>
                    <CardDescription>
                      Cập nhật lần cuối: {lastUpdate?.toLocaleTimeString('vi-VN')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LiveChart
                      data={chart}
                      height={400}
                      showGrid={true}
                      showTooltip={true}
                      animate={true}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tables Tab */}
          <TabsContent value="tables" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(tables).map(([key, table]) => (
                <LiveTable
                  key={key}
                  table={table}
                  maxRows={10}
                  showStatus={true}
                />
              ))}
            </div>
          </TabsContent>

          {/* Collaboration Tab */}
          <TabsContent value="collaboration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CollaborationPanel
                sessionId="clinic-session-1"
                userId={userId}
                userName={userName}
                userColor="#3b82f6"
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Trạng thái cộng tác
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Kết nối:</span>
                      <Badge variant={collabConnected ? 'default' : 'destructive'}>
                        {collabConnected ? 'Đã kết nối' : 'Mất kết nối'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Người dùng online:</span>
                      <Badge variant="secondary">{onlineUsers.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Bình luận:</span>
                      <Badge variant="secondary">{comments.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Con trỏ live:</span>
                      <Badge variant="secondary">{cursors.length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
