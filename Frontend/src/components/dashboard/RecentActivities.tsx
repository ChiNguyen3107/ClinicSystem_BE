import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  UserPlus, 
  Calendar,
  Bell,
  Activity,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface Activity {
  id: string;
  type: 'appointment' | 'patient' | 'notification' | 'task' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'pending' | 'completed' | 'cancelled' | 'in_progress';
  priority?: 'low' | 'medium' | 'high';
  user?: string;
  unread?: boolean;
}

interface RecentActivitiesProps {
  activities?: Activity[];
  loading?: boolean;
  className?: string;
  onRefresh?: () => void;
  onMarkAsRead?: (activityId: string) => void;
  onViewAll?: () => void;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities = [],
  loading = false,
  className,
  onRefresh,
  onMarkAsRead,
  onViewAll
}) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-4 h-4" />;
      case 'patient': return <UserPlus className="w-4 h-4" />;
      case 'notification': return <Bell className="w-4 h-4" />;
      case 'task': return <CheckCircle className="w-4 h-4" />;
      case 'system': return <Activity className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status?: Activity['status']) => {
    if (!status) return null;
    
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Chờ xử lý', color: 'text-yellow-600' },
      completed: { variant: 'default' as const, label: 'Hoàn thành', color: 'text-green-600' },
      cancelled: { variant: 'destructive' as const, label: 'Đã hủy', color: 'text-red-600' },
      in_progress: { variant: 'default' as const, label: 'Đang xử lý', color: 'text-blue-600' }
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const getPriorityColor = (priority?: Activity['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return timestamp.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <Card className={cn("p-6", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("p-6", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Hoạt động gần đây</span>
            </CardTitle>
            <CardDescription>
              Các hoạt động và thông báo mới nhất
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            {onViewAll && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewAll}
                className="text-xs"
              >
                Xem tất cả
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không có hoạt động nào</p>
            <p className="text-sm text-gray-400 mt-1">
              Các hoạt động mới sẽ hiển thị ở đây
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 10).map((activity) => (
              <div
                key={activity.id}
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-lg border-l-4 transition-all duration-200 hover:bg-gray-50",
                  getPriorityColor(activity.priority),
                  activity.unread && "bg-blue-50 border-l-blue-500"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  activity.unread ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                )}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm font-medium",
                        activity.unread ? "text-gray-900" : "text-gray-700"
                      )}>
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      {activity.user && (
                        <p className="text-xs text-gray-500 mt-1">
                          bởi {activity.user}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {getStatusBadge(activity.status)}
                      <span className="text-xs text-gray-500">
                        {formatTime(activity.timestamp)}
                      </span>
                      {activity.unread && onMarkAsRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMarkAsRead(activity.id)}
                          className="h-6 w-6 p-0"
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {activities.length > 10 && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewAll}
                  className="text-xs"
                >
                  Xem thêm {activities.length - 10} hoạt động khác
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
