import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/utils/cn';
import type { DiscountCode, CreateDiscountCodeRequest, UpdateDiscountCodeRequest, DiscountType } from '@/types';

const discountSchema = z.object({
  code: z.string().min(1, 'Mã giảm giá là bắt buộc').max(50, 'Mã giảm giá không được quá 50 ký tự'),
  name: z.string().min(1, 'Tên mã giảm giá là bắt buộc').max(100, 'Tên không được quá 100 ký tự'),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT'] as const),
  value: z.number().min(0, 'Giá trị phải lớn hơn 0'),
  minOrderAmount: z.number().min(0, 'Số tiền tối thiểu phải lớn hơn 0').optional(),
  maxDiscountAmount: z.number().min(0, 'Số tiền giảm tối đa phải lớn hơn 0').optional(),
  validFrom: z.date({
    required_error: 'Ngày bắt đầu là bắt buộc'
  }),
  validTo: z.date({
    required_error: 'Ngày kết thúc là bắt buộc'
  }),
  usageLimit: z.number().min(1, 'Giới hạn sử dụng phải lớn hơn 0').optional(),
  isActive: z.boolean().default(true)
}).refine((data) => {
  if (data.type === 'PERCENTAGE' && data.value > 100) {
    return false;
  }
  return true;
}, {
  message: 'Phần trăm giảm giá không được vượt quá 100%',
  path: ['value']
}).refine((data) => {
  return data.validTo > data.validFrom;
}, {
  message: 'Ngày kết thúc phải sau ngày bắt đầu',
  path: ['validTo']
});

type DiscountFormData = z.infer<typeof discountSchema>;

interface DiscountEditorProps {
  discount?: DiscountCode;
  onSubmit: (data: CreateDiscountCodeRequest | UpdateDiscountCodeRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DiscountEditor({ discount, onSubmit, onCancel, isLoading = false }: DiscountEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: discount ? {
      code: discount.code,
      name: discount.name,
      description: discount.description || '',
      type: discount.type,
      value: discount.value,
      minOrderAmount: discount.minOrderAmount || 0,
      maxDiscountAmount: discount.maxDiscountAmount || 0,
      validFrom: new Date(discount.validFrom),
      validTo: new Date(discount.validTo),
      usageLimit: discount.usageLimit || 0,
      isActive: discount.isActive
    } : {
      code: '',
      name: '',
      description: '',
      type: 'PERCENTAGE',
      value: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      usageLimit: 0,
      isActive: true
    }
  });

  const handleSubmit = async (data: DiscountFormData) => {
    try {
      setIsSubmitting(true);
      
      const submitData = {
        ...data,
        validFrom: data.validFrom.toISOString(),
        validTo: data.validTo.toISOString(),
        minOrderAmount: data.minOrderAmount || undefined,
        maxDiscountAmount: data.maxDiscountAmount || undefined,
        usageLimit: data.usageLimit || undefined
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting discount:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const discountType = form.watch('type');
  const value = form.watch('value');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {discount ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
        </CardTitle>
        <CardDescription>
          {discount ? 'Cập nhật thông tin mã giảm giá' : 'Tạo mã giảm giá mới cho hệ thống'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã giảm giá *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã giảm giá" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên mã giảm giá *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên mã giảm giá" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Nhập mô tả mã giảm giá"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại giảm giá *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại giảm giá" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
                        <SelectItem value="FIXED_AMOUNT">Số tiền cố định (₫)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Giá trị giảm giá * 
                      {discountType === 'PERCENTAGE' && ' (%)'}
                      {discountType === 'FIXED_AMOUNT' && ' (₫)'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder={discountType === 'PERCENTAGE' ? 'Nhập phần trăm' : 'Nhập số tiền'}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      {discountType === 'PERCENTAGE' && 'Tối đa 100%'}
                      {discountType === 'FIXED_AMOUNT' && 'Số tiền giảm giá cố định'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minOrderAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền đơn hàng tối thiểu (₫)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="Nhập số tiền tối thiểu"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Đơn hàng phải có giá trị tối thiểu để áp dụng mã giảm giá
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxDiscountAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền giảm tối đa (₫)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="Nhập số tiền giảm tối đa"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Giới hạn số tiền giảm tối đa (chỉ áp dụng với giảm giá theo %)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="validFrom"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày bắt đầu *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: vi })
                            ) : (
                              <span>Chọn ngày bắt đầu</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="validTo"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày kết thúc *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: vi })
                            ) : (
                              <span>Chọn ngày kết thúc</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < form.getValues('validFrom')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới hạn sử dụng</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="Nhập giới hạn sử dụng"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Số lần sử dụng tối đa (0 = không giới hạn)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Trạng thái</FormLabel>
                      <FormDescription>
                        Kích hoạt mã giảm giá
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? 'Đang xử lý...' : (discount ? 'Cập nhật' : 'Tạo mới')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
