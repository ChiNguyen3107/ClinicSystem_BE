import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Mail,
  Calendar,
  Settings
} from 'lucide-react';
import { ScheduledReport } from '@/types/report';
import { ReportService } from '@/api/services/report.service';

interface ReportSchedulerProps {
  onSchedule?: () => void;
}

export function ReportScheduler({ onSchedule }: ReportSchedulerProps) {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    schedule: '',
    email: '',
    isActive: true
  });

  useEffect(() => {
    loadScheduledReports();
  }, []);

  const loadScheduledReports = async () => {
    setIsLoading(true);
    try {
      const reports = await ReportService.getScheduledReports();
      setScheduledReports(reports);
    } catch (error) {
      console.error('Error loading scheduled reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReport = async () => {
    try {
      await ReportService.createScheduledReport(formData);
      await loadScheduledReports();
      setIsDialogOpen(false);
      setFormData({
        name: '',
        type: '',
        schedule: '',
        email: '',
        isActive: true
      });
    } catch (error) {
      console.error('Error creating scheduled report:', error);
    }
  };

  const handleUpdateReport = async () => {
    if (!editingReport) return;
    
    try {
      await ReportService.updateScheduledReport(editingReport.id, formData);
      await loadScheduledReports();
      setIsDialogOpen(false);
      setEditingReport(null);
      setFormData({
        name: '',
        type: '',
        schedule: '',
        email: '',
        isActive: true
      });
    } catch (error) {
      console.error('Error updating scheduled report:', error);
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa báo cáo đã lên lịch này?')) {
      try {
        await ReportService.deleteScheduledReport(id);
        await loadScheduledReports();
      } catch (error) {
        console.error('Error deleting scheduled report:', error);
      }
    }
  };

  const handleToggleReport = async (id: string, isActive: boolean) => {
    try {
      await ReportService.toggleScheduledReport(id, !isActive);
      await loadScheduledReports();
    } catch (error) {
      console.error('Error toggling scheduled report:', error);
    }
  };

  const handleEditReport = (report: ScheduledReport) => {
    setEditingReport(report);
    setFormData({
      name: report.name,
      type: report.type,
      schedule: report.schedule,
      email: report.email,
      isActive: report.isActive
    });
    setIsDialogOpen(true);
  };

  const getScheduleLabel = (schedule: string) => {
    const scheduleMap: Record<string, string> = {
      'daily': 'Hàng ngày',
      'weekly': 'Hàng tuần',
      'monthly': 'Hàng tháng',
      'quarterly': 'Hàng quý',
      'yearly': 'Hàng năm'
    };
    return scheduleMap[schedule] || schedule;
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'revenue': 'Báo cáo doanh thu',
      'patients': 'Báo cáo bệnh nhân',
      'appointments': 'Báo cáo lịch hẹn',
      'services': 'Báo cáo dịch vụ',
      'dashboard': 'Báo cáo tổng quan'
    };
    return typeMap[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Báo cáo đã lên lịch</h2>
          <p className="text-muted-foreground">
            Quản lý các báo cáo tự động được gửi qua email
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingReport(null);
              setFormData({
                name: '',
                type: '',
                schedule: '',
                email: '',
                isActive: true
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo báo cáo mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingReport ? 'Chỉnh sửa báo cáo' : 'Tạo báo cáo mới'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên báo cáo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên báo cáo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Loại báo cáo</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại báo cáo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Báo cáo tổng quan</SelectItem>
                    <SelectItem value="revenue">Báo cáo doanh thu</SelectItem>
                    <SelectItem value="patients">Báo cáo bệnh nhân</SelectItem>
                    <SelectItem value="appointments">Báo cáo lịch hẹn</SelectItem>
                    <SelectItem value="services">Báo cáo dịch vụ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Tần suất</Label>
                <Select value={formData.schedule} onValueChange={(value) => setFormData({ ...formData, schedule: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tần suất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Hàng ngày</SelectItem>
                    <SelectItem value="weekly">Hàng tuần</SelectItem>
                    <SelectItem value="monthly">Hàng tháng</SelectItem>
                    <SelectItem value="quarterly">Hàng quý</SelectItem>
                    <SelectItem value="yearly">Hàng năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email nhận báo cáo</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Nhập email"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Kích hoạt báo cáo</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={editingReport ? handleUpdateReport : handleCreateReport}>
                  {editingReport ? 'Cập nhật' : 'Tạo'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên báo cáo</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Tần suất</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Lần chạy cuối</TableHead>
                <TableHead>Lần chạy tiếp theo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : scheduledReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Chưa có báo cáo nào được lên lịch
                  </TableCell>
                </TableRow>
              ) : (
                scheduledReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>{getTypeLabel(report.type)}</TableCell>
                    <TableCell>{getScheduleLabel(report.schedule)}</TableCell>
                    <TableCell className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {report.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={report.isActive ? 'default' : 'secondary'}>
                        {report.isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {report.lastRun ? new Date(report.lastRun).toLocaleString('vi-VN') : 'Chưa chạy'}
                    </TableCell>
                    <TableCell>
                      {report.nextRun ? new Date(report.nextRun).toLocaleString('vi-VN') : 'Chưa xác định'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleReport(report.id, report.isActive)}
                        >
                          {report.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditReport(report)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteReport(report.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
