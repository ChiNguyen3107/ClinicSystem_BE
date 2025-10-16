import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, Calendar, MapPin, Award, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDoctorStore } from '@/store/doctor.store';
import { DoctorCalendar } from '@/components/doctors/DoctorCalendar';
import { toast } from 'sonner';

const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentDoctor,
    doctorStats,
    doctorSchedules,
    loading,
    error,
    fetchDoctorById,
    fetchDoctorStats,
    fetchDoctorSchedules,
    clearError
  } = useDoctorStore();

  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (id) {
      fetchDoctorById(id);
      fetchDoctorStats(id);
      fetchDoctorSchedules(id);
    }
  }, [id, fetchDoctorById, fetchDoctorStats, fetchDoctorSchedules]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  if (loading && !currentDoctor) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentDoctor) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không tìm thấy bác sĩ</p>
        <Button onClick={() => navigate('/doctors')} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'INACTIVE':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Không hoạt động</Badge>;
      case 'SUSPENDED':
        return <Badge variant="destructive">Tạm ngưng</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return days[dayOfWeek];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/doctors')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chi tiết bác sĩ</h1>
            <p className="text-muted-foreground">
              Thông tin chi tiết và quản lý bác sĩ
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/doctors/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      </div>

      {/* Doctor Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentDoctor.avatar} />
              <AvatarFallback className="text-lg">
                {getInitials(currentDoctor.fullName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{currentDoctor.fullName}</h2>
                  <p className="text-muted-foreground">{currentDoctor.specialty}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="outline">{currentDoctor.licenseNo}</Badge>
                    {getStatusBadge(currentDoctor.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{currentDoctor.email}</span>
                  </div>
                  {currentDoctor.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{currentDoctor.phone}</span>
                    </div>
                  )}
                  {currentDoctor.room && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{currentDoctor.room}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {currentDoctor.dateOfBirth && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(currentDoctor.dateOfBirth)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Chuyên khoa: {currentDoctor.specialty}</span>
                  </div>
                </div>
              </div>

              {currentDoctor.bio && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Tiểu sử</h4>
                  <p className="text-sm text-muted-foreground">{currentDoctor.bio}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="schedule">Lịch làm việc</TabsTrigger>
          <TabsTrigger value="stats">Thống kê</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Họ tên</label>
                    <p className="text-sm">{currentDoctor.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{currentDoctor.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Số điện thoại</label>
                    <p className="text-sm">{currentDoctor.phone || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Giới tính</label>
                    <p className="text-sm">
                      {currentDoctor.gender === 'MALE' ? 'Nam' : 
                       currentDoctor.gender === 'FEMALE' ? 'Nữ' : 
                       currentDoctor.gender === 'OTHER' ? 'Khác' : 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Ngày sinh</label>
                    <p className="text-sm">
                      {currentDoctor.dateOfBirth ? formatDate(currentDoctor.dateOfBirth) : 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                    <div className="mt-1">
                      {getStatusBadge(currentDoctor.status)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin chuyên môn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Chuyên khoa</label>
                    <p className="text-sm">{currentDoctor.specialty}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Số bằng</label>
                    <p className="text-sm font-mono">{currentDoctor.licenseNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phòng làm việc</label>
                    <p className="text-sm">{currentDoctor.room || 'Chưa phân công'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Ngày tạo</label>
                    <p className="text-sm">{formatDate(currentDoctor.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lịch làm việc</CardTitle>
            </CardHeader>
            <CardContent>
              <DoctorCalendar doctorId={id!} />
            </CardContent>
          </Card>

          {doctorSchedules.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết lịch làm việc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctorSchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <div className="font-medium">{getDayName(schedule.dayOfWeek)}</div>
                          <div className="text-muted-foreground">
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                        </div>
                        {schedule.room && (
                          <Badge variant="outline">{schedule.room}</Badge>
                        )}
                      </div>
                      <Badge variant={schedule.isActive ? 'default' : 'secondary'}>
                        {schedule.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {doctorStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng lịch khám</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doctorStats.totalAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    Tổng số lịch khám đã đặt
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doctorStats.completedAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    Lịch khám đã hoàn thành
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sắp tới</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doctorStats.upcomingAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    Lịch khám sắp tới
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Đánh giá trung bình</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doctorStats.averageRating.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">
                    Điểm đánh giá trung bình
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng bệnh nhân</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doctorStats.totalPatients}</div>
                  <p className="text-xs text-muted-foreground">
                    Tổng số bệnh nhân đã khám
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Đang tải thống kê...</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDetail;
