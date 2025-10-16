import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Clock,
  Bell
} from 'lucide-react';

interface SystemSettingsProps {
  onChanges: (hasChanges: boolean) => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({ onChanges }) => {
  const [settings, setSettings] = useState({
    // Clinic Information
    clinicName: 'Phòng khám ABC',
    clinicCode: 'PK001',
    taxCode: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone: '028-1234-5678',
    email: 'info@phongkhamabc.com',
    website: 'https://phongkhamabc.com',
    
    // Business Hours
    mondayToFriday: { start: '08:00', end: '17:00' },
    saturday: { start: '08:00', end: '12:00', enabled: true },
    sunday: { start: '08:00', end: '12:00', enabled: false },
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
    reminderTime: '24', // hours before appointment
    systemAlerts: true,
    maintenanceAlerts: true
  });

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    onChanges(true);
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [field]: value
      }
    }));
    onChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Clinic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Thông tin phòng khám
          </CardTitle>
          <CardDescription>
            Cấu hình thông tin cơ bản của phòng khám
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clinicName">Tên phòng khám</Label>
              <Input
                id="clinicName"
                value={settings.clinicName}
                onChange={(e) => handleChange('clinicName', e.target.value)}
                placeholder="Nhập tên phòng khám"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinicCode">Mã phòng khám</Label>
              <Input
                id="clinicCode"
                value={settings.clinicCode}
                onChange={(e) => handleChange('clinicCode', e.target.value)}
                placeholder="PK001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxCode">Mã số thuế</Label>
              <Input
                id="taxCode"
                value={settings.taxCode}
                onChange={(e) => handleChange('taxCode', e.target.value)}
                placeholder="0123456789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="028-1234-5678"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Nhập địa chỉ đầy đủ"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="info@phongkhamabc.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={settings.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://phongkhamabc.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Giờ làm việc
          </CardTitle>
          <CardDescription>
            Cấu hình giờ làm việc của phòng khám
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Thứ 2 - Thứ 6</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={settings.mondayToFriday.start}
                  onChange={(e) => handleNestedChange('mondayToFriday', 'start', e.target.value)}
                  className="w-32"
                />
                <span>đến</span>
                <Input
                  type="time"
                  value={settings.mondayToFriday.end}
                  onChange={(e) => handleNestedChange('mondayToFriday', 'end', e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Thứ 7</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.saturday.enabled}
                    onCheckedChange={(checked) => handleNestedChange('saturday', 'enabled', checked)}
                  />
                  {settings.saturday.enabled && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={settings.saturday.start}
                        onChange={(e) => handleNestedChange('saturday', 'start', e.target.value)}
                        className="w-32"
                      />
                      <span>đến</span>
                      <Input
                        type="time"
                        value={settings.saturday.end}
                        onChange={(e) => handleNestedChange('saturday', 'end', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Chủ nhật</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.sunday.enabled}
                    onCheckedChange={(checked) => handleNestedChange('sunday', 'enabled', checked)}
                  />
                  {settings.sunday.enabled && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={settings.sunday.start}
                        onChange={(e) => handleNestedChange('sunday', 'start', e.target.value)}
                        className="w-32"
                      />
                      <span>đến</span>
                      <Input
                        type="time"
                        value={settings.sunday.end}
                        onChange={(e) => handleNestedChange('sunday', 'end', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Cài đặt thông báo
          </CardTitle>
          <CardDescription>
            Cấu hình các loại thông báo hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Thông báo email</Label>
                <p className="text-sm text-muted-foreground">
                  Gửi thông báo qua email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Thông báo SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Gửi thông báo qua tin nhắn SMS
                </p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleChange('smsNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Nhắc nhở lịch hẹn</Label>
                <p className="text-sm text-muted-foreground">
                  Tự động nhắc nhở bệnh nhân về lịch hẹn
                </p>
              </div>
              <Switch
                checked={settings.appointmentReminders}
                onCheckedChange={(checked) => handleChange('appointmentReminders', checked)}
              />
            </div>
            
            {settings.appointmentReminders && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="reminderTime">Thời gian nhắc nhở (giờ trước lịch hẹn)</Label>
                <Input
                  id="reminderTime"
                  type="number"
                  value={settings.reminderTime}
                  onChange={(e) => handleChange('reminderTime', e.target.value)}
                  className="w-32"
                  min="1"
                  max="168"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Cảnh báo hệ thống</Label>
                <p className="text-sm text-muted-foreground">
                  Thông báo về các vấn đề hệ thống
                </p>
              </div>
              <Switch
                checked={settings.systemAlerts}
                onCheckedChange={(checked) => handleChange('systemAlerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Cảnh báo bảo trì</Label>
                <p className="text-sm text-muted-foreground">
                  Thông báo về lịch bảo trì hệ thống
                </p>
              </div>
              <Switch
                checked={settings.maintenanceAlerts}
                onCheckedChange={(checked) => handleChange('maintenanceAlerts', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
