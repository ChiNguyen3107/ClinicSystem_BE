import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Bell,
  Palette,
  Shield,
  Upload
} from 'lucide-react';

interface UserSettingsProps {
  onChanges: (hasChanges: boolean) => void;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ onChanges }) => {
  const [settings, setSettings] = useState({
    // Profile Information
    firstName: 'Nguyễn Văn',
    lastName: 'A',
    email: 'admin@phongkhamabc.com',
    phone: '0901234567',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    dateOfBirth: '1990-01-01',
    avatar: '',
    bio: 'Quản trị viên hệ thống',
    
    // Preferences
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    theme: 'light',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    appointmentNotifications: true,
    systemNotifications: true,
    marketingEmails: false,
    
    // Security
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: '30' // minutes
  });

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    onChanges(true);
  };

  const handlePasswordChange = () => {
    // TODO: Implement password change logic
    console.log('Change password');
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement avatar upload logic
      console.log('Upload avatar:', file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin cá nhân
          </CardTitle>
          <CardDescription>
            Quản lý thông tin cá nhân và hồ sơ người dùng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={settings.avatar} />
              <AvatarFallback className="text-lg">
                {settings.firstName.charAt(0)}{settings.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Thay đổi ảnh đại diện
                </label>
              </Button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Họ</Label>
              <Input
                id="firstName"
                value={settings.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Nhập họ"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Tên</Label>
              <Input
                id="lastName"
                value={settings.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Nhập tên"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="admin@phongkhamabc.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="0901234567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={settings.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="123 Đường ABC, Quận 1, TP.HCM"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Giới thiệu</Label>
            <Textarea
              id="bio"
              value={settings.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Giới thiệu về bản thân"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Bảo mật mật khẩu
          </CardTitle>
          <CardDescription>
            Thay đổi mật khẩu và cài đặt bảo mật
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handlePasswordChange} variant="outline">
            Thay đổi mật khẩu
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Tùy chỉnh giao diện
          </CardTitle>
          <CardDescription>
            Cấu hình ngôn ngữ, múi giờ và giao diện
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Ngôn ngữ</Label>
              <Select value={settings.language} onValueChange={(value) => handleChange('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Múi giờ</Label>
              <Select value={settings.timezone} onValueChange={(value) => handleChange('timezone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Định dạng ngày</Label>
              <Select value={settings.dateFormat} onValueChange={(value) => handleChange('dateFormat', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeFormat">Định dạng giờ</Label>
              <Select value={settings.timeFormat} onValueChange={(value) => handleChange('timeFormat', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 giờ</SelectItem>
                  <SelectItem value="12h">12 giờ (AM/PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="theme">Chủ đề</Label>
              <Select value={settings.theme} onValueChange={(value) => handleChange('theme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Sáng</SelectItem>
                  <SelectItem value="dark">Tối</SelectItem>
                  <SelectItem value="system">Theo hệ thống</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Tùy chỉnh thông báo
          </CardTitle>
          <CardDescription>
            Cấu hình các loại thông báo cá nhân
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Thông báo email</Label>
                <p className="text-sm text-muted-foreground">
                  Nhận thông báo qua email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Thông báo đẩy</Label>
                <p className="text-sm text-muted-foreground">
                  Nhận thông báo đẩy trên trình duyệt
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleChange('pushNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Thông báo lịch hẹn</Label>
                <p className="text-sm text-muted-foreground">
                  Nhận thông báo về lịch hẹn
                </p>
              </div>
              <Switch
                checked={settings.appointmentNotifications}
                onCheckedChange={(checked) => handleChange('appointmentNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Thông báo hệ thống</Label>
                <p className="text-sm text-muted-foreground">
                  Nhận thông báo về hệ thống
                </p>
              </div>
              <Switch
                checked={settings.systemNotifications}
                onCheckedChange={(checked) => handleChange('systemNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Email marketing</Label>
                <p className="text-sm text-muted-foreground">
                  Nhận email quảng cáo và cập nhật
                </p>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => handleChange('marketingEmails', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
