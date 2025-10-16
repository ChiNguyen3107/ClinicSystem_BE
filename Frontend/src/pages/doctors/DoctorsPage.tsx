import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { useDoctorStore } from '@/store/doctor.store';
import { toast } from 'sonner';

const DoctorsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    doctors,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    loading,
    error,
    filters,
    setFilters,
    fetchDoctors,
    deleteDoctor,
    clearError
  } = useDoctorStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const specialties = [
    'Tim mạch',
    'Nhi khoa', 
    'Ngoại khoa',
    'Sản phụ khoa',
    'Thần kinh',
    'Da liễu',
    'Mắt',
    'Tai mũi họng',
    'Nội tiết',
    'Tiêu hóa',
    'Hô hấp',
    'Ung bướu',
    'Xương khớp',
    'Tâm thần',
    'Y học cổ truyền'
  ];

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSearch = () => {
    setFilters({
      search: searchTerm,
      specialty: selectedSpecialty || undefined,
      status: selectedStatus || undefined,
      page: 0
    });
    fetchDoctors();
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
    fetchDoctors();
  };

  const handleDeleteDoctor = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bác sĩ ${name}?`)) {
      try {
        await deleteDoctor(id);
        toast.success('Xóa bác sĩ thành công');
        fetchDoctors();
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa bác sĩ');
      }
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Bác sĩ</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin và lịch làm việc của bác sĩ
          </p>
        </div>
        <Button onClick={() => navigate('/doctors/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm bác sĩ mới
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, chuyên khoa, số bằng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Chuyên khoa</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả chuyên khoa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả chuyên khoa</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                  <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                  <SelectItem value="SUSPENDED">Tạm ngưng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <Button onClick={handleSearch} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách bác sĩ ({totalElements} bác sĩ)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bác sĩ</TableHead>
                    <TableHead>Chuyên khoa</TableHead>
                    <TableHead>Số bằng</TableHead>
                    <TableHead>Phòng</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={doctor.avatar} />
                            <AvatarFallback>
                              {getInitials(doctor.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{doctor.fullName}</div>
                            <div className="text-sm text-muted-foreground">
                              {doctor.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doctor.specialty}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {doctor.licenseNo}
                      </TableCell>
                      <TableCell>
                        {doctor.room || 'Chưa phân công'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(doctor.status)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => navigate(`/doctors/${doctor.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigate(`/doctors/${doctor.id}/edit`)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteDoctor(doctor.id, doctor.fullName)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {doctors.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Không tìm thấy bác sĩ nào</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage + 1}
                    totalPages={totalPages}
                    onPageChange={(page) => handlePageChange(page - 1)}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorsPage;
