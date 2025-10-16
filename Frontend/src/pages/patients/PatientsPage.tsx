import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { PatientTable } from '@/components/patients/PatientTable';
import { PatientForm } from './PatientForm';
import { PatientDetail } from './PatientDetail';
import { usePatientStore } from '@/store/patient.store';
import { patientService } from '@/api/services/patient.service';
import { usePatientList, usePatientFilters, usePatientUI } from '@/store/patient.store';

export const PatientsPage: React.FC = () => {
  const {
    patients,
    loading,
    error,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
  } = usePatientList();

  const {
    keyword,
    sortField,
    sortDirection,
  } = usePatientFilters();

  const {
    isFormOpen,
    isDetailOpen,
    isDeleteConfirmOpen,
    selectedPatient,
    patientToDelete,
  } = usePatientUI();

  const {
    setPatients,
    setPagination,
    setKeyword,
    setSort,
    setLoading,
    setError,
    openForm,
    openDetail,
    openDeleteConfirm,
    closeForm,
    closeDetail,
    closeDeleteConfirm,
  } = usePatientStore();

  const [searchValue, setSearchValue] = useState(keyword);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load patients data
  const loadPatients = async (page = 0, search = keyword, sort = sortField, direction = sortDirection) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await patientService.getPatients({
        keyword: search,
        page,
        size: pageSize,
        sort,
        direction,
      });

      setPatients(response.content);
      setPagination({
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.number,
        pageSize: response.size,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách bệnh nhân');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadPatients();
  }, []);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setKeyword(value);
    loadPatients(0, value);
  };

  // Handle sort
  const handleSort = (field: string) => {
    const newDirection = sortField === field && sortDirection === 'ASC' ? 'DESC' : 'ASC';
    setSort(field, newDirection);
    loadPatients(currentPage, keyword, field, newDirection);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    loadPatients(page, keyword, sortField, sortDirection);
  };

  // Handle create
  const handleCreate = () => {
    openForm();
  };

  // Handle edit
  const handleEdit = (patient: any) => {
    openForm(patient);
  };

  // Handle view
  const handleView = (patient: any) => {
    openDetail(patient);
  };

  // Handle delete
  const handleDelete = (patient: any) => {
    openDeleteConfirm(patient);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!patientToDelete) return;

    try {
      setIsDeleting(true);
      
      // Check if patient can be deleted
      const canDelete = await patientService.canDeletePatient(patientToDelete.id);
      if (!canDelete.canDelete) {
        setError(canDelete.reason || 'Không thể xóa bệnh nhân này');
        return;
      }

      await patientService.deletePatient(patientToDelete.id);
      closeDeleteConfirm();
      
      // Reload data
      loadPatients(currentPage, keyword, sortField, sortDirection);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa bệnh nhân');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    loadPatients(currentPage, keyword, sortField, sortDirection);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadPatients(currentPage, keyword, sortField, sortDirection);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Bệnh nhân</h1>
          <p className="text-gray-600">
            Tổng cộng {totalElements} bệnh nhân
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm bệnh nhân
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Tìm kiếm và lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên, mã, số điện thoại..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchValue);
                    }
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={() => handleSearch(searchValue)}>
              Tìm kiếm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patients Table */}
      <PatientTable
        patients={patients}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} 
                trong tổng số {totalElements} bệnh nhân
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
                <span className="px-3 py-2 text-sm">
                  Trang {currentPage + 1} / {totalPages}
                </span>
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
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      {isFormOpen && (
        <PatientForm
          patient={selectedPatient}
          onSuccess={handleFormSuccess}
          onCancel={closeForm}
        />
      )}

      {/* Detail Dialog */}
      {isDetailOpen && selectedPatient && (
        <PatientDetail
          patientId={selectedPatient.id}
          onEdit={handleEdit}
          onClose={closeDetail}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={closeDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Xác nhận xóa bệnh nhân
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bệnh nhân "{patientToDelete?.name}" không? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteConfirm} disabled={isDeleting}>
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Trash2 className="h-4 w-4 mr-2 animate-spin" />}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
