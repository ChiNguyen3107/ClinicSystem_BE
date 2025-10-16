import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';
import { MedicalService, ServiceCategory, CreateMedicalServiceRequest, UpdateMedicalServiceRequest } from '../../types/service';
import { Indicator } from '../../types/indicator';

const serviceFormSchema = z.object({
  name: z.string().min(1, 'Tên dịch vụ là bắt buộc'),
  description: z.string().optional(),
  category: z.enum(['EXAMINATION', 'DIAGNOSTIC', 'TREATMENT', 'CONSULTATION']),
  price: z.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
  unit: z.string().min(1, 'Đơn vị là bắt buộc'),
  duration: z.number().min(1, 'Thời gian phải lớn hơn 0'),
  preparation: z.string().optional(),
  notes: z.string().optional(),
  indicators: z.array(z.string()).optional()
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  service?: MedicalService;
  indicators: Indicator[];
  onSubmit: (data: CreateMedicalServiceRequest | UpdateMedicalServiceRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const categoryLabels: Record<ServiceCategory, string> = {
  EXAMINATION: 'Khám bệnh',
  DIAGNOSTIC: 'Chẩn đoán',
  TREATMENT: 'Điều trị',
  CONSULTATION: 'Tư vấn'
};

export const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  indicators,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      category: service?.category || 'EXAMINATION',
      price: service?.price || 0,
      unit: service?.unit || '',
      duration: service?.duration || 30,
      preparation: service?.preparation || '',
      notes: service?.notes || '',
      indicators: service?.indicators?.map(i => i.id) || []
    }
  });

  const selectedIndicators = watch('indicators') || [];

  const handleFormSubmit = (data: ServiceFormData) => {
    onSubmit(data);
  };

  const toggleIndicator = (indicatorId: string) => {
    const current = selectedIndicators;
    const updated = current.includes(indicatorId)
      ? current.filter(id => id !== indicatorId)
      : [...current, indicatorId];
    setValue('indicators', updated);
  };

  const removeIndicator = (indicatorId: string) => {
    const updated = selectedIndicators.filter(id => id !== indicatorId);
    setValue('indicators', updated);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{service ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</CardTitle>
        <CardDescription>
          {service ? 'Cập nhật thông tin dịch vụ' : 'Nhập thông tin dịch vụ y tế mới'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên dịch vụ *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Nhập tên dịch vụ"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục *</Label>
              <Select
                value={watch('category')}
                onValueChange={(value) => setValue('category', value as ServiceCategory)}
              >
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Nhập mô tả dịch vụ"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VND) *</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { valueAsNumber: true })}
                placeholder="0"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Đơn vị *</Label>
              <Input
                id="unit"
                {...register('unit')}
                placeholder="lần, buổi, gói..."
                className={errors.unit ? 'border-red-500' : ''}
              />
              {errors.unit && (
                <p className="text-sm text-red-500">{errors.unit.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Thời gian (phút) *</Label>
              <Input
                id="duration"
                type="number"
                {...register('duration', { valueAsNumber: true })}
                placeholder="30"
                className={errors.duration ? 'border-red-500' : ''}
              />
              {errors.duration && (
                <p className="text-sm text-red-500">{errors.duration.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preparation">Chuẩn bị</Label>
            <Textarea
              id="preparation"
              {...register('preparation')}
              placeholder="Hướng dẫn chuẩn bị cho bệnh nhân"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Ghi chú bổ sung"
              rows={2}
            />
          </div>

          <div className="space-y-4">
            <Label>Chỉ số y tế</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {indicators.map((indicator) => (
                <div
                  key={indicator.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedIndicators.includes(indicator.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleIndicator(indicator.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{indicator.name}</p>
                      {indicator.description && (
                        <p className="text-sm text-gray-600">{indicator.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {indicator.type}
                        </Badge>
                        {indicator.unit && (
                          <Badge variant="secondary" className="text-xs">
                            {indicator.unit}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {selectedIndicators.includes(indicator.id) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeIndicator(indicator.id);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {selectedIndicators.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedIndicators.map((indicatorId) => {
                  const indicator = indicators.find(i => i.id === indicatorId);
                  return indicator ? (
                    <Badge key={indicatorId} variant="default" className="flex items-center gap-1">
                      {indicator.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeIndicator(indicatorId)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang lưu...' : (service ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
