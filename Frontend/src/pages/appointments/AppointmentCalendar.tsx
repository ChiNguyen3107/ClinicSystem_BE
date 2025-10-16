import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppointmentStore } from '@/store/appointment.store';
import { useDoctorStore } from '@/store/doctor.store';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { formatDate, formatTime } from '@/utils/format';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';
import AppointmentForm from './AppointmentForm';

const statusColors: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [AppointmentStatus.CONFIRMED]: 'bg-green-100 text-green-800 border-green-200',
  [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-200',
  [AppointmentStatus.COMPLETED]: 'bg-blue-100 text-blue-800 border-blue-200',
  [AppointmentStatus.NO_SHOW]: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: 'Chờ xác nhận',
  [AppointmentStatus.CONFIRMED]: 'Đã xác nhận',
  [AppointmentStatus.CANCELLED]: 'Đã hủy',
  [AppointmentStatus.COMPLETED]: 'Hoàn thành',
  [AppointmentStatus.NO_SHOW]: 'Không đến',
};

type ViewMode = 'day' | 'week' | 'month';

const AppointmentCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const { 
    appointments, 
    fetchAppointmentsByDateRange, 
    updateAppointment,
    isLoading 
  } = useAppointmentStore();
  const { doctors, fetchDoctors } = useDoctorStore();

  // Fetch appointments when date range or doctor changes
  React.useEffect(() => {
    const startDate = getDateRange().start.toISOString().split('T')[0];
    const endDate = getDateRange().end.toISOString().split('T')[0];
    fetchAppointmentsByDateRange(startDate, endDate, selectedDoctor || undefined);
  }, [currentDate, viewMode, selectedDoctor]);

  React.useEffect(() => {
    fetchDoctors();
  }, []);

  const getDateRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    switch (viewMode) {
      case 'day':
        return { start, end };
      case 'week':
        start.setDate(currentDate.getDate() - currentDate.getDay());
        end.setDate(start.getDate() + 6);
        return { start, end };
      case 'month':
        start.setDate(1);
        end.setMonth(currentDate.getMonth() + 1, 0);
        return { start, end };
      default:
        return { start, end };
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'day':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.appointmentDate === dateStr);
  };

  const getAppointmentsForTimeSlot = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => {
      if (apt.appointmentDate !== dateStr) return false;
      const startHour = parseInt(apt.startTime.split(':')[0]);
      return startHour === hour;
    });
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingAppointment(null);
    // Refresh appointments
    const startDate = getDateRange().start.toISOString().split('T')[0];
    const endDate = getDateRange().end.toISOString().split('T')[0];
    fetchAppointmentsByDateRange(startDate, endDate, selectedDoctor || undefined);
  };

  const handleStatusChange = async (appointment: Appointment, newStatus: AppointmentStatus) => {
    try {
      await updateAppointment(appointment.id, { status: newStatus });
      toast.success('Cập nhật trạng thái thành công');
      // Refresh appointments
      const startDate = getDateRange().start.toISOString().split('T')[0];
      const endDate = getDateRange().end.toISOString().split('T')[0];
      fetchAppointmentsByDateRange(startDate, endDate, selectedDoctor || undefined);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const renderDayView = () => {
    const appointments = getAppointmentsForDate(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            {formatDate(currentDate.toISOString())}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
          {hours.map(hour => {
            const timeSlotAppointments = getAppointmentsForTimeSlot(currentDate, hour);
            
            return (
              <div key={hour} className="flex items-center gap-4 p-2 border-b">
                <div className="w-16 text-sm font-medium text-muted-foreground">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1 flex gap-2">
                  {timeSlotAppointments.map(appointment => (
                    <div
                      key={appointment.id}
                      className={cn(
                        'flex-1 p-2 rounded-md border cursor-pointer hover:shadow-md transition-shadow',
                        statusColors[appointment.status]
                      )}
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <div className="font-medium text-sm">{appointment.patientName}</div>
                      <div className="text-xs opacity-75">
                        {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                      </div>
                      <div className="text-xs opacity-75">{appointment.doctorName}</div>
                    </div>
                  ))}
                  {timeSlotAppointments.length === 0 && (
                    <div className="flex-1 p-2 text-muted-foreground text-sm">
                      Trống
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const { start } = getDateRange();
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div key={index} className="space-y-2">
                <div className={cn(
                  "text-center p-2 rounded-md",
                  isToday ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <div className="text-sm font-medium">
                    {day.toLocaleDateString('vi-VN', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-bold">{day.getDate()}</div>
                </div>
                
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {dayAppointments.slice(0, 3).map(appointment => (
                    <div
                      key={appointment.id}
                      className={cn(
                        'p-2 rounded text-xs cursor-pointer hover:shadow-md transition-shadow',
                        statusColors[appointment.status]
                      )}
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <div className="font-medium truncate">{appointment.patientName}</div>
                      <div className="opacity-75">
                        {formatTime(appointment.startTime)}
                      </div>
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayAppointments.length - 3} khác
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const { start, end } = getDateRange();
    const firstDay = new Date(start);
    firstDay.setDate(1);
    const lastDay = new Date(end);
    
    // Get first day of week for the month
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    // Create calendar grid
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(firstDay);
      date.setDate(day);
      calendarDays.push(date);
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={index} className="p-2 min-h-[100px]" />;
            }
            
            const dayAppointments = getAppointmentsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            
            return (
              <div
                key={index}
                className={cn(
                  "p-2 min-h-[100px] border rounded-md",
                  isToday && "bg-primary/10 border-primary",
                  !isCurrentMonth && "opacity-50"
                )}
              >
                <div className={cn(
                  "text-sm font-medium mb-1",
                  isToday && "text-primary font-bold"
                )}>
                  {date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map(appointment => (
                    <div
                      key={appointment.id}
                      className={cn(
                        'p-1 rounded text-xs cursor-pointer hover:shadow-md transition-shadow truncate',
                        statusColors[appointment.status]
                      )}
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <div className="font-medium">{appointment.patientName}</div>
                      <div className="opacity-75">{formatTime(appointment.startTime)}</div>
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayAppointments.length - 2} khác
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderView = () => {
    switch (viewMode) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      default:
        return renderWeekView();
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Lịch hẹn
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToToday}
                >
                  Hôm nay
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Ngày</SelectItem>
                  <SelectItem value="week">Tuần</SelectItem>
                  <SelectItem value="month">Tháng</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tất cả bác sĩ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả bác sĩ</SelectItem>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo lịch hẹn
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Tạo lịch hẹn mới</DialogTitle>
                    <DialogDescription>
                      Điền thông tin để tạo lịch hẹn mới
                    </DialogDescription>
                  </DialogHeader>
                  <AppointmentForm
                    appointment={editingAppointment}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setIsFormOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Content */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Đang tải lịch hẹn...</span>
            </div>
          ) : (
            renderView()
          )}
        </CardContent>
      </Card>

      {/* Appointment Detail Dialog */}
      {selectedAppointment && (
        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về lịch hẹn {selectedAppointment.code}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Mã lịch hẹn</label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Trạng thái</label>
                  <Badge className={cn(statusColors[selectedAppointment.status])}>
                    {statusLabels[selectedAppointment.status]}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Bệnh nhân</label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Số điện thoại</label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.patientPhone}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Bác sĩ</label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.doctorName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Chuyên khoa</label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.doctorSpecialty}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Phòng</label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.roomName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Thời gian</label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedAppointment.appointmentDate)} {formatTime(selectedAppointment.startTime)} - {formatTime(selectedAppointment.endTime)}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Lý do khám</label>
                <p className="text-sm text-muted-foreground">{selectedAppointment.reason}</p>
              </div>
              
              {selectedAppointment.notes && (
                <div>
                  <label className="text-sm font-medium">Ghi chú</label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.notes}</p>
                </div>
              )}
              
              {selectedAppointment.cancellationReason && (
                <div>
                  <label className="text-sm font-medium">Lý do hủy</label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.cancellationReason}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                Đóng
              </Button>
              {(selectedAppointment.status === AppointmentStatus.PENDING || 
                selectedAppointment.status === AppointmentStatus.CONFIRMED) && (
                <Button 
                  variant="outline" 
                  onClick={() => handleEditAppointment(selectedAppointment)}
                >
                  Chỉnh sửa
                </Button>
              )}
              {selectedAppointment.status === AppointmentStatus.PENDING && (
                <Button 
                  onClick={() => handleStatusChange(selectedAppointment, AppointmentStatus.CONFIRMED)}
                >
                  Xác nhận
                </Button>
              )}
              {selectedAppointment.status === AppointmentStatus.CONFIRMED && (
                <Button 
                  onClick={() => handleStatusChange(selectedAppointment, AppointmentStatus.COMPLETED)}
                >
                  Hoàn thành
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AppointmentCalendar;
