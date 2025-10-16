import React from 'react';
import { Calendar, Filter, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from './DateRangePicker';
import { ReportFilters } from '@/types/report';

interface FilterBarProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  onExport: () => void;
  onSchedule: () => void;
  isLoading?: boolean;
}

export function FilterBar({ 
  filters, 
  onFiltersChange, 
  onExport, 
  onSchedule, 
  isLoading = false 
}: FilterBarProps) {
  const handleDateRangeChange = (dateRange: { from: Date; to: Date }) => {
    onFiltersChange({ ...filters, dateRange });
  };

  const handleDoctorChange = (doctorIds: string) => {
    const ids = doctorIds ? doctorIds.split(',') : [];
    onFiltersChange({ ...filters, doctorIds: ids.length > 0 ? ids : undefined });
  };

  const handleServiceChange = (serviceIds: string) => {
    const ids = serviceIds ? serviceIds.split(',') : [];
    onFiltersChange({ ...filters, serviceIds: ids.length > 0 ? ids : undefined });
  };

  const handlePatientTypeChange = (patientType: string) => {
    onFiltersChange({ 
      ...filters, 
      patientType: patientType === 'all' ? undefined : patientType as 'new' | 'returning' 
    });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ 
      ...filters, 
      status: status === 'all' ? undefined : status as 'completed' | 'cancelled' | 'pending' 
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.doctorIds && filters.doctorIds.length > 0) count++;
    if (filters.serviceIds && filters.serviceIds.length > 0) count++;
    if (filters.patientType) count++;
    if (filters.status) count++;
    return count;
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: filters.dateRange,
      doctorIds: undefined,
      serviceIds: undefined,
      patientType: undefined,
      status: undefined,
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc báo cáo
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} bộ lọc
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSchedule}
              disabled={isLoading}
            >
              <Settings className="h-4 w-4 mr-2" />
              Lập lịch
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Khoảng thời gian
            </label>
            <DateRangePicker
              value={filters.dateRange}
              onChange={handleDateRangeChange}
              disabled={isLoading}
            />
          </div>

          {/* Doctor Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bác sĩ</label>
            <Select
              value={filters.doctorIds?.join(',') || 'all'}
              onValueChange={handleDoctorChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn bác sĩ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả bác sĩ</SelectItem>
                <SelectItem value="1">BS. Nguyễn Văn A</SelectItem>
                <SelectItem value="2">BS. Trần Thị B</SelectItem>
                <SelectItem value="3">BS. Lê Văn C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Dịch vụ</label>
            <Select
              value={filters.serviceIds?.join(',') || 'all'}
              onValueChange={handleServiceChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn dịch vụ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả dịch vụ</SelectItem>
                <SelectItem value="1">Khám tổng quát</SelectItem>
                <SelectItem value="2">Xét nghiệm máu</SelectItem>
                <SelectItem value="3">Siêu âm</SelectItem>
                <SelectItem value="4">Chụp X-quang</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Patient Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Loại bệnh nhân</label>
            <Select
              value={filters.patientType || 'all'}
              onValueChange={handlePatientTypeChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại bệnh nhân" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="new">Bệnh nhân mới</SelectItem>
                <SelectItem value="returning">Bệnh nhân tái khám</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Trạng thái</label>
            <Select
              value={filters.status || 'all'}
              onValueChange={handleStatusChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={getActiveFiltersCount() === 0 || isLoading}
              className="w-full"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>

        {/* Quick Date Presets */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-muted-foreground">Nhanh:</span>
          {[
            { label: 'Hôm nay', days: 0 },
            { label: '7 ngày qua', days: 7 },
            { label: '30 ngày qua', days: 30 },
            { label: '3 tháng qua', days: 90 },
            { label: 'Năm nay', days: 365 },
          ].map((preset) => {
            const handlePreset = () => {
              const to = new Date();
              const from = new Date();
              from.setDate(from.getDate() - preset.days);
              onFiltersChange({ ...filters, dateRange: { from, to } });
            };

            return (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={handlePreset}
                disabled={isLoading}
              >
                {preset.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
