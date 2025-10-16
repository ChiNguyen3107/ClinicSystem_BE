import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LiveCounter as LiveCounterType } from '@/hooks/useLiveData';
import { cn } from '@/utils/cn';

interface LiveCounterProps {
  counter: LiveCounterType;
  showChange?: boolean;
  showTrend?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LiveCounter: React.FC<LiveCounterProps> = ({
  counter,
  showChange = true,
  showTrend = true,
  size = 'md',
  className
}) => {
  const formatValue = (value: number, format: string = 'number') => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('vi-VN').format(value);
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className={cn('bg-white p-4 rounded-lg border', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            {counter.label}
          </p>
          <p className={cn('font-bold text-gray-900', sizeClasses[size])}>
            {formatValue(counter.value, counter.format)}
          </p>
        </div>
        
        {showChange && counter.change !== undefined && (
          <div className="text-right">
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              getChangeColor(counter.changeType || 'neutral')
            )}>
              {showTrend && getTrendIcon(counter.changeType || 'neutral')}
              <span>
                {counter.change > 0 ? '+' : ''}{formatValue(counter.change, counter.format)}
              </span>
            </div>
            {counter.previousValue !== undefined && (
              <p className="text-xs text-gray-500 mt-1">
                Từ {formatValue(counter.previousValue, counter.format)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
