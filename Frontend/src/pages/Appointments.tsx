import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Calendar, Clock, User } from 'lucide-react';

export const Appointments: React.FC = () => {
  // Mock data - replace with real data from API
  const appointments = [
    {
      id: 1,
      patient: { fullName: 'Nguyễn Văn A', code: 'BN001' },
      doctor: { fullName: 'BS. Trần Thị B', specialty: 'Tim mạch' },
      scheduledAt: '2024-01-15T09:00:00',
      status: 'CONFIRMED',
      reason: 'Khám định kỳ',
      duration: 30,
    },
    {
      id: 2,
      patient: { fullName: 'Lê Thị C', code: 'BN002' },
      doctor: { fullName: 'BS. Phạm Văn D', specialty: 'Nội khoa' },
      scheduledAt: '2024-01-15T10:30:00',
      status: 'IN_PROGRESS',
      reason: 'Đau đầu, sốt',
      duration: 45,
    },
    {
      id: 3,
      patient: { fullName: 'Hoàng Văn E', code: 'BN003' },
      doctor: { fullName: 'BS. Nguyễn Thị F', specialty: 'Ngoại khoa' },
      scheduledAt: '2024-01-15T14:00:00',
      status: 'PENDING',
      reason: 'Tư vấn phẫu thuật',
      duration: 60,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: { variant: 'secondary' as const, label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
      CONFIRMED: { variant: 'default' as const, label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
      IN_PROGRESS: { variant: 'default' as const, label: 'Đang khám', color: 'bg-green-100 text-green-800' },
      COMPLETED: { variant: 'default' as const, label: 'Hoàn thành', color: 'bg-gray-100 text-gray-800' },
      CANCELLED: { variant: 'destructive' as const, label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { variant: 'secondary' as const, label: status, color: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý lịch hẹn</h1>
          <p className="text-muted-foreground">
            Quản lý lịch hẹn khám bệnh và đặt lịch
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Đặt lịch hẹn
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm và lọc</CardTitle>
          <CardDescription>
            Tìm kiếm lịch hẹn theo bệnh nhân, bác sĩ, hoặc ngày
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm lịch hẹn..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lịch hẹn</CardTitle>
          <CardDescription>
            Tổng cộng {appointments.length} lịch hẹn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{appointment.patient.fullName}</h3>
                      <span className="text-sm text-muted-foreground">
                        ({appointment.patient.code})
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{appointment.doctor.fullName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDateTime(appointment.scheduledAt)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {appointment.reason}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusBadge(appointment.status)}
                  <Button variant="outline" size="sm">
                    Chi tiết
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
