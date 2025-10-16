import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw,
  Calendar,
  HardDrive,
  Cloud,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface BackupSettingsProps {
  onChanges: (hasChanges: boolean) => void;
}

export const BackupSettings: React.FC<BackupSettingsProps> = ({ onChanges }) => {
  const [settings, setSettings] = useState({
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily', // daily, weekly, monthly
    backupTime: '02:00',
    backupRetention: '30', // days
    cloudBackup: true,
    localBackup: true,
    
    // Export Settings
    exportFormat: 'json', // json, csv, excel
    includeFiles: true,
    includeImages: true,
    
    // Import Settings
    allowImport: true,
    requireValidation: true,
    backupBeforeImport: true
  });

  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const [backupHistory] = useState([
    {
      id: 1,
      date: '2024-01-15 02:00:00',
      type: 'Tự động',
      size: '2.5 GB',
      status: 'completed',
      location: 'Local + Cloud'
    },
    {
      id: 2,
      date: '2024-01-14 02:00:00',
      type: 'Tự động',
      size: '2.3 GB',
      status: 'completed',
      location: 'Local + Cloud'
    },
    {
      id: 3,
      date: '2024-01-13 15:30:00',
      type: 'Thủ công',
      size: '2.1 GB',
      status: 'completed',
      location: 'Local'
    },
    {
      id: 4,
      date: '2024-01-12 02:00:00',
      type: 'Tự động',
      size: '2.4 GB',
      status: 'failed',
      location: 'Local + Cloud'
    }
  ]);

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    onChanges(true);
  };

  const handleBackupNow = () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleRestore = (backupId: number) => {
    // TODO: Implement restore logic
    console.log(`Restore backup ${backupId}`);
  };

  const handleDeleteBackup = (backupId: number) => {
    // TODO: Implement delete backup logic
    console.log(`Delete backup ${backupId}`);
  };

  const handleExportData = () => {
    // TODO: Implement export logic
    console.log('Export data');
  };

  const handleImportData = () => {
    // TODO: Implement import logic
    console.log('Import data');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'failed':
        return <Badge variant="destructive">Thất bại</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-blue-600">Đang xử lý</Badge>;
      default:
        return <Badge variant="outline">Chờ xử lý</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Backup Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cấu hình sao lưu
          </CardTitle>
          <CardDescription>
            Thiết lập tự động sao lưu dữ liệu hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Sao lưu tự động</Label>
              <p className="text-sm text-muted-foreground">
                Tự động sao lưu dữ liệu theo lịch trình
              </p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => handleChange('autoBackup', checked)}
            />
          </div>
          
          {settings.autoBackup && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Tần suất</Label>
                  <select
                    id="backupFrequency"
                    value={settings.backupFrequency}
                    onChange={(e) => handleChange('backupFrequency', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="monthly">Hàng tháng</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backupTime">Thời gian</Label>
                  <Input
                    id="backupTime"
                    type="time"
                    value={settings.backupTime}
                    onChange={(e) => handleChange('backupTime', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backupRetention">Lưu trữ (ngày)</Label>
                  <Input
                    id="backupRetention"
                    type="number"
                    value={settings.backupRetention}
                    onChange={(e) => handleChange('backupRetention', e.target.value)}
                    min="1"
                    max="365"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sao lưu cục bộ</Label>
                    <p className="text-sm text-muted-foreground">
                      Lưu trữ sao lưu trên máy chủ
                    </p>
                  </div>
                  <Switch
                    checked={settings.localBackup}
                    onCheckedChange={(checked) => handleChange('localBackup', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sao lưu đám mây</Label>
                    <p className="text-sm text-muted-foreground">
                      Lưu trữ sao lưu trên đám mây
                    </p>
                  </div>
                  <Switch
                    checked={settings.cloudBackup}
                    onCheckedChange={(checked) => handleChange('cloudBackup', checked)}
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button onClick={handleBackupNow} disabled={isBackingUp}>
              {isBackingUp ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              {isBackingUp ? 'Đang sao lưu...' : 'Sao lưu ngay'}
            </Button>
            
            {isBackingUp && (
              <div className="flex-1">
                <Progress value={backupProgress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-1">
                  {backupProgress}% hoàn thành
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Lịch sử sao lưu
          </CardTitle>
          <CardDescription>
            Xem và quản lý các bản sao lưu đã tạo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Kích thước</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backupHistory.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-mono text-sm">{backup.date}</TableCell>
                    <TableCell>{backup.type}</TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(backup.status)}
                        {getStatusBadge(backup.status)}
                      </div>
                    </TableCell>
                    <TableCell>{backup.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {backup.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestore(backup.id)}
                          >
                            Khôi phục
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBackup(backup.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Xuất dữ liệu
          </CardTitle>
          <CardDescription>
            Xuất dữ liệu hệ thống ra file để lưu trữ hoặc chuyển đổi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exportFormat">Định dạng xuất</Label>
              <select
                id="exportFormat"
                value={settings.exportFormat}
                onChange={(e) => handleChange('exportFormat', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Bao gồm</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="includeFiles"
                    checked={settings.includeFiles}
                    onChange={(e) => handleChange('includeFiles', e.target.checked)}
                  />
                  <Label htmlFor="includeFiles">File đính kèm</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="includeImages"
                    checked={settings.includeImages}
                    onChange={(e) => handleChange('includeImages', e.target.checked)}
                  />
                  <Label htmlFor="includeImages">Hình ảnh</Label>
                </div>
              </div>
            </div>
          </div>
          
          <Button onClick={handleExportData} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
        </CardContent>
      </Card>

      {/* Import Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Nhập dữ liệu
          </CardTitle>
          <CardDescription>
            Nhập dữ liệu từ file vào hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Cho phép nhập dữ liệu</Label>
                <p className="text-sm text-muted-foreground">
                  Cho phép nhập dữ liệu từ file
                </p>
              </div>
              <Switch
                checked={settings.allowImport}
                onCheckedChange={(checked) => handleChange('allowImport', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Yêu cầu xác thực</Label>
                <p className="text-sm text-muted-foreground">
                  Xác thực dữ liệu trước khi nhập
                </p>
              </div>
              <Switch
                checked={settings.requireValidation}
                onCheckedChange={(checked) => handleChange('requireValidation', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Sao lưu trước khi nhập</Label>
                <p className="text-sm text-muted-foreground">
                  Tự động sao lưu trước khi nhập dữ liệu mới
                </p>
              </div>
              <Switch
                checked={settings.backupBeforeImport}
                onCheckedChange={(checked) => handleChange('backupBeforeImport', checked)}
              />
            </div>
          </div>
          
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Kéo thả file hoặc click để chọn file
            </p>
            <p className="text-xs text-muted-foreground">
              Hỗ trợ: JSON, CSV, Excel (.xlsx)
            </p>
            <Button variant="outline" className="mt-2" onClick={handleImportData}>
              Chọn file
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
