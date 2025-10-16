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
  Shield,
  Pill,
  Heart
} from 'lucide-react';

// Import advanced components
import { ChatPanel } from '@/components/advanced/ChatPanel';
import { VideoCallPanel } from '@/components/advanced/VideoCallPanel';
import { DeviceList } from '@/components/advanced/DeviceList';
import { InsightCards } from '@/components/advanced/InsightCards';
import { WebhookTable } from '@/components/advanced/WebhookTable';
import AIDiagnosis from '@/components/advanced/AIDiagnosis';
import MedicationInteractions from '@/components/advanced/MedicationInteractions';
import PredictiveAnalytics from '@/components/advanced/PredictiveAnalytics';
import HealthInsights from '@/components/advanced/HealthInsights';
import IntegrationFeatures from '@/components/advanced/IntegrationFeatures';

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
          AI Diagnosis, Medication Interactions, Predictive Analytics, Health Insights và Integration Features
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Diagnosis</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">AI</span>
              {getStatusBadge(moduleStatus.ai.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Chẩn đoán thông minh, phân tích triệu chứng
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tương tác thuốc</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">Drug</span>
              {getStatusBadge(moduleStatus.telemedicine.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Kiểm tra tương tác, cảnh báo
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phân tích dự đoán</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">Analytics</span>
              {getStatusBadge(moduleStatus.analytics.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Dự báo xu hướng, quy hoạch năng lực
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sức khỏe cộng đồng</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">Health</span>
              {getStatusBadge(moduleStatus.iot.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Insights, phòng ngừa, khuyến nghị
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tích hợp</CardTitle>
            <Plug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">API</span>
              {getStatusBadge(moduleStatus.integrations.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              API management, webhooks, đồng bộ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Diagnosis
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Thuốc
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Phân tích
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Sức khỏe
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Tích hợp
          </TabsTrigger>
        </TabsList>

        {/* AI Diagnosis Tab */}
        <TabsContent value="ai" className="space-y-4">
          <AIDiagnosis />
        </TabsContent>

        {/* Medication Interactions Tab */}
        <TabsContent value="medications" className="space-y-4">
          <MedicationInteractions />
        </TabsContent>

        {/* Predictive Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <PredictiveAnalytics />
        </TabsContent>

        {/* Health Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <HealthInsights />
        </TabsContent>

        {/* Integration Features Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <IntegrationFeatures />
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
