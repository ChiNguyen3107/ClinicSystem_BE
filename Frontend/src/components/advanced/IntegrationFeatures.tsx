import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plug, 
  Key, 
  Webhook, 
  Database,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Globe,
  Shield,
  RefreshCw,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  service: string;
  key: string;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  lastUsed: string;
  permissions: string[];
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  lastTriggered: string;
  successRate: number;
}

interface ThirdPartyIntegration {
  id: string;
  name: string;
  type: 'HIS' | 'PACS' | 'Lab' | 'Pharmacy' | 'Insurance';
  status: 'connected' | 'disconnected' | 'error';
  endpoint: string;
  lastSync: string;
  dataFlow: 'bidirectional' | 'inbound' | 'outbound';
}

interface DataSync {
  id: string;
  source: string;
  target: string;
  type: 'real-time' | 'batch' | 'scheduled';
  status: 'running' | 'stopped' | 'error';
  lastSync: string;
  recordsProcessed: number;
  errorCount: number;
}

const IntegrationFeatures: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'HIS Integration',
      service: 'Hospital Information System',
      key: 'ak_****1234',
      status: 'active',
      createdAt: '2024-01-15',
      lastUsed: '2024-01-20',
      permissions: ['read:patients', 'write:appointments', 'read:reports']
    },
    {
      id: '2',
      name: 'PACS API',
      service: 'Picture Archiving System',
      key: 'ak_****5678',
      status: 'active',
      createdAt: '2024-01-10',
      lastUsed: '2024-01-19',
      permissions: ['read:images', 'write:studies']
    }
  ]);

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: '1',
      name: 'Patient Registration',
      url: 'https://webhook.site/abc123',
      events: ['patient.created', 'patient.updated'],
      status: 'active',
      lastTriggered: '2024-01-20 14:30',
      successRate: 98
    },
    {
      id: '2',
      name: 'Appointment Updates',
      url: 'https://webhook.site/def456',
      events: ['appointment.created', 'appointment.cancelled'],
      status: 'active',
      lastTriggered: '2024-01-20 15:45',
      successRate: 95
    }
  ]);

  const [integrations, setIntegrations] = useState<ThirdPartyIntegration[]>([
    {
      id: '1',
      name: 'HIS Main System',
      type: 'HIS',
      status: 'connected',
      endpoint: 'https://his.example.com/api',
      lastSync: '2024-01-20 16:00',
      dataFlow: 'bidirectional'
    },
    {
      id: '2',
      name: 'PACS Server',
      type: 'PACS',
      status: 'connected',
      endpoint: 'https://pacs.example.com/api',
      lastSync: '2024-01-20 15:30',
      dataFlow: 'inbound'
    },
    {
      id: '3',
      name: 'Lab System',
      type: 'Lab',
      status: 'error',
      endpoint: 'https://lab.example.com/api',
      lastSync: '2024-01-19 10:00',
      dataFlow: 'outbound'
    }
  ]);

  const [dataSyncs, setDataSyncs] = useState<DataSync[]>([
    {
      id: '1',
      source: 'HIS System',
      target: 'Local Database',
      type: 'real-time',
      status: 'running',
      lastSync: '2024-01-20 16:00',
      recordsProcessed: 1250,
      errorCount: 0
    },
    {
      id: '2',
      source: 'PACS Server',
      target: 'Image Storage',
      type: 'batch',
      status: 'running',
      lastSync: '2024-01-20 15:30',
      recordsProcessed: 45,
      errorCount: 2
    }
  ]);

  const [newApiKey, setNewApiKey] = useState({
    name: '',
    service: '',
    permissions: [] as string[]
  });

  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'running':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
      case 'disconnected':
      case 'stopped':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error':
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'running':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
      case 'disconnected':
      case 'stopped':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'error':
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const addApiKey = () => {
    if (newApiKey.name && newApiKey.service) {
      const apiKey: APIKey = {
        id: Date.now().toString(),
        name: newApiKey.name,
        service: newApiKey.service,
        key: `ak_****${Math.random().toString(36).substr(2, 4)}`,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: new Date().toISOString().split('T')[0],
        permissions: newApiKey.permissions
      };
      setApiKeys([...apiKeys, apiKey]);
      setNewApiKey({ name: '', service: '', permissions: [] });
    }
  };

  const addWebhook = () => {
    if (newWebhook.name && newWebhook.url) {
      const webhook: WebhookConfig = {
        id: Date.now().toString(),
        name: newWebhook.name,
        url: newWebhook.url,
        events: newWebhook.events,
        status: 'active',
        lastTriggered: 'Chưa kích hoạt',
        successRate: 0
      };
      setWebhooks([...webhooks, webhook]);
      setNewWebhook({ name: '', url: '', events: [] });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="api" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api">API Management</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="integrations">Tích hợp</TabsTrigger>
          <TabsTrigger value="sync">Đồng bộ dữ liệu</TabsTrigger>
        </TabsList>

        {/* API Management Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-500" />
                Quản lý API Keys
              </CardTitle>
              <CardDescription>
                Tạo và quản lý các API keys cho tích hợp hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New API Key */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                <Input
                  placeholder="Tên API key"
                  value={newApiKey.name}
                  onChange={(e) => setNewApiKey({...newApiKey, name: e.target.value})}
                />
                <Input
                  placeholder="Dịch vụ"
                  value={newApiKey.service}
                  onChange={(e) => setNewApiKey({...newApiKey, service: e.target.value})}
                />
                <Button onClick={addApiKey} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm API Key
                </Button>
              </div>

              {/* API Keys List */}
              <div className="space-y-2">
                {apiKeys.map((apiKey) => (
                  <Card key={apiKey.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{apiKey.name}</h3>
                            <Badge className={getStatusColor(apiKey.status)}>
                              {apiKey.status === 'active' ? 'Hoạt động' : 
                               apiKey.status === 'inactive' ? 'Không hoạt động' : 'Hết hạn'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {apiKey.service} • {apiKey.key}
                          </div>
                          <div className="text-xs text-gray-500">
                            Tạo: {apiKey.createdAt} • Sử dụng cuối: {apiKey.lastUsed}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(apiKey.status)}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5 text-green-500" />
                Cấu hình Webhooks
              </CardTitle>
              <CardDescription>
                Thiết lập webhooks để nhận thông báo khi có sự kiện xảy ra
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Webhook */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                <Input
                  placeholder="Tên webhook"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({...newWebhook, name: e.target.value})}
                />
                <Input
                  placeholder="URL endpoint"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({...newWebhook, url: e.target.value})}
                />
                <Button onClick={addWebhook} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm Webhook
                </Button>
              </div>

              {/* Webhooks List */}
              <div className="space-y-2">
                {webhooks.map((webhook) => (
                  <Card key={webhook.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{webhook.name}</h3>
                            <Badge className={getStatusColor(webhook.status)}>
                              {webhook.status === 'active' ? 'Hoạt động' : 
                               webhook.status === 'inactive' ? 'Không hoạt động' : 'Lỗi'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {webhook.url}
                          </div>
                          <div className="text-xs text-gray-500">
                            Kích hoạt cuối: {webhook.lastTriggered} • Tỷ lệ thành công: {webhook.successRate}%
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(webhook.status)}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5 text-purple-500" />
                Tích hợp bên thứ ba
              </CardTitle>
              <CardDescription>
                Quản lý kết nối với các hệ thống bên ngoài
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          {integration.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(integration.status)}
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status === 'connected' ? 'Đã kết nối' : 
                             integration.status === 'disconnected' ? 'Ngắt kết nối' : 'Lỗi'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600">Loại hệ thống</div>
                          <div className="text-sm">{integration.type}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Endpoint</div>
                          <div className="text-sm text-blue-600">{integration.endpoint}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Luồng dữ liệu</div>
                          <div className="text-sm">
                            {integration.dataFlow === 'bidirectional' ? 'Hai chiều' :
                             integration.dataFlow === 'inbound' ? 'Nhập vào' : 'Xuất ra'}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-600">Đồng bộ cuối</div>
                        <div className="text-sm">{integration.lastSync}</div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Đồng bộ
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Cấu hình
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Sync Tab */}
        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-orange-500" />
                Đồng bộ dữ liệu
              </CardTitle>
              <CardDescription>
                Theo dõi và quản lý quá trình đồng bộ dữ liệu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataSyncs.map((sync) => (
                  <Card key={sync.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {sync.source} → {sync.target}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(sync.status)}
                          <Badge className={getStatusColor(sync.status)}>
                            {sync.status === 'running' ? 'Đang chạy' : 
                             sync.status === 'stopped' ? 'Dừng' : 'Lỗi'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600">Loại đồng bộ</div>
                          <div className="text-sm">
                            {sync.type === 'real-time' ? 'Thời gian thực' :
                             sync.type === 'batch' ? 'Hàng loạt' : 'Theo lịch'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Đồng bộ cuối</div>
                          <div className="text-sm">{sync.lastSync}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Bản ghi xử lý</div>
                          <div className="text-sm">{sync.recordsProcessed.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Lỗi</div>
                          <div className="text-sm text-red-600">{sync.errorCount}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Đồng bộ ngay
                        </Button>
                        <Button variant="outline" size="sm">
                          <Activity className="h-4 w-4 mr-2" />
                          Xem log
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationFeatures;
