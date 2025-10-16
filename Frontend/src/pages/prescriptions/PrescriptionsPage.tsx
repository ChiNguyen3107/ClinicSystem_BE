import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { prescriptionService } from '@/api/services/prescription.service';
import { doctorService } from '@/api/services/doctor.service';
import { patientService } from '@/api/services/patient.service';
import type { Prescription, PrescriptionFilters, Doctor, Patient } from '@/types';

export function PrescriptionsPage() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PrescriptionFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Load data
  useEffect(() => {
    loadPrescriptions();
    loadDoctors();
    loadPatients();
  }, [filters, currentPage]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await prescriptionService.getPrescriptions({
        ...filters,
        search: searchQuery || undefined,
        page: currentPage,
        size: 10
      });
      setPrescriptions(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Lỗi tải danh sách đơn thuốc:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await doctorService.getDoctors({ page: 0, size: 100 });
      setDoctors(response.content);
    } catch (error) {
      console.error('Lỗi tải danh sách bác sĩ:', error);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await patientService.getPatients({ page: 0, size: 100 });
      setPatients(response.content);
    } catch (error) {
      console.error('Lỗi tải danh sách bệnh nhân:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const handleFilterChange = (key: keyof PrescriptionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await prescriptionService.updatePrescriptionStatus(id, status);
      loadPrescriptions();
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa đơn thuốc này?')) {
      try {
        await prescriptionService.deletePrescription(id);
        loadPrescriptions();
      } catch (error) {
        console.error('Lỗi xóa đơn thuốc:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { label: 'Nháp', variant: 'secondary' as const },
      ACTIVE: { label: 'Hoạt động', variant: 'default' as const },
      COMPLETED: { label: 'Hoàn thành', variant: 'outline' as const },
      CANCELLED: { label: 'Hủy', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Đơn thuốc</h1>
          <p className="text-muted-foreground">
            Tổng cộng {totalElements} đơn thuốc
          </p>
        </div>
        <Button onClick={() => navigate('/prescriptions/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo đơn thuốc mới
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo mã đơn, bệnh nhân..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Trạng thái</label>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  <SelectItem value="DRAFT">Nháp</SelectItem>
                  <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  <SelectItem value="CANCELLED">Hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Bác sĩ</label>
              <Select
                value={filters.doctorId?.toString() || ''}
                onValueChange={(value) => handleFilterChange('doctorId', value ? parseInt(value) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả bác sĩ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả bác sĩ</SelectItem>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.account.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Bệnh nhân</label>
              <Select
                value={filters.patientId?.toString() || ''}
                onValueChange={(value) => handleFilterChange('patientId', value ? parseInt(value) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả bệnh nhân" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả bệnh nhân</SelectItem>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setFilters({});
                setSearchQuery('');
                setCurrentPage(0);
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Bác sĩ</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : prescriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Không có đơn thuốc nào
                  </TableCell>
                </TableRow>
              ) : (
                prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell className="font-mono">
                      {prescription.code}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{prescription.patient.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {prescription.patient.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{prescription.doctor.account.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {prescription.doctor.specialty}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(prescription.createdAt)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(prescription.status)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(prescription.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/prescriptions/${prescription.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/prescriptions/${prescription.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(prescription.id)}
                          className="text-destructive hover:text-destructive"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {currentPage * 10 + 1} - {Math.min((currentPage + 1) * 10, totalElements)} trong {totalElements} kết quả
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              Trước
            </Button>
            <span className="text-sm">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
