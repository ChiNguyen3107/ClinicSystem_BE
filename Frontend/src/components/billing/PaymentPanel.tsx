import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Banknote, Smartphone, Wallet } from 'lucide-react';
import { formatCurrency, calculateBillingTotals } from '@/utils/currency';
import type { Billing, PaymentMethod, ProcessPaymentRequest } from '@/types';

const paymentSchema = z.object({
  amount: z.number().min(0, 'Số tiền phải lớn hơn 0'),
  method: z.enum(['CASH', 'TRANSFER', 'CARD', 'E_WALLET'] as const),
  transactionId: z.string().optional(),
  notes: z.string().optional()
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentPanelProps {
  billing: Billing;
  onProcessPayment: (data: ProcessPaymentRequest) => Promise<void>;
  isLoading?: boolean;
}

const paymentMethodIcons = {
  CASH: Banknote,
  TRANSFER: CreditCard,
  CARD: CreditCard,
  E_WALLET: Smartphone
};

const paymentMethodLabels = {
  CASH: 'Tiền mặt',
  TRANSFER: 'Chuyển khoản',
  CARD: 'Thẻ',
  E_WALLET: 'Ví điện tử'
};

export function PaymentPanel({ billing, onProcessPayment, isLoading = false }: PaymentPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: billing.total,
      method: 'CASH',
      transactionId: '',
      notes: ''
    }
  });

  const handleSubmit = async (data: PaymentFormData) => {
    try {
      setIsSubmitting(true);
      await onProcessPayment({
        billingId: billing.id,
        amount: data.amount,
        method: data.method,
        transactionId: data.transactionId || undefined,
        notes: data.notes || undefined
      });
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = calculateBillingTotals(billing.subtotal, billing.discountAmount, billing.vatRate);
  const remainingAmount = billing.total - (billing.paidAt ? billing.total : 0);

  return (
    <div className="space-y-6">
      {/* Billing Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Thông tin hóa đơn</span>
            <Badge variant={billing.status === 'PAID' ? 'default' : 'secondary'}>
              {billing.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Mã hóa đơn</Label>
              <p className="font-medium">{billing.code}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Bệnh nhân</Label>
              <p className="font-medium">{billing.patientName}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Ngày tạo</Label>
              <p className="font-medium">
                {new Date(billing.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Phương thức thanh toán</Label>
              <p className="font-medium">
                {paymentMethodLabels[billing.paymentMethod]}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tổng tiền dịch vụ:</span>
              <span>{formatCurrency(billing.subtotal)}</span>
            </div>
            {billing.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá:</span>
                <span>-{formatCurrency(billing.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT ({billing.vatRate}%):</span>
              <span>{formatCurrency(billing.vatAmount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(billing.total)}</span>
            </div>
            {billing.paidAt && (
              <div className="flex justify-between text-green-600">
                <span>Đã thanh toán:</span>
                <span>{formatCurrency(billing.total)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      {billing.status !== 'PAID' && (
        <Card>
          <CardHeader>
            <CardTitle>Thanh toán</CardTitle>
            <CardDescription>
              Xử lý thanh toán cho hóa đơn này
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số tiền thanh toán *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Nhập số tiền thanh toán"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phương thức thanh toán *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn phương thức thanh toán" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(paymentMethodLabels).map(([value, label]) => {
                            const Icon = paymentMethodIcons[value as PaymentMethod];
                            return (
                              <SelectItem key={value} value={value}>
                                <div className="flex items-center space-x-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transactionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã giao dịch</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nhập mã giao dịch (nếu có)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Nhập ghi chú thanh toán"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isLoading}
                    className="w-full"
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      {billing.paidAt && (
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Đã thanh toán</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(billing.total)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(billing.paidAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
