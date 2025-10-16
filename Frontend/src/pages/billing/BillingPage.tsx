import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/utils/cn';
import { formatCurrency, formatCurrencyCompact } from '@/utils/currency';
import { formatDateForExport } from '@/utils/export';
import { billingService } from '@/api/services/billing.service';
import type { Billing, BillingFilters, BillingStatus, PaymentMethod } from '@/types';

const statusLabels = {
  DRAFT: 'Nháp',
  PENDING: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  CANCELLED: 'Đã hủy',
  REFUNDED: 'Đã hoàn tiền'
};

const statusColors = {
  DRAFT: 'secondary',
  PENDING: 'warning',
  PAID: 'default',
  CANCELLED: 'destructive',
  REFUNDED: 'outline'
} as const;

const paymentMethodLabels = {
  CASH: 'Tiền mặt',
  TRANSFER: 'Chuyển khoản',
  CARD: 'Thẻ',
  E_WALLET: 'Ví điện tử'
};

export function BillingPage() {
  const navigate = useNavigate();
  const [billings, setBillings] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const [filters, setFilters] = useState<BillingFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BillingStatus | 'ALL'>('ALL');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'ALL'>('ALL');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadBillings();
  }, [currentPage, filters]);

  const loadBillings = async () => {
    try {
      setLoading(true);
      const response = await billingService.getBillings(filters, currentPage, 10);
      setBillings(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error loading billings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const newFilters: BillingFilters = {
      ...filters,
      search: searchTerm || undefined,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      paymentMethod: methodFilter !== 'ALL' ? methodFilter : undefined,
      dateFrom: dateFrom?.toISOString(),
      dateTo: dateTo?.toISOString()
    };
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setMethodFilter('ALL');
    setDateFrom(undefined);
    setDateTo(undefined);
    setFilters({});
    setCurrentPage(0);
  };

  const handleExport = async () => {
    try {
      const blob = await billingService.exportBillings({
        format: 'excel',
        dateFrom: dateFrom?.toISOString(),
        dateTo: dateTo?.toISOString(),
        status: statusFilter !== 'ALL' ? [statusFilter] : undefined,
        paymentMethod: methodFilter !== 'ALL' ? [methodFilter] : undefined
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `billings-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting billings:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      try {
        await billingService.deleteBilling(id);
        loadBillings();
      } catch (error) {
        console.error('Error deleting billing:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý hóa đơn</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi hóa đơn dịch vụ y tế
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button onClick={() => navigate('/billing/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo hóa đơn mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Bộ lọc</CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Tìm kiếm</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Mã hóa đơn, tên bệnh nhân..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Trạng thái</label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BillingStatus | 'ALL')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Phương thức thanh toán</label>
                <Select value={methodFilter} onValueChange={(value) => setMethodFilter(value as PaymentMethod | 'ALL')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phương thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    {Object.entries(paymentMethodLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Khoảng thời gian</label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {dateFrom ? format(dateFrom, 'dd/MM/yyyy', { locale: vi }) : 'Từ ngày'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {dateTo ? format(dateTo, 'dd/MM/yyyy', { locale: vi }) : 'Đến ngày'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={handleClearFilters}>
                Xóa bộ lọc
              </Button>
              <Button onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold">{totalElements}</div>
              <div className="ml-2 text-sm text-muted-foreground">Tổng hóa đơn</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-green-600">
                {billings.filter(b => b.status === 'PAID').length}
              </div>
              <div className="ml-2 text-sm text-muted-foreground">Đã thanh toán</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-orange-600">
                {billings.filter(b => b.status === 'PENDING').length}
              </div>
              <div className="ml-2 text-sm text-muted-foreground">Chờ thanh toán</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {formatCurrencyCompact(
                  billings.reduce((sum, b) => sum + b.total, 0),
                  true
                )}
              </div>
              <div className="ml-2 text-sm text-muted-foreground">Tổng doanh thu</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hóa đơn</CardTitle>
          <CardDescription>
            Quản lý và theo dõi tất cả hóa đơn trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã hóa đơn</TableHead>
                  <TableHead>Bệnh nhân</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Phương thức</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billings.map((billing) => (
                  <TableRow key={billing.id}>
                    <TableCell className="font-medium">{billing.code}</TableCell>
                    <TableCell>{billing.patientName}</TableCell>
                    <TableCell>{formatDateForExport(billing.createdAt)}</TableCell>
                    <TableCell>{formatCurrency(billing.total)}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[billing.status]}>
                        {statusLabels[billing.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{paymentMethodLabels[billing.paymentMethod]}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/billing/${billing.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/billing/${billing.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(billing.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
              >
                Trước
              </Button>
              <span className="flex items-center px-4">
                Trang {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                Sau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
