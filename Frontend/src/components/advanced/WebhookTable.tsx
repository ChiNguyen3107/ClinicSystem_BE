import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plug, 
  Key, 
  Webhook, 
  Database, 
  Server, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  RefreshCw,
  Download,
  Upload,
  Activity,
  Globe,
  Lock,
  Unlock
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: 'his' | 'pacs' | 'lab' | 'pharmacy' | 'insurance' | 'custom';
  status: 'active' | 'inactive' | 'error' | 'pending';
  endpoint: string;
  apiKey: string;
  lastSync: Date;
  syncCount: number;
  errorCount: number;
  description: string;
  version: string;
  health: 'healthy' | 'warning' | 'error';
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  lastTriggered: Date;
  triggerCount: number;
  successRate: number;
  secret: string;
  retryCount: number;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  expiresAt: Date;
  lastUsed: Date;
  status: 'active' | 'expired' | 'revoked';
  usage: number;
}

const WebhookTable: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [activeTab, setActiveTab] = useState<'integrations' | 'webhooks' | 'api-keys'>('integrations');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Mock integrations data
    const mockIntegrations: Integration[] = [
      {
        id: '1',
        name: 'HIS - Bệnh viện ABC',
        type: 'his',
        status: 'active',
        endpoint: 'https://his.abc-hospital.com/api/v2',
        apiKey: 'his_***abc123',
        lastSync: new Date(Date.now() - 5 * 60 * 1000),
        syncCount: 1247,
        errorCount: 3,
        description: 'Kết nối hệ thống thông tin bệnh viện',
        version: 'v2.1.3',
        health: 'healthy'
      },
      {
        id: '2',
        name: 'PACS - Hình ảnh y tế',
        type: 'pacs',
        status: 'active',
        endpoint: 'https://pacs.medical.com/dicom',
        apiKey: 'pacs_***def456',
        lastSync: new Date(Date.now() - 15 * 60 * 1000),
        syncCount: 892,
        errorCount: 1,
        description: 'Hệ thống lưu trữ và truyền tải hình ảnh y tế',
        version: 'v3.0.1',
        health: 'healthy'
      },
      {
        id: '3',
        name: 'Lab - Xét nghiệm',
        type: 'lab',
        status: 'error',
        endpoint: 'https://lab.results.com/api',
        apiKey: 'lab_***ghi789',
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        syncCount: 456,
        errorCount: 12,
        description: 'Kết nối phòng xét nghiệm',
        version: 'v1.8.2',
        health: 'error'
      },
      {
        id: '4',
        name: 'Bảo hiểm y tế',
        type: 'insurance',
        status: 'pending',
        endpoint: 'https://insurance.gov.vn/api',
        apiKey: 'ins_***jkl012',
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
        syncCount: 234,
        errorCount: 0,
        description: 'Kết nối hệ thống bảo hiểm y tế',
        version: 'v1.0.0',
        health: 'warning'
      }
    ];

    const mockWebhooks: Webhook[] = [
      {
        id: '1',
        name: 'Patient Created',
        url: 'https://webhook.site/abc123',
        events: ['patient.created', 'patient.updated'],
        status: 'active',
        lastTriggered: new Date(Date.now() - 10 * 60 * 1000),
        triggerCount: 156,
        successRate: 0.98,
        secret: 'wh_***secret123',
        retryCount: 2
      },
      {
        id: '2',
        name: 'Appointment Status',
        url: 'https://webhook.site/def456',
        events: ['appointment.created', 'appointment.cancelled'],
        status: 'active',
        lastTriggered: new Date(Date.now() - 30 * 60 * 1000),
        triggerCount: 89,
        successRate: 0.95,
        secret: 'wh_***secret456',
        retryCount: 0
      },
      {
        id: '3',
        name: 'Payment Notification',
        url: 'https://webhook.site/ghi789',
        events: ['payment.completed', 'payment.failed'],
        status: 'error',
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
        triggerCount: 45,
        successRate: 0.78,
        secret: 'wh_***secret789',
        retryCount: 5
      }
    ];

    const mockApiKeys: APIKey[] = [
      {
        id: '1',
        name: 'Mobile App Key',
        key: 'ak_***mobile123',
        permissions: ['read:patients', 'write:appointments'],
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'active',
        usage: 1247
      },
      {
        id: '2',
        name: 'Third-party Integration',
        key: 'ak_***thirdparty456',
        permissions: ['read:patients', 'read:appointments'],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        lastUsed: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'active',
        usage: 892
      },
      {
        id: '3',
        name: 'Analytics Service',
        key: 'ak_***analytics789',
        permissions: ['read:all'],
        expiresAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'expired',
        usage: 234
      }
    ];

    setIntegrations(mockIntegrations);
    setWebhooks(mockWebhooks);
    setApiKeys(mockApiKeys);
  }, []);

  const getTypeIcon = (type: string) => {
    const icons = {
      his: Database,
      pacs: Server,
      lab: Activity,
      pharmacy: Globe,
      insurance: Shield,
      custom: Plug
    };
    return icons[type as keyof typeof icons] || Plug;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      his: 'HIS',
      pacs: 'PACS',
      lab: 'Lab',
      pharmacy: 'Nhà thuốc',
      insurance: 'Bảo hiểm',
      custom: 'Tùy chỉnh'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default' as const, label: 'Hoạt động', icon: CheckCircle },
      inactive: { variant: 'secondary' as const, label: 'Tạm dừng', icon: XCircle },
      error: { variant: 'destructive' as const, label: 'Lỗi', icon: AlertTriangle },
      pending: { variant: 'outline' as const, label: 'Chờ duyệt', icon: Clock }
    };

    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getHealthBadge = (health: string) => {
    const variants = {
      healthy: { variant: 'default' as const, label: 'Tốt', icon: CheckCircle },
      warning: { variant: 'secondary' as const, label: 'Cảnh báo', icon: AlertTriangle },
      error: { variant: 'destructive' as const, label: 'Lỗi', icon: XCircle }
    };

    const config = variants[health as keyof typeof variants];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  const activeIntegrations = integrations.filter(i => i.status === 'active').length;
  const totalWebhooks = webhooks.length;
  const activeApiKeys = apiKeys.filter(k => k.status === 'active').length;
  const totalErrors = integrations.reduce((sum, i) => sum + i.errorCount, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tích hợp hoạt động</p>
                <p className="text-2xl font-bold">{activeIntegrations}/{integrations.length}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Webhooks</p>
                <p className="text-2xl font-bold">{totalWebhooks}</p>
              </div>
              <Webhook className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">API Keys</p>
                <p className="text-2xl font-bold">{activeApiKeys}</p>
              </div>
              <Key className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lỗi tổng</p>
                <p className="text-2xl font-bold text-red-500">{totalErrors}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5" />
                Integration Hub
              </CardTitle>
              <CardDescription>
                Quản lý kết nối HIS/PACS/Lab, API keys và webhooks
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất log
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'integrations' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('integrations')}
            >
              <Database className="h-4 w-4 mr-2" />
              Tích hợp
            </Button>
            <Button
              variant={activeTab === 'webhooks' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('webhooks')}
            >
              <Webhook className="h-4 w-4 mr-2" />
              Webhooks
            </Button>
            <Button
              variant={activeTab === 'api-keys' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('api-keys')}
            >
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </Button>
          </div>

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Hệ thống tích hợp</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm tích hợp
                </Button>
              </div>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Sức khỏe</TableHead>
                      <TableHead>Đồng bộ cuối</TableHead>
                      <TableHead>Lỗi</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {integrations.map((integration) => {
                      const TypeIcon = getTypeIcon(integration.type);
                      return (
                        <TableRow key={integration.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TypeIcon className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{integration.name}</p>
                                <p className="text-sm text-muted-foreground">{integration.description}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getTypeLabel(integration.type)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(integration.status)}
                          </TableCell>
                          <TableCell>
                            {getHealthBadge(integration.health)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {Math.floor((Date.now() - integration.lastSync.getTime()) / 60000)} phút trước
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {integration.errorCount > 0 ? (
                              <Badge variant="destructive">{integration.errorCount}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Settings className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Webhooks Tab */}
          {activeTab === 'webhooks' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Webhooks</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm webhook
                </Button>
              </div>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Sự kiện</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Tỷ lệ thành công</TableHead>
                      <TableHead>Kích hoạt cuối</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.map((webhook) => (
                      <TableRow key={webhook.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{webhook.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {webhook.triggerCount} lần kích hoạt
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-mono">{webhook.url}</span>
                            <Button variant="ghost" size="sm" onClick={() => handleCopyKey(webhook.url)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.map((event, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(webhook.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{Math.round(webhook.successRate * 100)}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${webhook.successRate * 100}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {Math.floor((Date.now() - webhook.lastTriggered.getTime()) / 60000)} phút trước
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api-keys' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">API Keys</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo API key
                </Button>
              </div>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Quyền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Hết hạn</TableHead>
                      <TableHead>Sử dụng</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{apiKey.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Sử dụng lần cuối: {Math.floor((Date.now() - apiKey.lastUsed.getTime()) / (60 * 60 * 1000))} giờ trước
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono">{apiKey.key}</span>
                            <Button variant="ghost" size="sm" onClick={() => handleCopyKey(apiKey.key)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {apiKey.permissions.map((permission, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(apiKey.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {Math.floor((apiKey.expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000))} ngày
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{apiKey.usage}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Thao tác nhanh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Upload className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Import cấu hình</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Download className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Export cấu hình</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Activity className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Kiểm tra sức khỏe</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Bảo mật</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { WebhookTable };
