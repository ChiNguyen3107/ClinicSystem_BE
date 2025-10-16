import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Download, CreditCard, Percent } from 'lucide-react';
import { Billing, ServiceOrder, Prescription, BillingStatus } from '@/types/medication';
import { formatCurrency, calculateDiscount, calculateTotal } from '@/utils/currency';

interface BillingPreviewProps {
  billing?: Billing | null;
  serviceOrders: ServiceOrder[];
  prescription?: Prescription | null;
  onUpdateBilling: (discount: number, discountReason?: string) => void;
  onMarkAsPaid: () => void;
  onGeneratePDF: () => void;
  loading?: boolean;
}

const statusConfig = {
  PENDING: { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800' },
  PAID: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
};

export function BillingPreview({
  billing,
  serviceOrders,
  prescription,
  onUpdateBilling,
  onMarkAsPaid,
  onGeneratePDF,
  loading = false
}: BillingPreviewProps) {
  const [discount, setDiscount] = useState(0);
  const [discountReason, setDiscountReason] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (billing) {
      setDiscount(billing.discount);
      setDiscountReason(billing.discountReason || '');
    }
  }, [billing]);

  const calculateServiceTotal = () => {
    return serviceOrders.reduce((total, order) => total + order.service.price, 0);
  };

  const calculatePrescriptionTotal = () => {
    if (!prescription) return 0;
    return prescription.medications.reduce((total, item) => total + item.totalPrice, 0);
  };

  const calculateSubtotal = () => {
    return calculateServiceTotal() + calculatePrescriptionTotal();
  };

  const handleSaveDiscount = () => {
    onUpdateBilling(discount, discountReason);
    setIsEditing(false);
  };

  const getStatusBadge = (status: BillingStatus) => {
    const config = statusConfig[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hóa đơn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const subtotal = calculateSubtotal();
  const discountAmount = calculateDiscount(subtotal, discount);
  const total = calculateTotal(subtotal, discountAmount);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hóa đơn</CardTitle>
        <div className="flex space-x-2">
          {billing && (
            <>
              {billing.status === 'PENDING' && (
                <Button onClick={onMarkAsPaid}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Đánh dấu đã thanh toán
                </Button>
              )}
              <Button variant="outline" onClick={onGeneratePDF}>
                <Download className="w-4 h-4 mr-2" />
                Xuất PDF
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Billing status */}
        {billing && (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">Trạng thái:</span>
              <div className="mt-1">{getStatusBadge(billing.status)}</div>
            </div>
            {billing.paidAt && (
              <div className="text-sm text-gray-500">
                Thanh toán: {new Date(billing.paidAt).toLocaleString('vi-VN')}
              </div>
            )}
          </div>
        )}

        {/* Service orders */}
        {serviceOrders.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Dịch vụ y tế</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Giá</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.service.name}</div>
                        <div className="text-sm text-gray-500">{order.service.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(order.service.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Prescription */}
        {prescription && prescription.medications.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Đơn thuốc</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thuốc</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đơn giá</TableHead>
                  <TableHead>Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescription.medications.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.medication.name}</div>
                        <div className="text-sm text-gray-500">{item.dosage}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity} {item.unit}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell>{formatCurrency(item.totalPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Billing summary */}
        <div className="space-y-4">
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            {/* Discount section */}
            <div className="space-y-2">
              {!isEditing ? (
                <div className="flex justify-between items-center">
                  <span>Giảm giá:</span>
                  <div className="flex items-center space-x-2">
                    <span>{formatCurrency(discountAmount)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Percent className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Label htmlFor="discount">Giảm giá (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        value={discount}
                        onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="discount-reason">Lý do giảm giá</Label>
                      <Input
                        id="discount-reason"
                        value={discountReason}
                        onChange={(e) => setDiscountReason(e.target.value)}
                        placeholder="Ví dụ: Bảo hiểm y tế"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Hủy
                    </Button>
                    <Button size="sm" onClick={handleSaveDiscount}>
                      Lưu
                    </Button>
                  </div>
                </div>
              )}
              
              {discountReason && (
                <div className="text-sm text-gray-500">
                  Lý do: {discountReason}
                </div>
              )}
            </div>
            
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Prescription notes */}
        {prescription?.notes && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-1">Ghi chú đơn thuốc:</h5>
            <p className="text-sm text-blue-800">{prescription.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
