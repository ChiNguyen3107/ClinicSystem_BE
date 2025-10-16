import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Search, Filter, Calendar, Eye, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppointmentStore } from '@/store/appointment.store';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { formatDate, formatTime } from '@/utils/format';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';
import AppointmentForm from './AppointmentForm';
import AppointmentCalendar from './AppointmentCalendar';

const statusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: 'Chờ xác nhận',
  [AppointmentStatus.CONFIRMED]: 'Đã xác nhận',
  [AppointmentStatus.CANCELLED]: 'Đã hủy',
  [AppointmentStatus.COMPLETED]: 'Hoàn thành',
  [AppointmentStatus.NO_SHOW]: 'Không đến',
};

const statusColors: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [AppointmentStatus.CONFIRMED]: 'bg-green-100 text-green-800',
  [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [AppointmentStatus.COMPLETED]: 'bg-blue-100 text-blue-800',
  [AppointmentStatus.NO_SHOW]: 'bg-gray-100 text-gray-800',
};

const AppointmentsPage: React.FC = () => {
  const location = useLocation();
  const isCalendarView = location.pathname === '/appointments/calendar';
  
  const {
    appointments,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    filters,
    isLoading,
    error,
    setFilters,
    fetchAppointments,
    updateAppointmentStatus,
    deleteAppointment,
    fetchStats,
    stats,
    clearError
  } = useAppointmentStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);
  const [activeTab, setActiveTab] = useState(isCalendarView ? 'calendar' : 'list');

  useEffect(() => {
    fetchAppointments();
    fetchStats();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSearch = () => {
    setFilters({
      patientName: searchTerm || undefined,
      status: selectedStatus as AppointmentStatus || undefined,
      doctorId: selectedDoctor || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page: 0
    });
    fetchAppointments();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedDoctor('');
    setDateFrom('');
    setDateTo('');
    setFilters({});
    fetchAppointments();
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    fetchAppointments();
  };

  const handleStatusChange = async (appointment: Appointment, newStatus: AppointmentStatus) => {
    try {
      await updateAppointmentStatus(appointment.id, newStatus);
      toast.success(`Cập nhật trạng thái thành công`);
      fetchAppointments();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleDelete = async () => {
    if (!deletingAppointment) return;
    
    try {
      await deleteAppointment(deletingAppointment.id);
      toast.success('Xóa lịch hẹn thành công');
      setDeletingAppointment(null);
      fetchAppointments();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa lịch hẹn');
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAppointment(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchAppointments();
    fetchStats();
  };

  const canEdit = (appointment: Appointment) => {
    return appointment.status === AppointmentStatus.PENDING || appointment.status === AppointmentStatus.CONFIRMED;
  };

  const canDelete = (appointment: Appointment) => {
    return appointment.status === AppointmentStatus.PENDING;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lịch hẹn</h1>
          <p className="text-muted-foreground">
            Quản lý lịch hẹn khám bệnh của bệnh nhân
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo lịch hẹn
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng lịch hẹn</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hôm nay</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tuần này</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.weekCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tháng này</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Danh sách</TabsTrigger>
          <TabsTrigger value="calendar">Lịch</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Bộ lọc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tìm kiếm bệnh nhân</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tên bệnh nhân..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng thái</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bác sĩ</label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn bác sĩ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      <SelectItem value="1">BS. Nguyễn Văn Bác</SelectItem>
                      <SelectItem value="2">BS. Trần Thị Sĩ</SelectItem>
                      <SelectItem value="3">BS. Lê Văn Cường</SelectItem>
                      <SelectItem value="4">BS. Phạm Thị Dung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Từ ngày</label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Đến ngày</label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSearch}>
                  <Search className="mr-2 h-4 w-4" />
                  Tìm kiếm
                </Button>
                <Button variant="outline" onClick={handleClearFilters}>
                  Xóa bộ lọc
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách lịch hẹn</CardTitle>
              <CardDescription>
                Tổng cộng {totalElements} lịch hẹn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã lịch</TableHead>
                      <TableHead>Bệnh nhân</TableHead>
                      <TableHead>Bác sĩ</TableHead>
                      <TableHead>Phòng</TableHead>
                      <TableHead>Ngày giờ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Lý do</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            <span className="ml-2">Đang tải...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : appointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="text-muted-foreground">
                            Không có lịch hẹn nào
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">
                            {appointment.code}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{appointment.patientName}</div>
                              <div className="text-sm text-muted-foreground">
                                {appointment.patientPhone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{appointment.doctorName}</div>
                              <div className="text-sm text-muted-foreground">
                                {appointment.doctorSpecialty}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{appointment.roomName}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{formatDate(appointment.appointmentDate)}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn(statusColors[appointment.status])}>
                              {statusLabels[appointment.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {appointment.reason}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Mã lịch hẹn</label>
                                        <p className="text-sm text-muted-foreground">{appointment.code}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Trạng thái</label>
                                        <Badge className={cn(statusColors[appointment.status])}>
                                          {statusLabels[appointment.status]}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Bệnh nhân</label>
                                        <p className="text-sm text-muted-foreground">{appointment.patientName}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Số điện thoại</label>
                                        <p className="text-sm text-muted-foreground">{appointment.patientPhone}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Bác sĩ</label>
                                        <p className="text-sm text-muted-foreground">{appointment.doctorName}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Chuyên khoa</label>
                                        <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Phòng</label>
                                        <p className="text-sm text-muted-foreground">{appointment.roomName}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Thời gian</label>
                                        <p className="text-sm text-muted-foreground">
                                          {formatDate(appointment.appointmentDate)} {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Lý do khám</label>
                                      <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                                    </div>
                                    {appointment.notes && (
                                      <div>
                                        <label className="text-sm font-medium">Ghi chú</label>
                                        <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                                      </div>
                                    )}
                                    {appointment.cancellationReason && (
                                      <div>
                                        <label className="text-sm font-medium">Lý do hủy</label>
                                        <p className="text-sm text-muted-foreground">{appointment.cancellationReason}</p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {canEdit(appointment) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(appointment)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}

                              {appointment.status === AppointmentStatus.PENDING && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusChange(appointment, AppointmentStatus.CONFIRMED)}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                              )}

                              {appointment.status === AppointmentStatus.CONFIRMED && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusChange(appointment, AppointmentStatus.COMPLETED)}
                                >
                                  <CheckCircle className="h-4 w-4 text-blue-600" />
                                </Button>
                              )}

                              {canDelete(appointment) && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Bạn có chắc chắn muốn xóa lịch hẹn {appointment.code}? Hành động này không thể hoàn tác.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                                      <AlertDialogAction onClick={handleDelete}>
                                        Xóa
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Trang {currentPage + 1} / {totalPages} ({totalElements} lịch hẹn)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <AppointmentCalendar />
        </TabsContent>
      </Tabs>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingAppointment ? 'Chỉnh sửa lịch hẹn' : 'Tạo lịch hẹn mới'}
            </DialogTitle>
            <DialogDescription>
              {editingAppointment 
                ? 'Cập nhật thông tin lịch hẹn' 
                : 'Điền thông tin để tạo lịch hẹn mới'
              }
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm
            appointment={editingAppointment}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsPage;
