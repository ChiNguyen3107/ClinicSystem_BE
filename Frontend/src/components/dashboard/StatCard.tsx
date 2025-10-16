import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'indigo';
  loading?: boolean;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = 'blue',
  loading = false,
  className
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
    return (
      <Card className={cn("p-6", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer",
      "border-l-4",
      colorClasses[color],
      className
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

export default StatCard;
