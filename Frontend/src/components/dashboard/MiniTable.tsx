import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface TableItem {
  id: string | number;
  title: string;
  subtitle?: string;
  status?: string;
  time?: string;
  date?: string;
  priority?: 'low' | 'medium' | 'high';
  actions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline';
  }>;
}

interface MiniTableProps {
  title: string;
  description?: string;
  items: TableItem[];
  loading?: boolean;
  emptyMessage?: string;
  maxItems?: number;
  className?: string;
  onViewAll?: () => void;
}

const MiniTable: React.FC<MiniTableProps> = ({
  title,
  description,
  items,
  loading = false,
  emptyMessage = 'Không có dữ liệu',
  maxItems = 5,
  className,
  onViewAll
}) => {
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusMap = {
      PENDING: { variant: 'secondary' as const, label: 'Chờ xác nhận' },
      CONFIRMED: { variant: 'default' as const, label: 'Đã xác nhận' },
      IN_PROGRESS: { variant: 'default' as const, label: 'Đang khám' },
      COMPLETED: { variant: 'default' as const, label: 'Hoàn thành' },
      CANCELLED: { variant: 'destructive' as const, label: 'Đã hủy' },
      URGENT: { variant: 'destructive' as const, label: 'Khẩn cấp' },
      NORMAL: { variant: 'secondary' as const, label: 'Bình thường' },
      LOW: { variant: 'outline' as const, label: 'Thấp' }
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { 
      variant: 'secondary' as const, 
      label: status 
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </CardTitle>
          {description && (
            <CardDescription className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayItems = items.slice(0, maxItems);
  const hasMore = items.length > maxItems;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            Xem tất cả
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {displayItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">📋</div>
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayItems.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-colors",
                  "hover:bg-gray-50 cursor-pointer"
                )}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    {getPriorityIcon(item.priority)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p className="text-xs text-gray-500 truncate">
                        {item.subtitle}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      {item.time && (
                        <span className="text-xs text-gray-400">
                          {item.time}
                        </span>
                      )}
                      {item.date && (
                        <span className="text-xs text-gray-400">
                          {item.date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.status && getStatusBadge(item.status)}
                  
                  {item.actions && item.actions.length > 0 && (
                    <div className="flex items-center space-x-1">
                      {item.actions.slice(0, 2).map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant={action.variant || 'ghost'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                          }}
                          className="h-8 w-8 p-0"
                        >
                          {action.icon}
                        </Button>
                      ))}
                      {item.actions.length > 2 && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {hasMore && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" onClick={onViewAll}>
                  Xem thêm {items.length - maxItems} mục khác
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MiniTable;
