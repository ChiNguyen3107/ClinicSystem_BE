import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  Video, 
  Cpu, 
  BarChart3, 
  Plug, 
  Settings,
  Sparkles,
  Activity,
  Database,
  Shield
} from 'lucide-react';

// Import advanced components
import { ChatPanel } from '@/components/advanced/ChatPanel';
import { VideoCallPanel } from '@/components/advanced/VideoCallPanel';
import { DeviceList } from '@/components/advanced/DeviceList';
import { InsightCards } from '@/components/advanced/InsightCards';
import { WebhookTable } from '@/components/advanced/WebhookTable';

const AdvancedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ai');

  const moduleStatus = {
    ai: { enabled: true, status: 'active' },
    telemedicine: { enabled: true, status: 'beta' },
    iot: { enabled: false, status: 'development' },
    analytics: { enabled: true, status: 'active' },
    integrations: { enabled: false, status: 'setup' }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      beta: 'secondary',
      development: 'destructive',
      setup: 'outline'
    } as const;
    
    const labels = {
      active: 'Hoạt động',
      beta: 'Beta',
      development: 'Phát triển',
      setup: 'Cần cài đặt'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Tính năng nâng cao</h1>
        <p className="text-muted-foreground">
          Các module AI, Telemedicine, IoT, Analytics và Integration Hub
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">Chat Bot</span>
              {getStatusBadge(moduleStatus.ai.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Gợi ý chẩn đoán, tư vấn thuốc
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Telemedicine</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">Video Call</span>
              {getStatusBadge(moduleStatus.telemedicine.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Khám từ xa, chia sẻ màn hình
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IoT Devices</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">12</span>
              {getStatusBadge(moduleStatus.iot.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Thiết bị y tế kết nối
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">BI</span>
              {getStatusBadge(moduleStatus.analytics.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Phân tích dự đoán, báo cáo
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrations</CardTitle>
            <Plug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">5</span>
              {getStatusBadge(moduleStatus.integrations.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Kết nối HIS/PACS/Lab
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="telemedicine" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Telemedicine
          </TabsTrigger>
          <TabsTrigger value="iot" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            IoT Devices
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* AI Assistant Tab */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                AI Assistant
              </CardTitle>
              <CardDescription>
                Chat bot thông minh với khả năng gợi ý chẩn đoán, phân tích triệu chứng và tư vấn thuốc
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatPanel />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Telemedicine Tab */}
        <TabsContent value="telemedicine" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-green-500" />
                Telemedicine
              </CardTitle>
              <CardDescription>
                Khám từ xa với video call, chia sẻ màn hình và ePrescription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoCallPanel />
            </CardContent>
          </Card>
        </TabsContent>

        {/* IoT Devices Tab */}
        <TabsContent value="iot" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-500" />
                IoT Devices
              </CardTitle>
              <CardDescription>
                Quản lý thiết bị y tế kết nối, đồng bộ dữ liệu và cảnh báo bất thường
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DeviceList />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                Analytics & BI
              </CardTitle>
              <CardDescription>
                Phân tích dự đoán, báo cáo tùy chỉnh và visualization grid
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InsightCards />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-500" />
                Integration Hub
              </CardTitle>
              <CardDescription>
                Kết nối HIS/PACS/Lab, quản lý API keys và webhook
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WebhookTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Cấu hình bảo mật
            </Button>
            <Button variant="outline" size="sm">
              <Database className="h-4 w-4 mr-2" />
              Đồng bộ dữ liệu
            </Button>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Kiểm tra trạng thái
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedPage;
