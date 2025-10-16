import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Filter, Download, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ReportFilters } from '@/types/report';
import { cn } from '@/utils/cn';

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customFilters, setCustomFilters] = useState<Record<string, any>>({});

  const handleDateRangeChange = (field: 'from' | 'to', date: Date | undefined) => {
    if (date) {
      onFiltersChange({
        ...filters,
        dateRange: {
          ...filters.dateRange,
          [field]: date
        }
      });
    }
  };

  const handleDoctorChange = (doctorId: string) => {
    onFiltersChange({
      ...filters,
      doctorId: doctorId === 'all' ? undefined : doctorId
    });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status === 'all' ? undefined : status
    });
  };

  const handleCustomFilterChange = (key: string, value: any) => {
    const newCustomFilters = { ...customFilters, [key]: value };
    setCustomFilters(newCustomFilters);
    onFiltersChange({
      ...filters,
      customFilters: newCustomFilters
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      }
    });
    setCustomFilters({});
  };

  const hasActiveFilters = filters.doctorId || filters.status || Object.keys(customFilters).length > 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Main Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? (
                      format(filters.dateRange.from, "dd/MM/yyyy", { locale: vi })
                    ) : (
                      "Chọn ngày"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from}
                    onSelect={(date) => handleDateRangeChange('from', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to ? (
                      format(filters.dateRange.to, "dd/MM/yyyy", { locale: vi })
                    ) : (
                      "Chọn ngày"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to}
                    onSelect={(date) => handleDateRangeChange('to', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Doctor Selection */}
            <div className="space-y-2">
              <Label>Bác sĩ</Label>
              <Select value={filters.doctorId || 'all'} onValueChange={handleDoctorChange}>
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

            {/* Status Selection */}
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Khoảng tuổi</Label>
                  <Select onValueChange={(value) => handleCustomFilterChange('ageRange', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khoảng tuổi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-18">0-18 tuổi</SelectItem>
                      <SelectItem value="19-35">19-35 tuổi</SelectItem>
                      <SelectItem value="36-50">36-50 tuổi</SelectItem>
                      <SelectItem value="51-65">51-65 tuổi</SelectItem>
                      <SelectItem value="65+">Trên 65 tuổi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Giới tính</Label>
                  <Select onValueChange={(value) => handleCustomFilterChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Khoảng doanh thu</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Từ"
                      type="number"
                      onChange={(e) => handleCustomFilterChange('revenueFrom', e.target.value)}
                    />
                    <Input
                      placeholder="Đến"
                      type="number"
                      onChange={(e) => handleCustomFilterChange('revenueTo', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showAdvanced ? 'Ẩn bộ lọc nâng cao' : 'Bộ lọc nâng cao'}
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onSchedule}
                disabled={isLoading}
              >
                <Clock className="h-4 w-4 mr-2" />
                Lên lịch báo cáo
              </Button>
              
              <Button
                onClick={onExport}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {filters.doctorId && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Bác sĩ: {filters.doctorId}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleDoctorChange('all')}
                  />
                </Badge>
              )}
              {filters.status && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Trạng thái: {filters.status}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleStatusChange('all')}
                  />
                </Badge>
              )}
              {Object.entries(customFilters).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="flex items-center gap-1">
                  {key}: {value}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => {
                      const newCustomFilters = { ...customFilters };
                      delete newCustomFilters[key];
                      setCustomFilters(newCustomFilters);
                      onFiltersChange({
                        ...filters,
                        customFilters: newCustomFilters
                      });
                    }}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}