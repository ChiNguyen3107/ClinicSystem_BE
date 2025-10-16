import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatsCards from '@/components/dashboard/StatsCards';
import { 
  Clock,
  CheckCircle,
  Users
} from 'lucide-react';

export const Dashboard: React.FC = () => {

  const recentAppointments = [
    {
      id: 1,
      patient: 'Nguyễn Văn A',
      doctor: 'BS. Trần Thị B',
      time: '09:00',
      status: 'CONFIRMED',
    },
    {
      id: 2,
      patient: 'Lê Thị C',
      doctor: 'BS. Phạm Văn D',
      time: '10:30',
      status: 'IN_PROGRESS',
    },
    {
      id: 3,
      patient: 'Hoàng Văn E',
      doctor: 'BS. Nguyễn Thị F',
      time: '14:00',
      status: 'PENDING',
    },
  ];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Tổng quan về hoạt động của phòng khám
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards period="month" />

      {/* Recent Appointments */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Lịch hẹn gần đây</CardTitle>
            <CardDescription>
              Các cuộc hẹn sắp tới và đang diễn ra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {appointment.time}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {appointment.patient}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctor}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Hoạt động hôm nay</CardTitle>
            <CardDescription>
              Tóm tắt các hoạt động trong ngày
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">8 cuộc khám đã hoàn thành</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm">3 cuộc khám đang chờ</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm">5 bệnh nhân mới</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
