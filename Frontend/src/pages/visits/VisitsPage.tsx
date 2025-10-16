import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Search, Filter, Eye, Edit, Calendar, User, Stethoscope } from 'lucide-react';
import { Visit, VisitFilter, VisitStatus } from '@/types/visit';
import { visitService } from '@/api/services/visit.service';
import { formatDate } from '@/utils/date';

const statusConfig = {
  PENDING: { label: 'Chờ khám', color: 'bg-yellow-100 text-yellow-800' },
  IN_PROGRESS: { label: 'Đang khám', color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Hủy bỏ', color: 'bg-red-100 text-red-800' },
};

export function VisitsPage() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filters, setFilters] = useState<VisitFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState<Array<{ id: string; fullName: string; specialization: string }>>([]);
  const [patients, setPatients] = useState<Array<{ id: string; fullName: string }>>([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState<any[]>([]);

  // Form state for creating visit
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentId: '',
    preliminaryDx: '',
    symptoms: '',
    clinicalNotes: ''
  });

  useEffect(() => {
    loadVisits();
    loadDoctors();
    loadPatients();
    loadConfirmedAppointments();
  }, []);

  useEffect(() => {
    loadVisits();
  }, [filters]);

  const loadVisits = async () => {
    try {
      setLoading(true);
      const response = await visitService.getVisits(filters);
      setVisits(response.data);
    } catch (error) {
      console.error('Error loading visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    // Mock data - replace with actual API call
    setDoctors([
      { id: '1', fullName: 'BS. Nguyễn Văn A', specialization: 'Tim mạch' },
      { id: '2', fullName: 'BS. Trần Thị B', specialization: 'Nội khoa' },
      { id: '3', fullName: 'BS. Lê Văn C', specialization: 'Ngoại khoa' },
    ]);
  };

  const loadPatients = async () => {
    // Mock data - replace with actual API call
    setPatients([
      { id: '1', fullName: 'Nguyễn Văn D' },
      { id: '2', fullName: 'Trần Thị E' },
      { id: '3', fullName: 'Lê Văn F' },
    ]);
  };

  const loadConfirmedAppointments = async () => {
    try {
      const appointments = await visitService.getConfirmedAppointments();
      setConfirmedAppointments(appointments);
    } catch (error) {
      console.error('Error loading confirmed appointments:', error);
    }
  };

  const handleCreateVisit = async () => {
    try {
      await visitService.createVisit(formData);
      setIsCreateDialogOpen(false);
      setFormData({
        patientId: '',
        doctorId: '',
        appointmentId: '',
        preliminaryDx: '',
        symptoms: '',
        clinicalNotes: ''
      });
      loadVisits();
    } catch (error) {
      console.error('Error creating visit:', error);
    }
  };

  const handleFilterChange = (key: keyof VisitFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const getStatusBadge = (status: VisitStatus) => {
    const config = statusConfig[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const filteredVisits = visits.filter(visit => {
    if (searchTerm) {
      return visit.patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             visit.visitCode.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hồ sơ khám</h1>
          <p className="text-gray-600">Quản lý hồ sơ khám bệnh</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo hồ sơ mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo hồ sơ khám mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patient">Bệnh nhân</Label>
                  <Select
                    value={formData.patientId}
                    onValueChange={(value) => setFormData({ ...formData, patientId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn bệnh nhân" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="doctor">Bác sĩ</Label>
                  <Select
                    value={formData.doctorId}
                    onValueChange={(value) => setFormData({ ...formData, doctorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn bác sĩ" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.fullName} - {doctor.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="appointment">Lịch hẹn (tùy chọn)</Label>
                <Select
                  value={formData.appointmentId}
                  onValueChange={(value) => setFormData({ ...formData, appointmentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lịch hẹn" />
                  </SelectTrigger>
                  <SelectContent>
                    {confirmedAppointments.map((appointment) => (
                      <SelectItem key={appointment.id} value={appointment.id}>
                        {appointment.patient.fullName} - {formatDate(appointment.scheduledAt)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="preliminaryDx">Chẩn đoán sơ bộ</Label>
                <Input
                  id="preliminaryDx"
                  value={formData.preliminaryDx}
                  onChange={(e) => setFormData({ ...formData, preliminaryDx: e.target.value })}
                  placeholder="Nhập chẩn đoán sơ bộ..."
                />
              </div>
              <div>
                <Label htmlFor="symptoms">Triệu chứng</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="Mô tả triệu chứng..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="clinicalNotes">Ghi chú lâm sàng</Label>
                <Textarea
                  id="clinicalNotes"
                  value={formData.clinicalNotes}
                  onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
                  placeholder="Ghi chú lâm sàng..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateVisit} disabled={!formData.patientId || !formData.doctorId || !formData.preliminaryDx}>
                  Tạo hồ sơ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="flex space-x-2">
                <Input
                  id="search"
                  placeholder="Tìm theo tên bệnh nhân hoặc mã hồ sơ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="doctor-filter">Bác sĩ</Label>
              <Select
                value={filters.doctorId || ''}
                onValueChange={(value) => handleFilterChange('doctorId', value || undefined)}
              >
                <SelectTrigger>
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
            </div>
            <div>
              <Label htmlFor="status-filter">Trạng thái</Label>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value as VisitStatus || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  <SelectItem value="PENDING">Chờ khám</SelectItem>
                  <SelectItem value="IN_PROGRESS">Đang khám</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  <SelectItem value="CANCELLED">Hủy bỏ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date-from">Từ ngày</Label>
              <Input
                id="date-from"
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visits table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hồ sơ khám</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã hồ sơ</TableHead>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Bác sĩ</TableHead>
                <TableHead>Ngày khám</TableHead>
                <TableHead>Chẩn đoán sơ bộ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    Không có hồ sơ nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredVisits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      <div className="font-medium">{visit.visitCode}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        <div>
                          <div className="font-medium">{visit.patient.fullName}</div>
                          <div className="text-sm text-gray-500">{visit.patient.phoneNumber}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Stethoscope className="w-4 h-4 mr-2 text-gray-500" />
                        <div>
                          <div className="font-medium">{visit.doctor.fullName}</div>
                          <div className="text-sm text-gray-500">{visit.doctor.specialization}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        {formatDate(visit.visitDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{visit.preliminaryDx}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(visit.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/visits/${visit.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/visits/${visit.id}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
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
