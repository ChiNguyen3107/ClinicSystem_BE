import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  File, 
  Printer,
  Mail,
  Share2,
  Settings
} from 'lucide-react';
import { ExportOptions } from '@/types/report';
import { ReportService } from '@/api/services/report.service';

interface ExportOptionsProps {
  reportType: string;
  onExport?: () => void;
}

export function ExportOptionsComponent({ reportType, onExport }: ExportOptionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportOptions>({
    format: 'excel',
    includeCharts: true,
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
    sections: [reportType]
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await ReportService.exportReport(exportConfig);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bao-cao-${reportType}-${new Date().toISOString().split('T')[0]}.${getFileExtension(exportConfig.format)}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      onExport?.();
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setIsExporting(false);
      setIsDialogOpen(false);
    }
  };

  const handlePrint = async () => {
    try {
      await ReportService.printReport(exportConfig);
    } catch (error) {
      console.error('Error printing report:', error);
    }
  };

  const getFileExtension = (format: string) => {
    const extensions: Record<string, string> = {
      'excel': 'xlsx',
      'pdf': 'pdf',
      'csv': 'csv'
    };
    return extensions[format] || 'xlsx';
  };

  const getFormatIcon = (format: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      'excel': FileSpreadsheet,
      'pdf': FileText,
      'csv': File,
      'print': Printer
    };
    return icons[format] || File;
  };

  const formatOptions = [
    { value: 'excel', label: 'Excel (.xlsx)', description: 'Tốt nhất cho phân tích dữ liệu' },
    { value: 'pdf', label: 'PDF (.pdf)', description: 'Tốt nhất cho báo cáo chính thức' },
    { value: 'csv', label: 'CSV (.csv)', description: 'Tốt nhất cho import dữ liệu' },
    { value: 'print', label: 'In trực tiếp', description: 'In báo cáo ra máy in' }
  ];

  const reportSections = [
    { value: 'dashboard', label: 'Tổng quan' },
    { value: 'revenue', label: 'Doanh thu' },
    { value: 'patients', label: 'Bệnh nhân' },
    { value: 'appointments', label: 'Lịch hẹn' },
    { value: 'services', label: 'Dịch vụ' }
  ];

  return (
    <div className="space-y-4">
      {/* Quick Export Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setExportConfig({ ...exportConfig, format: 'excel' });
            handleExport();
          }}
          disabled={isExporting}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Xuất Excel
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            setExportConfig({ ...exportConfig, format: 'pdf' });
            handleExport();
          }}
          disabled={isExporting}
        >
          <FileText className="h-4 w-4 mr-2" />
          Xuất PDF
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            setExportConfig({ ...exportConfig, format: 'csv' });
            handleExport();
          }}
          disabled={isExporting}
        >
          <File className="h-4 w-4 mr-2" />
          Xuất CSV
        </Button>
        
        <Button
          variant="outline"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4 mr-2" />
          In báo cáo
        </Button>
      </div>

      {/* Advanced Export Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Tùy chọn xuất nâng cao
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tùy chọn xuất báo cáo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Format Selection */}
            <div className="space-y-2">
              <Label>Định dạng file</Label>
              <Select 
                value={exportConfig.format} 
                onValueChange={(value) => setExportConfig({ ...exportConfig, format: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map((option) => {
                    const Icon = getFormatIcon(option.value);
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <Icon className="h-4 w-4 mr-2" />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Include Charts */}
            <div className="flex items-center space-x-2">
              <Switch
                id="includeCharts"
                checked={exportConfig.includeCharts}
                onCheckedChange={(checked) => setExportConfig({ ...exportConfig, includeCharts: checked })}
              />
              <Label htmlFor="includeCharts">Bao gồm biểu đồ</Label>
            </div>

            {/* Sections Selection */}
            <div className="space-y-2">
              <Label>Phần báo cáo</Label>
              <div className="space-y-2">
                {reportSections.map((section) => (
                  <div key={section.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={section.value}
                      checked={exportConfig.sections.includes(section.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setExportConfig({
                            ...exportConfig,
                            sections: [...exportConfig.sections, section.value]
                          });
                        } else {
                          setExportConfig({
                            ...exportConfig,
                            sections: exportConfig.sections.filter(s => s !== section.value)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={section.value}>{section.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Khoảng thời gian</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="fromDate" className="text-sm">Từ ngày</Label>
                  <input
                    id="fromDate"
                    type="date"
                    value={exportConfig.dateRange.from.toISOString().split('T')[0]}
                    onChange={(e) => setExportConfig({
                      ...exportConfig,
                      dateRange: {
                        ...exportConfig.dateRange,
                        from: new Date(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  />
                </div>
                <div>
                  <Label htmlFor="toDate" className="text-sm">Đến ngày</Label>
                  <input
                    id="toDate"
                    type="date"
                    value={exportConfig.dateRange.to.toISOString().split('T')[0]}
                    onChange={(e) => setExportConfig({
                      ...exportConfig,
                      dateRange: {
                        ...exportConfig.dateRange,
                        to: new Date(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleExport} disabled={isExporting}>
                {isExporting ? 'Đang xuất...' : 'Xuất báo cáo'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Status */}
      {isExporting && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Đang xuất báo cáo...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
