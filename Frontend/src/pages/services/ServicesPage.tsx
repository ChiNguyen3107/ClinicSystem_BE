import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Skeleton } from '../../components/ui/skeleton';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  TrendingUp,
  DollarSign,
  Clock,
  Package
} from 'lucide-react';
import { MedicalService, ServiceCategory, ServiceFilters } from '../../types/service';
import { medicalServiceService } from '../../api/services/medicalService.service';
import { indicatorService } from '../../api/services/indicator.service';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { ServiceForm } from '../../components/services/ServiceForm';
import { PriceHistory } from '../../components/services/PriceHistory';
import { BulkPriceDialog } from '../../components/services/BulkPriceDialog';

const categoryLabels: Record<ServiceCategory, string> = {
  EXAMINATION: 'Khám bệnh',
  DIAGNOSTIC: 'Chẩn đoán',
  TREATMENT: 'Điều trị',
  CONSULTATION: 'Tư vấn'
};

const statusLabels = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Không hoạt động'
};

const statusVariants = {
  ACTIVE: 'default',
  INACTIVE: 'secondary'
} as const;

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<MedicalService[]>([]);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ServiceFilters>({
    search: '',
    category: undefined,
    status: undefined,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isPriceHistoryDialogOpen, setIsPriceHistoryDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await medicalServiceService.getServices({
        ...filters,
        page: pagination.page,
        size: pagination.size
      });
      setServices(response.content);
      setPagination(prev => ({
        ...prev,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }));
    } catch (err) {
      setError('Không thể tải danh sách dịch vụ');
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
    loadIndicators();
  }, [filters, pagination.page, pagination.size]);

  const loadIndicators = async () => {
    try {
      const response = await indicatorService.getIndicators();
      setIndicators(response.content);
    } catch (err) {
      console.error('Error loading indicators:', err);
    }
  };

  const handleCreateService = async (data: any) => {
    try {
      await medicalServiceService.createService(data);
      setIsCreateDialogOpen(false);
      loadServices();
    } catch (err) {
      console.error('Error creating service:', err);
    }
  };

  const handleUpdateService = async (data: any) => {
    if (!selectedService) return;
    try {
      await medicalServiceService.updateService(selectedService.id, data);
      setIsEditDialogOpen(false);
      setSelectedService(null);
      loadServices();
    } catch (err) {
      console.error('Error updating service:', err);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) return;
    try {
      await medicalServiceService.deleteService(serviceId);
      loadServices();
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  const handleViewService = async (service: MedicalService) => {
    setSelectedService(service);
    setIsViewDialogOpen(true);
    
    // Load price history
    try {
      const history = await medicalServiceService.getPriceHistory(service.id);
      setPriceHistory(history);
    } catch (err) {
      console.error('Error loading price history:', err);
    }
  };

  const handleEditService = (service: MedicalService) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePrice = async (newPrice: number, effectiveDate: string, reason?: string) => {
    if (!selectedService) return;
    try {
      await medicalServiceService.updateServicePrice(selectedService.id, newPrice, effectiveDate, reason);
      // Reload price history
      const history = await medicalServiceService.getPriceHistory(selectedService.id);
      setPriceHistory(history);
      loadServices(); // Reload services to update current price
    } catch (err) {
      console.error('Error updating price:', err);
    }
  };

  const handleBulkUpdatePrices = async (updates: any[]) => {
    try {
      await medicalServiceService.bulkUpdatePrices(updates);
      loadServices();
    } catch (err) {
      console.error('Error bulk updating prices:', err);
    }
  };

  const handleFilterChange = (key: keyof ServiceFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading && services.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý dịch vụ</h1>
            <p className="text-gray-600">Quản lý các dịch vụ y tế của phòng khám</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-full mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý dịch vụ</h1>
          <p className="text-gray-600">Quản lý các dịch vụ y tế của phòng khám</p>
        </div>
        <div className="flex gap-2">
          <BulkPriceDialog
            onBulkUpdate={handleBulkUpdatePrices}
            services={services.map(s => ({
              id: s.id,
              name: s.name,
              currentPrice: s.price
            }))}
          />
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm dịch vụ
          </Button>
        </div>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm theo tên dịch vụ..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Danh mục</label>
              <Select
                value={filters.category || ''}
                onValueChange={(value) => handleFilterChange('category', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả danh mục</SelectItem>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sắp xếp</label>
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Tên A-Z</SelectItem>
                  <SelectItem value="name-desc">Tên Z-A</SelectItem>
                  <SelectItem value="price-asc">Giá thấp-cao</SelectItem>
                  <SelectItem value="price-desc">Giá cao-thấp</SelectItem>
                  <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
                  <SelectItem value="createdAt-asc">Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách dịch vụ</CardTitle>
          <CardDescription>
            {pagination.totalElements} dịch vụ được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên dịch vụ</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      {service.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {service.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {categoryLabels[service.category]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{formatCurrency(service.price)}</span>
                    </div>
                    <div className="text-sm text-gray-500">{service.unit}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{service.duration} phút</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[service.status]}>
                      {statusLabels[service.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(service.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewService(service)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {services.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Không có dịch vụ nào được tìm thấy</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 0}
          >
            Trước
          </Button>
          <span className="text-sm text-gray-600">
            Trang {pagination.page + 1} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages - 1}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Create Service Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm dịch vụ mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin dịch vụ y tế mới
            </DialogDescription>
          </DialogHeader>
          <ServiceForm
            indicators={indicators}
            onSubmit={handleCreateService}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa dịch vụ</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin dịch vụ
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <ServiceForm
              service={selectedService}
              indicators={indicators}
              onSubmit={handleUpdateService}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedService(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Service Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết dịch vụ</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết và lịch sử giá của dịch vụ
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedService.name}</CardTitle>
                  <CardDescription>{selectedService.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Danh mục</label>
                      <p>{categoryLabels[selectedService.category]}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Giá</label>
                      <p className="font-medium">{formatCurrency(selectedService.price)} {selectedService.unit}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Thời gian</label>
                      <p>{selectedService.duration} phút</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                      <Badge variant={statusVariants[selectedService.status]}>
                        {statusLabels[selectedService.status]}
                      </Badge>
                    </div>
                  </div>
                  {selectedService.preparation && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-500">Chuẩn bị</label>
                      <p className="mt-1">{selectedService.preparation}</p>
                    </div>
                  )}
                  {selectedService.notes && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-500">Ghi chú</label>
                      <p className="mt-1">{selectedService.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <PriceHistory
                serviceId={selectedService.id}
                priceHistory={priceHistory}
                onUpdatePrice={handleUpdatePrice}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
