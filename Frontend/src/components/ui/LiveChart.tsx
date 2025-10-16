import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { LiveChartData } from '@/hooks/useLiveData';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface LiveChartProps {
  data: LiveChartData;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
  className?: string;
}

export const LiveChart: React.FC<LiveChartProps> = ({
  data,
  height = 300,
  showGrid = true,
  showTooltip = true,
  animate = true,
  className
}) => {
  const chartData = useMemo(() => {
    return data.data.map(point => ({
      ...point,
      timestamp: point.timestamp.getTime(),
      formattedTime: format(point.timestamp, 'HH:mm:ss', { locale: vi })
    }));
  }, [data.data]);

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (data.type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis 
              dataKey="formattedTime" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            {showTooltip && (
              <Tooltip
                labelFormatter={(value) => `Thời gian: ${value}`}
                formatter={(value, name) => [value, data.name]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
            )}
            <Bar 
              dataKey="value" 
              fill={data.color || '#3b82f6'}
              animationDuration={animate ? 1000 : 0}
            />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis 
              dataKey="formattedTime" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            {showTooltip && (
              <Tooltip
                labelFormatter={(value) => `Thời gian: ${value}`}
                formatter={(value, name) => [value, data.name]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="value"
              stroke={data.color || '#3b82f6'}
              fill={data.color || '#3b82f6'}
              fillOpacity={0.3}
              animationDuration={animate ? 1000 : 0}
            />
          </AreaChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis 
              dataKey="formattedTime" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            {showTooltip && (
              <Tooltip
                labelFormatter={(value) => `Thời gian: ${value}`}
                formatter={(value, name) => [value, data.name]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="value"
              stroke={data.color || '#3b82f6'}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={animate ? 1000 : 0}
            />
          </LineChart>
        );
    }
  };

  if (chartData.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-500">
          <div className="text-sm">Đang chờ dữ liệu...</div>
          <div className="text-xs mt-1">Biểu đồ sẽ hiển thị khi có dữ liệu</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-2">
        <h3 className="text-sm font-medium text-gray-900">{data.name}</h3>
        <p className="text-xs text-gray-500">
          {chartData.length} điểm dữ liệu • Cập nhật real-time
        </p>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
