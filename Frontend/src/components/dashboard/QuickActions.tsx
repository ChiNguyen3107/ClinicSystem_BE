import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  UserPlus, 
  Settings, 
  Calendar,
  BarChart3
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'indigo';
  action: () => void;
  badge?: string;
  disabled?: boolean;
}

interface QuickActionsProps {
  className?: string;
  onAction?: (actionId: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  className,
  onAction 
}) => {
  const actions: QuickAction[] = [
    {
      id: 'create-appointment',
      title: 'Tạo lịch hẹn',
      description: 'Đặt lịch khám mới cho bệnh nhân',
      icon: <Calendar className="w-5 h-5" />,
      color: 'blue',
      action: () => onAction?.('create-appointment')
    },
    {
      id: 'add-patient',
      title: 'Thêm bệnh nhân',
      description: 'Đăng ký bệnh nhân mới vào hệ thống',
      icon: <UserPlus className="w-5 h-5" />,
      color: 'green',
      action: () => onAction?.('add-patient')
    },
    {
      id: 'view-reports',
      title: 'Xem báo cáo',
      description: 'Xem các báo cáo thống kê chi tiết',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'orange',
      action: () => onAction?.('view-reports')
    },
    {
      id: 'system-settings',
      title: 'Cài đặt hệ thống',
      description: 'Cấu hình các thông số hệ thống',
      icon: <Settings className="w-5 h-5" />,
      color: 'purple',
      action: () => onAction?.('system-settings')
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
    red: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'
  };

  return (
    <Card className={cn("p-6", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Thao tác nhanh</span>
        </CardTitle>
        <CardDescription>
          Các chức năng thường dùng để tăng hiệu suất làm việc
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className={cn(
                "h-auto p-4 flex flex-col items-start space-y-2 text-left",
                colorClasses[action.color],
                action.disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={action.action}
              disabled={action.disabled}
            >
              <div className="flex items-center space-x-2 w-full">
                {action.icon}
                <span className="font-medium">{action.title}</span>
                {action.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {action.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 text-left">
                {action.description}
              </p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
