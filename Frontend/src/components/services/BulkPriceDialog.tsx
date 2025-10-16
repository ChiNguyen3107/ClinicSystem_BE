import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { BulkPriceUpdate } from '../../types/service';
import { formatCurrency } from '../../utils/currency';

interface BulkPriceDialogProps {
  onBulkUpdate: (updates: BulkPriceUpdate[]) => Promise<void>;
  services: Array<{ id: string; name: string; currentPrice: number }>;
  isLoading?: boolean;
}

interface ParsedRow {
  serviceId: string;
  serviceName: string;
  newPrice: number;
  effectiveDate: string;
  reason?: string;
  isValid: boolean;
  errors: string[];
}

export const BulkPriceDialog: React.FC<BulkPriceDialogProps> = ({
  onBulkUpdate,
  services
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvContent(content);
      parseCSVContent(content);
    };
    reader.readAsText(file);
  };

  const parseCSVContent = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const parsed: ParsedRow[] = [];

    lines.forEach((line, index) => {
      if (index === 0) return; // Skip header

      const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
      const errors: string[] = [];

      if (columns.length < 3) {
        errors.push('Thiếu thông tin bắt buộc');
        parsed.push({
          serviceId: '',
          serviceName: '',
          newPrice: 0,
          effectiveDate: '',
          isValid: false,
          errors
        });
        return;
      }

      const [serviceId, newPriceStr, effectiveDateStr, reason] = columns;
      const newPrice = parseFloat(newPriceStr);

      // Validate service ID
      const service = services.find(s => s.id === serviceId);
      if (!service) {
        errors.push('Không tìm thấy dịch vụ');
      }

      // Validate price
      if (isNaN(newPrice) || newPrice < 0) {
        errors.push('Giá không hợp lệ');
      }

      // Validate date
      const date = new Date(effectiveDateStr);
      if (isNaN(date.getTime())) {
        errors.push('Ngày không hợp lệ');
      }

      parsed.push({
        serviceId,
        serviceName: service?.name || 'Không tìm thấy',
        newPrice,
        effectiveDate: effectiveDateStr,
        reason,
        isValid: errors.length === 0,
        errors
      });
    });

    setParsedData(parsed);
  };

  const handleManualInput = (content: string) => {
    setCsvContent(content);
    parseCSVContent(content);
  };

  const downloadTemplate = () => {
    const template = 'serviceId,newPrice,effectiveDate,reason\n' +
      'service-1,100000,2024-01-01,Tăng giá theo quy định\n' +
      'service-2,150000,2024-01-01,Cập nhật giá mới';
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_price_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    const validUpdates = parsedData
      .filter(row => row.isValid)
      .map(row => ({
        serviceId: row.serviceId,
        newPrice: row.newPrice,
        effectiveDate: row.effectiveDate,
        reason: row.reason
      }));

    if (validUpdates.length === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onBulkUpdate(validUpdates);
      setIsOpen(false);
      setCsvContent('');
      setParsedData([]);
    } catch (error) {
      console.error('Error bulk updating prices:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validCount = parsedData.filter(row => row.isValid).length;
  const invalidCount = parsedData.filter(row => !row.isValid).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Cập nhật giá hàng loạt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật giá hàng loạt</DialogTitle>
          <DialogDescription>
            Upload file CSV hoặc nhập dữ liệu để cập nhật giá cho nhiều dịch vụ cùng lúc
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload file CSV</CardTitle>
              <CardDescription>
                Tải lên file CSV với định dạng: serviceId, newPrice, effectiveDate, reason
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Chọn file
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Tải template
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Manual Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nhập dữ liệu thủ công</CardTitle>
              <CardDescription>
                Hoặc nhập dữ liệu trực tiếp theo định dạng CSV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="csvInput">Dữ liệu CSV</Label>
                <Textarea
                  id="csvInput"
                  value={csvContent}
                  onChange={(e) => handleManualInput(e.target.value)}
                  placeholder="serviceId,newPrice,effectiveDate,reason&#10;service-1,100000,2024-01-01,Tăng giá theo quy định"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          {parsedData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Xem trước dữ liệu</CardTitle>
                <CardDescription>
                  Kiểm tra dữ liệu trước khi cập nhật
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Hợp lệ: {validCount}
                  </Badge>
                  {invalidCount > 0 && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Lỗi: {invalidCount}
                    </Badge>
                  )}
                </div>

                {invalidCount > 0 && (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Có {invalidCount} dòng dữ liệu không hợp lệ. Vui lòng kiểm tra và sửa lỗi trước khi tiếp tục.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dịch vụ</TableHead>
                        <TableHead>Giá hiện tại</TableHead>
                        <TableHead>Giá mới</TableHead>
                        <TableHead>Ngày áp dụng</TableHead>
                        <TableHead>Lý do</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.serviceName}</TableCell>
                          <TableCell>
                            {services.find(s => s.id === row.serviceId)?.currentPrice 
                              ? formatCurrency(services.find(s => s.id === row.serviceId)!.currentPrice)
                              : '-'
                            }
                          </TableCell>
                          <TableCell>{formatCurrency(row.newPrice)}</TableCell>
                          <TableCell>{row.effectiveDate}</TableCell>
                          <TableCell>{row.reason || '-'}</TableCell>
                          <TableCell>
                            {row.isValid ? (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Hợp lệ
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Lỗi
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {parsedData.some(row => !row.isValid) && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-red-600">Chi tiết lỗi:</h4>
                    {parsedData.map((row, index) => (
                      row.errors.length > 0 && (
                        <div key={index} className="text-sm text-red-600">
                          <strong>Dòng {index + 1}:</strong> {row.errors.join(', ')}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={validCount === 0 || isSubmitting}
            >
              {isSubmitting ? 'Đang cập nhật...' : `Cập nhật ${validCount} dịch vụ`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
