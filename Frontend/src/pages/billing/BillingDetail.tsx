import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Edit, Trash2, Printer, Mail, Download, Eye, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { formatDateForExport, formatDateTimeForExport } from '@/utils/export';
import { billingService } from '@/api/services/billing.service';
import { PaymentPanel, Receipt } from '@/components/billing';
import type { Billing, BillingStatus, PaymentMethod } from '@/types';

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

export function BillingDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [billing, setBilling] = useState<Billing | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);

  useEffect(() => {
    if (id) {
      loadBilling();
    }
  }, [id]);

  const loadBilling = async () => {
    try {
      setLoading(true);
      const response = await billingService.getBillingById(id!);
      setBilling(response.data);
    } catch (error) {
      console.error('Error loading billing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (data: any) => {
    try {
      await billingService.processPayment(data);
      setShowPaymentDialog(false);
      loadBilling();
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handlePrint = async () => {
    try {
      const blob = await billingService.printInvoice(id!);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${billing?.code}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error printing invoice:', error);
    }
  };

  const handleEmail = async () => {
    const email = prompt('Nhập email để gửi hóa đơn:');
    if (email) {
      try {
        await billingService.sendInvoiceByEmail(id!, email);
        alert('Hóa đơn đã được gửi qua email!');
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      try {
        await billingService.deleteBilling(id!);
        navigate('/billing');
      } catch (error) {
        console.error('Error deleting billing:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!billing) {
    return (
      <div className="text-center py-8">
        <p>Không tìm thấy hóa đơn</p>
        <Button onClick={() => navigate('/billing')} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/billing')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Chi tiết hóa đơn</h1>
            <p className="text-muted-foreground">Mã hóa đơn: {billing.code}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate(`/billing/${billing.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            In hóa đơn
          </Button>
          <Button variant="outline" onClick={handleEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Gửi email
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </Button>
        </div>
      </div>

      {/* Billing Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin hóa đơn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Mã hóa đơn</p>
              <p className="font-medium">{billing.code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bệnh nhân</p>
              <p className="font-medium">{billing.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày tạo</p>
              <p className="font-medium">{formatDateForExport(billing.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trạng thái</p>
              <Badge variant={statusColors[billing.status]}>
                {statusLabels[billing.status]}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phương thức thanh toán</p>
              <p className="font-medium">{paymentMethodLabels[billing.paymentMethod]}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng tiền</p>
              <p className="font-medium text-lg">{formatCurrency(billing.total)}</p>
            </div>
            {billing.paidAt && (
              <div>
                <p className="text-sm text-muted-foreground">Ngày thanh toán</p>
                <p className="font-medium">{formatDateTimeForExport(billing.paidAt)}</p>
              </div>
            )}
            {billing.notes && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Ghi chú</p>
                <p className="font-medium">{billing.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Chi tiết</TabsTrigger>
          <TabsTrigger value="payment">Thanh toán</TabsTrigger>
          <TabsTrigger value="receipt">Hóa đơn</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          {/* Services */}
          {billing.services.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dịch vụ</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên dịch vụ</TableHead>
                      <TableHead className="text-right">Số lượng</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billing.services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>{service.serviceName}</TableCell>
                        <TableCell className="text-right">{service.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(service.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(service.totalPrice)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Medications */}
          {billing.medications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Thuốc</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên thuốc</TableHead>
                      <TableHead className="text-right">Số lượng</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billing.medications.map((medication) => (
                      <TableRow key={medication.id}>
                        <TableCell>{medication.medicationName}</TableCell>
                        <TableCell className="text-right">{medication.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(medication.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(medication.totalPrice)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>Tổng kết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tổng tiền dịch vụ:</span>
                  <span>{formatCurrency(billing.subtotal)}</span>
                </div>
                {billing.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{formatCurrency(billing.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>VAT ({billing.vatRate}%):</span>
                  <span>{formatCurrency(billing.vatAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(billing.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <PaymentPanel
            billing={billing}
            onProcessPayment={handleProcessPayment}
          />
        </TabsContent>

        <TabsContent value="receipt">
          <Receipt
            billing={billing}
            onPrint={handlePrint}
            onEmail={handleEmail}
            showActions={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
