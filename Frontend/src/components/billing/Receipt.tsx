import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer, Mail, Download, Eye } from 'lucide-react';
import { formatCurrency, formatDateForExport } from '@/utils/currency';
import { formatDateTimeForExport } from '@/utils/export';
import type { Billing, PaymentMethod } from '@/types';

interface ReceiptProps {
  billing: Billing;
  onPrint?: () => void;
  onEmail?: () => void;
  onDownload?: () => void;
  onView?: () => void;
  showActions?: boolean;
}

const paymentMethodLabels = {
  CASH: 'Tiền mặt',
  TRANSFER: 'Chuyển khoản',
  CARD: 'Thẻ',
  E_WALLET: 'Ví điện tử'
};

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

export function Receipt({ 
  billing, 
  onPrint, 
  onEmail, 
  onDownload, 
  onView,
  showActions = true 
}: ReceiptProps) {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleEmail = () => {
    if (onEmail) {
      onEmail();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  const handleView = () => {
    if (onView) {
      onView();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">PHÒNG KHÁM ABC</h1>
        <p className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
        <p className="text-gray-600">Điện thoại: (028) 1234-5678</p>
        <p className="text-gray-600">Email: info@phongkhamabc.com</p>
      </div>

      {/* Receipt Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">HÓA ĐƠN DỊCH VỤ Y TẾ</h2>
        <p className="text-gray-600">Mã hóa đơn: {billing.code}</p>
      </div>

      {/* Billing Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Thông tin bệnh nhân</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Tên:</span> {billing.patientName}</p>
            <p><span className="font-medium">Mã bệnh nhân:</span> {billing.patientId}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Thông tin hóa đơn</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Ngày tạo:</span> {formatDateForExport(billing.createdAt)}</p>
            <p><span className="font-medium">Trạng thái:</span> 
              <Badge variant={statusColors[billing.status]} className="ml-2">
                {statusLabels[billing.status]}
              </Badge>
            </p>
            <p><span className="font-medium">Phương thức:</span> {paymentMethodLabels[billing.paymentMethod]}</p>
            {billing.paidAt && (
              <p><span className="font-medium">Ngày thanh toán:</span> {formatDateTimeForExport(billing.paidAt)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Services */}
      {billing.services.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Dịch vụ</h3>
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
        </div>
      )}

      {/* Medications */}
      {billing.medications.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Thuốc</h3>
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
        </div>
      )}

      {/* Totals */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Tổng tiền dịch vụ:</span>
          <span>{formatCurrency(billing.subtotal)}</span>
        </div>
        {billing.discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Giảm giá:</span>
            <span>-{formatCurrency(billing.discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">VAT ({billing.vatRate}%):</span>
          <span>{formatCurrency(billing.vatAmount)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-semibold">
          <span>Tổng cộng:</span>
          <span>{formatCurrency(billing.total)}</span>
        </div>
      </div>

      {/* Notes */}
      {billing.notes && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Ghi chú</h3>
          <p className="text-sm text-gray-600">{billing.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
        <p>Hóa đơn được tạo tự động bởi hệ thống quản lý phòng khám</p>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex justify-center space-x-2 mt-6 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            In hóa đơn
          </Button>
          <Button variant="outline" onClick={handleEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Gửi email
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Tải xuống
          </Button>
          <Button variant="outline" onClick={handleView}>
            <Eye className="h-4 w-4 mr-2" />
            Xem chi tiết
          </Button>
        </div>
      )}
    </div>
  );
}
