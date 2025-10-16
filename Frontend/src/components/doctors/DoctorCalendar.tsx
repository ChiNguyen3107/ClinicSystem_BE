import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDoctorStore } from '@/store/doctor.store';
import { toast } from 'sonner';

interface DoctorCalendarProps {
  doctorId: string;
}

interface ScheduleFormData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
}

const DoctorCalendar: React.FC<DoctorCalendarProps> = ({ doctorId }) => {
  const {
    doctorSchedules,
    weeklySchedule,
    loading,
    fetchDoctorSchedules,
    fetchWeeklySchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    clearError
  } = useDoctorStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [formData, setFormData] = useState<ScheduleFormData>({
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '17:00',
    room: ''
  });

  const daysOfWeek = [
    { value: 1, label: 'Thứ hai' },
    { value: 2, label: 'Thứ ba' },
    { value: 3, label: 'Thứ tư' },
    { value: 4, label: 'Thứ năm' },
    { value: 5, label: 'Thứ sáu' },
    { value: 6, label: 'Thứ bảy' },
    { value: 0, label: 'Chủ nhật' }
  ];

  const rooms = [
    'Phòng 101',
    'Phòng 102', 
    'Phòng 103',
    'Phòng 104',
    'Phòng 105',
    'Phòng 201',
    'Phòng 202',
    'Phòng 203',
    'Phòng 204',
    'Phòng 205'
  ];

  useEffect(() => {
    if (doctorId) {
      fetchDoctorSchedules(doctorId);
      // Get current week start (Monday)
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1);
      const weekStart = monday.toISOString().split('T')[0];
      fetchWeeklySchedule(doctorId, weekStart);
    }
  }, [doctorId, fetchDoctorSchedules, fetchWeeklySchedule]);

  const handleCreateSchedule = async () => {
    try {
      await createSchedule({
        doctorId,
        ...formData
      });
      toast.success('Tạo lịch làm việc thành công');
      setIsDialogOpen(false);
      setFormData({
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '17:00',
        room: ''
      });
      fetchDoctorSchedules(doctorId);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo lịch làm việc');
    }
  };

  const handleUpdateSchedule = async () => {
    if (!editingSchedule) return;
    
    try {
      await updateSchedule(editingSchedule.id, formData);
      toast.success('Cập nhật lịch làm việc thành công');
      setIsDialogOpen(false);
      setEditingSchedule(null);
      setFormData({
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '17:00',
        room: ''
      });
      fetchDoctorSchedules(doctorId);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật lịch làm việc');
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch làm việc này?')) {
      try {
        await deleteSchedule(scheduleId);
        toast.success('Xóa lịch làm việc thành công');
        fetchDoctorSchedules(doctorId);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa lịch làm việc');
      }
    }
  };

  const openEditDialog = (schedule: any) => {
    setEditingSchedule(schedule);
    setFormData({
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      room: schedule.room || ''
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSchedule(null);
    setFormData({
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '17:00',
      room: ''
    });
    setIsDialogOpen(true);
  };

  const getDayName = (dayOfWeek: number) => {
    const day = daysOfWeek.find(d => d.value === dayOfWeek);
    return day?.label || '';
  };

  const getScheduleForDay = (dayOfWeek: number) => {
    if (!weeklySchedule) return [];
    return weeklySchedule[dayOfWeek] || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lịch làm việc tuần</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm lịch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Chỉnh sửa lịch làm việc' : 'Thêm lịch làm việc mới'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dayOfWeek">Ngày trong tuần</Label>
                <Select
                  value={formData.dayOfWeek.toString()}
                  onValueChange={(value) => setFormData({ ...formData, dayOfWeek: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map(day => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Giờ bắt đầu</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Giờ kết thúc</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Phòng làm việc</Label>
                <Select
                  value={formData.room}
                  onValueChange={(value) => setFormData({ ...formData, room: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map(room => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button 
                  onClick={editingSchedule ? handleUpdateSchedule : handleCreateSchedule}
                  disabled={loading}
                >
                  {editingSchedule ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Weekly Calendar */}
      <div className="grid grid-cols-7 gap-4">
        {daysOfWeek.map(day => {
          const schedules = getScheduleForDay(day.value);
          
          return (
            <Card key={day.value} className="min-h-[200px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-center">
                  {day.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {schedules.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center">
                    Không có lịch
                  </p>
                ) : (
                  schedules.map(schedule => (
                    <div
                      key={schedule.id}
                      className="p-2 bg-blue-50 border border-blue-200 rounded text-xs space-y-1"
                    >
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                      {schedule.room && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{schedule.room}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={schedule.isActive ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {schedule.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => openEditDialog(schedule)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-600"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Schedule List */}
      {doctorSchedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách lịch làm việc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {doctorSchedules.map(schedule => (
                <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-medium">{getDayName(schedule.dayOfWeek)}</div>
                      <div className="text-sm text-muted-foreground">
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </div>
                    {schedule.room && (
                      <Badge variant="outline">{schedule.room}</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={schedule.isActive ? 'default' : 'secondary'}>
                      {schedule.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(schedule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { DoctorCalendar };
