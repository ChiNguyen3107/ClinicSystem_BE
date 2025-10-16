import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Building2, 
  User, 
  Shield, 
  Plug, 
  Database,
  Save,
  RefreshCw
} from 'lucide-react';

// Import các component con
import { SystemSettings } from './SystemSettings';
import { UserSettings } from './UserSettings';
import { SecuritySettings } from './SecuritySettings';
import { IntegrationSettings } from './IntegrationSettings';
import { BackupSettings } from './BackupSettings';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('system');
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    // Logic để lưu tất cả thay đổi
    setHasChanges(false);
    // TODO: Implement save logic
  };

  const handleReset = () => {
    // Logic để reset về giá trị mặc định
    setHasChanges(false);
    // TODO: Implement reset logic
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground">
            Quản lý cài đặt hệ thống, người dùng, bảo mật và tích hợp
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Có thay đổi chưa lưu
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Khôi phục
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Hệ thống
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Người dùng
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Bảo mật
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Tích hợp
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Sao lưu
          </TabsTrigger>
        </TabsList>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <SystemSettings onChanges={setHasChanges} />
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="user" className="space-y-6">
          <UserSettings onChanges={setHasChanges} />
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <SecuritySettings onChanges={setHasChanges} />
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integration" className="space-y-6">
          <IntegrationSettings onChanges={setHasChanges} />
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-6">
          <BackupSettings onChanges={setHasChanges} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
