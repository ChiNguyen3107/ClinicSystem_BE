import React, { useState } from 'react';
import { Printer, Download, QrCode, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';
import type { Prescription } from '@/types';

interface PrintPreviewProps {
  prescription: Prescription;
  onPrint?: () => void;
  onExportPDF?: () => void;
  className?: string;
}

export function PrintPreview({ prescription, onPrint, onExportPDF, className }: PrintPreviewProps) {
  const [showQRCode, setShowQRCode] = useState(true);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header với thông tin phòng khám */}
      <Card className="border-2 border-gray-300">
        <CardHeader className="text-center pb-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">
              PHÒNG KHÁM ĐA KHOA ABC
            </h1>
            <div className="text-sm text-gray-600">
              <div>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</div>
              <div>Điện thoại: (028) 1234-5678 | Email: info@phongkhamabc.com</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Thông tin đơn thuốc */}
      <Card className="border-2 border-gray-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-800">
              ĐƠN THUỐC
            </CardTitle>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Mã đơn: <span className="font-mono font-bold">{prescription.code}</span>
              </div>
              <div className="text-sm text-gray-600">
                Ngày: {formatDate(prescription.createdAt)}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Thông tin bệnh nhân */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Thông tin bệnh nhân:</h3>
              <div className="space-y-1 text-sm">
                <div><strong>Họ tên:</strong> {prescription.patient.fullName}</div>
                <div><strong>Ngày sinh:</strong> {formatDate(prescription.patient.dateOfBirth)}</div>
                <div><strong>Giới tính:</strong> {prescription.patient.gender === 'MALE' ? 'Nam' : 'Nữ'}</div>
                <div><strong>SĐT:</strong> {prescription.patient.phone}</div>
                {prescription.patient.address && (
                  <div><strong>Địa chỉ:</strong> {prescription.patient.address}</div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Thông tin bác sĩ:</h3>
              <div className="space-y-1 text-sm">
                <div><strong>Bác sĩ:</strong> {prescription.doctor.account.fullName}</div>
                <div><strong>Chuyên khoa:</strong> {prescription.doctor.specialty}</div>
                <div><strong>Số chứng chỉ:</strong> {prescription.doctor.licenseNumber}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Chẩn đoán */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Chẩn đoán:</h3>
            <div className="text-sm bg-gray-50 p-3 rounded border">
              {prescription.diagnosis}
            </div>
          </div>

          {/* Ghi chú */}
          {prescription.notes && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Ghi chú:</h3>
              <div className="text-sm bg-gray-50 p-3 rounded border">
                {prescription.notes}
              </div>
            </div>
          )}

          <Separator />

          {/* Danh sách thuốc */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Đơn thuốc:</h3>
            <div className="space-y-3">
              {prescription.items.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {index + 1}. {item.medication.name}
                      </div>
                      {item.medication.genericName && (
                        <div className="text-sm text-gray-600">
                          ({item.medication.genericName})
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.medication.category}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div><strong>Liều lượng:</strong> {item.dosage}</div>
                      <div><strong>Tần suất:</strong> {item.frequency}</div>
                      <div><strong>Thời gian:</strong> {item.duration}</div>
                    </div>
                    <div>
                      <div><strong>Số lượng:</strong> {item.quantity} {item.medication.unit}</div>
                      <div><strong>Đơn giá:</strong> {item.unitPrice.toLocaleString('vi-VN')} VNĐ</div>
                      <div><strong>Thành tiền:</strong> {item.totalPrice.toLocaleString('vi-VN')} VNĐ</div>
                    </div>
                  </div>
                  
                  {item.instructions && (
                    <div className="mt-2">
                      <div className="text-sm">
                        <strong>Hướng dẫn sử dụng:</strong> {item.instructions}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Tổng tiền */}
          <div className="flex justify-end">
            <div className="text-right">
              <div className="text-lg font-bold text-gray-800">
                Tổng cộng: {prescription.totalAmount.toLocaleString('vi-VN')} VNĐ
              </div>
            </div>
          </div>

          {/* QR Code */}
          {prescription.qrCode && (
            <div className="flex justify-center">
              <div className="text-center">
                <div className="mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="text-xs"
                  >
                    {showQRCode ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                    {showQRCode ? 'Ẩn' : 'Hiện'} QR Code
                  </Button>
                </div>
                {showQRCode && (
                  <div className="inline-block p-4 border border-gray-300 rounded">
                    <QrCode className="h-24 w-24 text-gray-600" />
                    <div className="text-xs text-gray-600 mt-2">
                      Mã xác thực: {prescription.qrCode}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Thông tin in */}
          {prescription.printedAt && (
            <div className="text-center text-xs text-gray-500">
              In lúc: {formatDateTime(prescription.printedAt)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nút hành động */}
      <div className="flex justify-center gap-3">
        <Button onClick={onPrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          In đơn thuốc
        </Button>
        <Button variant="outline" onClick={onExportPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Xuất PDF
        </Button>
      </div>
    </div>
  );
}
