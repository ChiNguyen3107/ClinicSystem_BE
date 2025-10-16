import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Printer, Download, QrCode, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PrintPreview } from '@/components/prescriptions';
import { prescriptionService } from '@/api/services/prescription.service';
import { generateQRCode, downloadPDF, printPDF } from '@/utils/pdf';
import type { Prescription } from '@/types';

export function PrescriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadPrescription();
    }
  }, [id]);

  const loadPrescription = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await prescriptionService.getPrescriptionById(parseInt(id));
      setPrescription(data);
      
      // Generate QR code if not exists
      if (data.qrCode) {
        try {
          const qrDataURL = await generateQRCode(data.qrCode);
          setQrCodeDataURL(qrDataURL);
        } catch (error) {
          console.error('Lỗi tạo QR code:', error);
        }
      }
    } catch (error) {
      console.error('Lỗi tải đơn thuốc:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!prescription) return;
    
    try {
      setPrinting(true);
      
      // Generate QR code if not exists
      if (!prescription.qrCode) {
        await prescriptionService.printPrescription(prescription.id);
        await loadPrescription(); // Reload to get QR code
      }
      
      // Print the prescription
      window.print();
    } catch (error) {
      console.error('Lỗi in đơn thuốc:', error);
    } finally {
      setPrinting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!prescription) return;
    
    try {
      setExporting(true);
      const blob = await prescriptionService.exportPrescriptionPDF(prescription.id);
      downloadPDF(blob, `don-thuoc-${prescription.code}.pdf`);
    } catch (error) {
      console.error('Lỗi xuất PDF:', error);
    } finally {
      setExporting(false);
    }
  };

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { label: 'Nháp', variant: 'secondary' as const },
      ACTIVE: { label: 'Hoạt động', variant: 'default' as const },
      COMPLETED: { label: 'Hoàn thành', variant: 'outline' as const },
      CANCELLED: { label: 'Hủy', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không tìm thấy đơn thuốc</p>
        <Button onClick={() => navigate('/prescriptions')} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/prescriptions')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Chi tiết đơn thuốc</h1>
            <p className="text-muted-foreground">
              Mã đơn: {prescription.code} | {getStatusBadge(prescription.status)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/prescriptions/${prescription.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            disabled={printing}
          >
            {printing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Đang in...
              </>
            ) : (
              <>
                <Printer className="h-4 w-4 mr-2" />
                In đơn thuốc
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Đang xuất...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Xuất PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Print Preview */}
      <div className="print:hidden">
        <PrintPreview
          prescription={prescription}
          onPrint={handlePrint}
          onExportPDF={handleExportPDF}
        />
      </div>

      {/* Detailed Information */}
      <div className="hidden print:block">
        <PrintPreview
          prescription={prescription}
          onPrint={handlePrint}
          onExportPDF={handleExportPDF}
        />
      </div>

      {/* QR Code Section */}
      {prescription.qrCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Mã xác thực
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQRCode(!showQRCode)}
                  className="mb-2"
                >
                  {showQRCode ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {showQRCode ? 'Ẩn' : 'Hiện'} QR Code
                </Button>
                {showQRCode && qrCodeDataURL && (
                  <div className="inline-block p-4 border border-gray-300 rounded">
                    <img src={qrCodeDataURL} alt="QR Code" className="h-24 w-24" />
                    <div className="text-xs text-muted-foreground mt-2">
                      Mã xác thực: {prescription.qrCode}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  QR Code này chứa thông tin xác thực đơn thuốc. 
                  Bệnh nhân có thể quét mã này để xác minh tính hợp lệ của đơn thuốc.
                </p>
                {prescription.printedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    In lúc: {formatDateTime(prescription.printedAt)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin trạng thái</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Trạng thái hiện tại</div>
              <div className="mt-1">{getStatusBadge(prescription.status)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Ngày tạo</div>
              <div className="mt-1">{formatDateTime(prescription.createdAt)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Cập nhật lần cuối</div>
              <div className="mt-1">{formatDateTime(prescription.updatedAt)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action History */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử thay đổi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <div className="font-medium">Tạo đơn thuốc</div>
                <div className="text-sm text-muted-foreground">
                  {formatDateTime(prescription.createdAt)}
                </div>
              </div>
              <Badge variant="outline">Tạo mới</Badge>
            </div>
            
            {prescription.printedAt && (
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <div className="font-medium">In đơn thuốc</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(prescription.printedAt)}
                  </div>
                </div>
                <Badge variant="outline">Đã in</Badge>
              </div>
            )}
            
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">Cập nhật lần cuối</div>
                <div className="text-sm text-muted-foreground">
                  {formatDateTime(prescription.updatedAt)}
                </div>
              </div>
              <Badge variant="outline">Cập nhật</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
