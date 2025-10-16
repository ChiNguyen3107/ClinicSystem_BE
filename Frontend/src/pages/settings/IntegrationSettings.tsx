import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  MessageSquare, 
  CreditCard, 
  Plug, 
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface IntegrationSettingsProps {
  onChanges: (hasChanges: boolean) => void;
}

export const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({ onChanges }) => {
  const [settings, setSettings] = useState({
    // Email Configuration
    emailProvider: 'smtp', // smtp, sendgrid, mailgun
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@phongkhamabc.com',
    smtpPassword: '',
    smtpEncryption: 'tls',
    fromEmail: 'noreply@phongkhamabc.com',
    fromName: 'Phòng khám ABC',
    
    // SMS Configuration
    smsProvider: 'twilio', // twilio, viettel, mobifone
    smsApiKey: '',
    smsApiSecret: '',
    smsFromNumber: '+84901234567',
    
    // Payment Gateway
    paymentProvider: 'vnpay', // vnpay, momo, zalopay
    vnpayMerchantId: '',
    vnpaySecretKey: '',
    vnpayEnvironment: 'sandbox', // sandbox, production
    momoPartnerCode: '',
    momoAccessKey: '',
    momoSecretKey: '',
    
    // Third-party Services
    googleAnalytics: '',
    facebookPixel: '',
    zaloOA: '',
    telegramBot: '',
    webhookUrl: '',
    
    // Integration Status
    emailStatus: 'connected',
    smsStatus: 'disconnected',
    paymentStatus: 'connected',
    analyticsStatus: 'connected'
  });

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    onChanges(true);
  };

  const handleTestConnection = (service: string) => {
    // TODO: Implement connection testing
    console.log(`Test ${service} connection`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800">Đã kết nối</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Chưa kết nối</Badge>;
      case 'error':
        return <Badge variant="outline" className="text-yellow-600">Lỗi</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Cấu hình Email
          </CardTitle>
          <CardDescription>
            Thiết lập dịch vụ gửi email tự động
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Trạng thái kết nối</Label>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(settings.emailStatus)}
                {getStatusBadge(settings.emailStatus)}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleTestConnection('email')}>
              <TestTube className="h-4 w-4 mr-2" />
              Kiểm tra kết nối
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emailProvider">Nhà cung cấp</Label>
              <Select value={settings.emailProvider} onValueChange={(value) => handleChange('emailProvider', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smtp">SMTP</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fromEmail">Email gửi</Label>
              <Input
                id="fromEmail"
                type="email"
                value={settings.fromEmail}
                onChange={(e) => handleChange('fromEmail', e.target.value)}
                placeholder="noreply@phongkhamabc.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={settings.smtpHost}
                onChange={(e) => handleChange('smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                value={settings.smtpPort}
                onChange={(e) => handleChange('smtpPort', e.target.value)}
                placeholder="587"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpUsername">Tên đăng nhập</Label>
              <Input
                id="smtpUsername"
                value={settings.smtpUsername}
                onChange={(e) => handleChange('smtpUsername', e.target.value)}
                placeholder="noreply@phongkhamabc.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">Mật khẩu</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => handleChange('smtpPassword', e.target.value)}
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Cấu hình SMS
          </CardTitle>
          <CardDescription>
            Thiết lập dịch vụ gửi tin nhắn SMS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Trạng thái kết nối</Label>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(settings.smsStatus)}
                {getStatusBadge(settings.smsStatus)}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleTestConnection('sms')}>
              <TestTube className="h-4 w-4 mr-2" />
              Kiểm tra kết nối
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smsProvider">Nhà cung cấp</Label>
              <Select value={settings.smsProvider} onValueChange={(value) => handleChange('smsProvider', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="viettel">Viettel</SelectItem>
                  <SelectItem value="mobifone">Mobifone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smsFromNumber">Số điện thoại gửi</Label>
              <Input
                id="smsFromNumber"
                value={settings.smsFromNumber}
                onChange={(e) => handleChange('smsFromNumber', e.target.value)}
                placeholder="+84901234567"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smsApiKey">API Key</Label>
              <Input
                id="smsApiKey"
                value={settings.smsApiKey}
                onChange={(e) => handleChange('smsApiKey', e.target.value)}
                placeholder="Nhập API Key"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smsApiSecret">API Secret</Label>
              <Input
                id="smsApiSecret"
                type="password"
                value={settings.smsApiSecret}
                onChange={(e) => handleChange('smsApiSecret', e.target.value)}
                placeholder="Nhập API Secret"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateway */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Cổng thanh toán
          </CardTitle>
          <CardDescription>
            Cấu hình các cổng thanh toán trực tuyến
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Trạng thái kết nối</Label>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(settings.paymentStatus)}
                {getStatusBadge(settings.paymentStatus)}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleTestConnection('payment')}>
              <TestTube className="h-4 w-4 mr-2" />
              Kiểm tra kết nối
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentProvider">Nhà cung cấp</Label>
              <Select value={settings.paymentProvider} onValueChange={(value) => handleChange('paymentProvider', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vnpay">VNPay</SelectItem>
                  <SelectItem value="momo">MoMo</SelectItem>
                  <SelectItem value="zalopay">ZaloPay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vnpayEnvironment">Môi trường</Label>
              <Select value={settings.vnpayEnvironment} onValueChange={(value) => handleChange('vnpayEnvironment', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox (Test)</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vnpayMerchantId">Merchant ID</Label>
              <Input
                id="vnpayMerchantId"
                value={settings.vnpayMerchantId}
                onChange={(e) => handleChange('vnpayMerchantId', e.target.value)}
                placeholder="Nhập Merchant ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vnpaySecretKey">Secret Key</Label>
              <Input
                id="vnpaySecretKey"
                type="password"
                value={settings.vnpaySecretKey}
                onChange={(e) => handleChange('vnpaySecretKey', e.target.value)}
                placeholder="Nhập Secret Key"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Third-party Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5" />
            Dịch vụ bên thứ ba
          </CardTitle>
          <CardDescription>
            Tích hợp với các dịch vụ phân tích và marketing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
              <Input
                id="googleAnalytics"
                value={settings.googleAnalytics}
                onChange={(e) => handleChange('googleAnalytics', e.target.value)}
                placeholder="GA-XXXXXXXXX"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
              <Input
                id="facebookPixel"
                value={settings.facebookPixel}
                onChange={(e) => handleChange('facebookPixel', e.target.value)}
                placeholder="123456789012345"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zaloOA">Zalo Official Account</Label>
              <Input
                id="zaloOA"
                value={settings.zaloOA}
                onChange={(e) => handleChange('zaloOA', e.target.value)}
                placeholder="Nhập Zalo OA ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telegramBot">Telegram Bot Token</Label>
              <Input
                id="telegramBot"
                value={settings.telegramBot}
                onChange={(e) => handleChange('telegramBot', e.target.value)}
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={settings.webhookUrl}
              onChange={(e) => handleChange('webhookUrl', e.target.value)}
              placeholder="https://your-domain.com/webhook"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
