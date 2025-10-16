import React from 'react';
import { 
  Users, 
  Calendar, 
  UserCheck, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Building2,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { DashboardPeriod } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCardSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

interface StatsCardsProps {
  period?: DashboardPeriod;
  className?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'indigo';
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color,
  loading = false
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
  };

  const changeColorClasses = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  const getChangeColor = (changeValue?: number) => {
    if (changeValue === undefined || changeValue === 0) return 'neutral';
    return changeValue > 0 ? 'positive' : 'negative';
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString('vi-VN');
    }
    return val;
  };

  const formatChange = (changeValue?: number) => {
    if (changeValue === undefined) return null;
    const absValue = Math.abs(changeValue);
    return `${changeValue > 0 ? '+' : ''}${changeValue.toFixed(1)}%`;
  };

  if (loading) {
    return <StatCardSkeleton />;
  }

  return (
    <Card className={cn(
      "p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer",
      "border-l-4",
      colorClasses[color]
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatValue(value)}
          </p>
        </div>
        <div className={cn(
          "p-3 rounded-lg border",
          colorClasses[color]
        )}>
          {icon}
        </div>
      </div>
      
      {(change !== undefined || changeLabel) && (
        <div className="mt-4 flex items-center space-x-2">
          {change !== undefined && (
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs font-medium",
                changeColorClasses[getChangeColor(change)]
              )}
            >
              {change > 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : change < 0 ? (
                <TrendingDown className="w-3 h-3 mr-1" />
              ) : null}
              {formatChange(change)}
            </Badge>
          )}
          {changeLabel && (
            <span className="text-xs text-gray-500">{changeLabel}</span>
          )}
        </div>
      )}
    </Card>
  );
};

const StatsCards: React.FC<StatsCardsProps> = ({ 
  period = 'month', 
  className 
}) => {
  const { stats, loading, error, lastUpdated } = useDashboardStats(period);

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card className="p-6 col-span-full">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-red-600 font-medium">Không thể tải dữ liệu thống kê</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  const statsData = [
    {
      title: 'Tổng bệnh nhân',
      value: stats?.totalPatients || 0,
      change: stats?.totalPatientsChange,
      changeLabel: 'so với tháng trước',
      icon: <Users className="w-6 h-6" />,
      color: 'blue' as const
    },
    {
      title: 'Lịch hẹn hôm nay',
      value: stats?.todayAppointments || 0,
      changeLabel: `${stats?.pendingAppointments || 0} đang chờ`,
      icon: <Calendar className="w-6 h-6" />,
      color: 'green' as const
    },
    {
      title: 'Bác sĩ hoạt động',
      value: stats?.activeDoctors || 0,
      changeLabel: `${stats?.doctorsWithSchedule || 0} có lịch`,
      icon: <UserCheck className="w-6 h-6" />,
      color: 'orange' as const
    },
    {
      title: 'Doanh thu tháng',
      value: stats?.monthlyRevenue ? `${(stats.monthlyRevenue / 1000000).toFixed(1)}M` : '0M',
      change: stats?.revenueGrowth,
      changeLabel: 'tăng trưởng',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'purple' as const
    },
    {
      title: 'Tỷ lệ khám thành công',
      value: stats?.successRate ? `${stats.successRate.toFixed(1)}%` : '0%',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'indigo' as const
    },
    {
      title: 'Phòng khám đang sử dụng',
      value: stats?.activeRooms || 0,
      icon: <Building2 className="w-6 h-6" />,
      color: 'red' as const
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header với thông tin cập nhật */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Thống kê tổng quan</h2>
          <p className="text-sm text-gray-500">
            Dữ liệu được cập nhật {lastUpdated ? 
              `lúc ${lastUpdated.toLocaleTimeString('vi-VN')}` : 
              'đang tải...'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            Tự động cập nhật mỗi 5 phút
          </span>
        </div>
      </div>

      {/* Grid stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeLabel={stat.changeLabel}
            icon={stat.icon}
            color={stat.color}
            loading={loading}
          />
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Đang cập nhật dữ liệu...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCards;
