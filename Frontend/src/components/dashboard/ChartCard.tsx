import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  LineChart, 
  PieChart,
  Activity
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface ChartData {
  name: string;
  value: number;
  change?: number;
  color?: string;
}

interface ChartCardProps {
  title: string;
  description?: string;
  data: ChartData[];
  type: 'line' | 'bar' | 'pie' | 'area';
  period?: string;
  loading?: boolean;
  className?: string;
  onPeriodChange?: (period: string) => void;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  data,
  type,
  period = 'month',
  loading = false,
  className,
  onPeriodChange
}) => {
  const getChartIcon = () => {
    switch (type) {
      case 'line': return <LineChart className="w-5 h-5" />;
      case 'bar': return <BarChart3 className="w-5 h-5" />;
      case 'pie': return <PieChart className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const getTotalValue = () => {
    return data.reduce((sum, item) => sum + item.value, 0);
  };

  const getAverageChange = () => {
    const changes = data.filter(item => item.change !== undefined).map(item => item.change!);
    if (changes.length === 0) return 0;
    return changes.reduce((sum, change) => sum + change, 0) / changes.length;
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
          <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  const totalValue = getTotalValue();
  const averageChange = getAverageChange();

  return (
    <Card className={cn("p-6 transition-all duration-200 hover:shadow-lg", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center space-x-2">
              {getChartIcon()}
              <span>{title}</span>
            </CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {onPeriodChange && (
              <div className="flex space-x-1">
                {['week', 'month', 'year'].map((p) => (
                  <Button
                    key={p}
                    variant={period === p ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPeriodChange(p)}
                    className="text-xs"
                  >
                    {p === 'week' ? 'Tuần' : p === 'month' ? 'Tháng' : 'Năm'}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Summary stats */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">
                {formatValue(totalValue)}
              </p>
              <div className="flex items-center space-x-2">
                {averageChange !== 0 && (
                  <Badge 
                    variant={averageChange > 0 ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {averageChange > 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(averageChange).toFixed(1)}%
                  </Badge>
                )}
                <span className="text-sm text-gray-500">
                  {period === 'week' ? 'tuần này' : period === 'month' ? 'tháng này' : 'năm nay'}
                </span>
              </div>
            </div>
          </div>

          {/* Chart placeholder - trong thực tế sẽ dùng Chart.js hoặc Recharts */}
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                {getChartIcon()}
              </div>
              <p className="text-sm text-gray-500">
                {type === 'line' ? 'Biểu đồ đường' : 
                 type === 'bar' ? 'Biểu đồ cột' : 
                 type === 'pie' ? 'Biểu đồ tròn' : 'Biểu đồ'}
              </p>
              <p className="text-xs text-gray-400">
                {data.length} điểm dữ liệu
              </p>
            </div>
          </div>

          {/* Data breakdown */}
          {data.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Chi tiết</h4>
              <div className="space-y-1">
                {data.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color || '#3B82F6' }}
                      />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{formatValue(item.value)}</span>
                      {item.change !== undefined && (
                        <Badge 
                          variant={item.change > 0 ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {data.length > 5 && (
                  <p className="text-xs text-gray-400 text-center">
                    và {data.length - 5} mục khác...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;