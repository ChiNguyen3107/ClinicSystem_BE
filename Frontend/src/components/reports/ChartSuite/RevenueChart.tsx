import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueData } from '@/types/report';

interface RevenueChartProps {
  data: RevenueData;
  isLoading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function RevenueChart({ data, isLoading = false }: RevenueChartProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
              />
              <YAxis 
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? `${value.toLocaleString('vi-VN')} VND` : value,
                  name === 'revenue' ? 'Doanh thu' : 'Lịch hẹn'
                ]}
                labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Doanh thu"
              />
              <Line 
                type="monotone" 
                dataKey="appointments" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Lịch hẹn"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Doctor */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo bác sĩ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.byDoctor} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number"
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <YAxis 
                  dataKey="doctorName" 
                  type="category"
                  width={100}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString('vi-VN')} VND`, 'Doanh thu']}
                />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Service */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo dịch vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.byService}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {data.byService.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString('vi-VN')} VND`, 'Doanh thu']}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Forecast */}
      {data.forecast && data.forecast.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dự báo doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString('vi-VN')} VND`,
                    name === 'predicted' ? 'Dự báo' : 'Độ tin cậy'
                  ]}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Dự báo"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
