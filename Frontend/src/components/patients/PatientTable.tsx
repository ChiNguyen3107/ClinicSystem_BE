import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Eye, 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateOfBirth, formatPhoneNumber, formatGender, formatStatus } from '@/utils/format';
import type { Patient } from '@/types/patient';

interface PatientTableProps {
  patients: Patient[];
  loading?: boolean;
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  onSort: (field: string) => void;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onSort,
  sortField,
  sortDirection,
}) => {
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'ASC' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const handleSort = (field: string) => {
    onSort(field);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (patients.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">Không có bệnh nhân nào</div>
          <div className="text-sm text-gray-400">Hãy thêm bệnh nhân đầu tiên</div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('code')}
            >
              <div className="flex items-center gap-2">
                Mã BN
                {getSortIcon('code')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-2">
                Họ tên
                {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('gender')}
            >
              <div className="flex items-center gap-2">
                Giới tính
                {getSortIcon('gender')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('dateOfBirth')}
            >
              <div className="flex items-center gap-2">
                Ngày sinh
                {getSortIcon('dateOfBirth')}
              </div>
            </TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-2">
                Trạng thái
                {getSortIcon('status')}
              </div>
            </TableHead>
            <TableHead className="w-[50px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {patient.code}
                </code>
              </TableCell>
              <TableCell className="font-medium">
                {patient.name}
              </TableCell>
              <TableCell>
                {formatGender(patient.gender)}
              </TableCell>
              <TableCell>
                {formatDateOfBirth(patient.dateOfBirth)}
              </TableCell>
              <TableCell>
                {formatPhoneNumber(patient.phone)}
              </TableCell>
              <TableCell>
                {patient.email || '-'}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {patient.address || '-'}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={patient.status === 'ACTIVE' ? 'default' : 'secondary'}
                >
                  {formatStatus(patient.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(patient)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(patient)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(patient)}
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
    </Card>
  );
};
