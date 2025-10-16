import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Shield, 
  Smartphone, 
  Clock, 
  Users, 
  FileText,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface SecuritySettingsProps {
  onChanges: (hasChanges: boolean) => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onChanges }) => {
  const [settings, setSettings] = useState({
    // Two-Factor Authentication
    twoFactorEnabled: false,
    twoFactorMethod: 'sms', // sms, email, app
    backupCodes: ['123456', '234567', '345678', '456789', '567890'],
    
    // Session Management
    sessionTimeout: '30', // minutes
    maxConcurrentSessions: '3',
    requireReauthForSensitive: true,
    
    // Access Control
    ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
    allowedCountries: ['VN', 'US'],
    blockSuspiciousIPs: true,
    
    // Audit Logs
    auditLogging: true,
    logRetentionDays: '90',
    alertOnSuspiciousActivity: true
  });

  const [auditLogs] = useState([
    {
      id: 1,
      timestamp: '2024-01-15 10:30:00',
      user: 'admin@phongkhamabc.com',
      action: 'Đăng nhập',
      ip: '192.168.1.100',
      status: 'success',
      details: 'Đăng nhập thành công từ IP 192.168.1.100'
    },
    {
      id: 2,
      timestamp: '2024-01-15 09:15:00',
      user: 'doctor1@phongkhamabc.com',
      action: 'Xem bệnh án',
      ip: '192.168.1.101',
      status: 'success',
      details: 'Xem bệnh án bệnh nhân #12345'
    },
    {
      id: 3,
      timestamp: '2024-01-15 08:45:00',
      user: 'unknown',
      action: 'Đăng nhập thất bại',
      ip: '203.0.113.1',
      status: 'failed',
      details: 'Thử đăng nhập với mật khẩu sai'
    }
  ]);

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    onChanges(true);
  };

  const handleEnable2FA = () => {
    // TODO: Implement 2FA setup
    console.log('Enable 2FA');
  };

  const handleDisable2FA = () => {
    // TODO: Implement 2FA disable
    console.log('Disable 2FA');
  };

  const handleGenerateBackupCodes = () => {
    // TODO: Generate new backup codes
    console.log('Generate backup codes');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Thành công</Badge>;
      case 'failed':
        return <Badge variant="destructive">Thất bại</Badge>;
      default:
        return <Badge variant="outline">Đang xử lý</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Xác thực hai yếu tố (2FA)
          </CardTitle>
          <CardDescription>
            Tăng cường bảo mật tài khoản với xác thực hai yếu tố
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Bật xác thực hai yếu tố</Label>
              <p className="text-sm text-muted-foreground">
                Yêu cầu mã xác thực từ điện thoại khi đăng nhập
              </p>
            </div>
            <Switch
              checked={settings.twoFactorEnabled}
              onCheckedChange={(checked) => handleChange('twoFactorEnabled', checked)}
            />
          </div>
          
          {settings.twoFactorEnabled && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <Label>Phương thức xác thực</Label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="twoFactorMethod"
                      value="sms"
                      checked={settings.twoFactorMethod === 'sms'}
                      onChange={(e) => handleChange('twoFactorMethod', e.target.value)}
                    />
                    SMS
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="twoFactorMethod"
                      value="email"
                      checked={settings.twoFactorMethod === 'email'}
                      onChange={(e) => handleChange('twoFactorMethod', e.target.value)}
                    />
                    Email
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="twoFactorMethod"
                      value="app"
                      checked={settings.twoFactorMethod === 'app'}
                      onChange={(e) => handleChange('twoFactorMethod', e.target.value)}
                    />
                    Ứng dụng xác thực
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Mã dự phòng</Label>
                <p className="text-sm text-muted-foreground">
                  Sử dụng khi không có điện thoại
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {settings.backupCodes.map((code, index) => (
                    <div key={index} className="p-2 bg-background border rounded text-center font-mono text-sm">
                      {code}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={handleGenerateBackupCodes}>
                  Tạo mã mới
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quản lý phiên đăng nhập
          </CardTitle>
          <CardDescription>
            Cấu hình thời gian và giới hạn phiên đăng nhập
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Thời gian hết hạn phiên (phút)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                min="5"
                max="1440"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxConcurrentSessions">Số phiên đồng thời tối đa</Label>
              <Input
                id="maxConcurrentSessions"
                type="number"
                value={settings.maxConcurrentSessions}
                onChange={(e) => handleChange('maxConcurrentSessions', e.target.value)}
                min="1"
                max="10"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Yêu cầu xác thực lại cho thao tác nhạy cảm</Label>
              <p className="text-sm text-muted-foreground">
                Yêu cầu nhập mật khẩu khi thực hiện thao tác quan trọng
              </p>
            </div>
            <Switch
              checked={settings.requireReauthForSensitive}
              onCheckedChange={(checked) => handleChange('requireReauthForSensitive', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Kiểm soát truy cập
          </CardTitle>
          <CardDescription>
            Cấu hình giới hạn truy cập theo IP và vị trí địa lý
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Danh sách IP được phép</Label>
            <div className="space-y-2">
              {settings.ipWhitelist.map((ip, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={ip} readOnly className="flex-1" />
                  <Button variant="outline" size="sm">Xóa</Button>
                </div>
              ))}
              <Button variant="outline" size="sm">Thêm IP</Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Quốc gia được phép</Label>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Việt Nam</Badge>
              <Badge variant="outline">Hoa Kỳ</Badge>
              <Button variant="outline" size="sm">Thêm quốc gia</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Chặn IP đáng ngờ</Label>
              <p className="text-sm text-muted-foreground">
                Tự động chặn các IP có hoạt động đáng ngờ
              </p>
            </div>
            <Switch
              checked={settings.blockSuspiciousIPs}
              onCheckedChange={(checked) => handleChange('blockSuspiciousIPs', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Nhật ký kiểm toán
          </CardTitle>
          <CardDescription>
            Theo dõi và ghi lại các hoạt động trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logRetentionDays">Thời gian lưu trữ nhật ký (ngày)</Label>
              <Input
                id="logRetentionDays"
                type="number"
                value={settings.logRetentionDays}
                onChange={(e) => handleChange('logRetentionDays', e.target.value)}
                min="7"
                max="365"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Cảnh báo hoạt động đáng ngờ</Label>
                <p className="text-sm text-muted-foreground">
                  Gửi cảnh báo khi phát hiện hoạt động bất thường
                </p>
              </div>
              <Switch
                checked={settings.alertOnSuspiciousActivity}
                onCheckedChange={(checked) => handleChange('alertOnSuspiciousActivity', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">Nhật ký gần đây</h4>
              <Button variant="outline" size="sm">Xem tất cả</Button>
            </div>
            
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Hành động</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Chi tiết</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="font-mono">{log.ip}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          {getStatusBadge(log.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
