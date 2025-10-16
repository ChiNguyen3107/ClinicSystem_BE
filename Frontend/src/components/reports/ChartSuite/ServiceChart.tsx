import React from 'react';
import {
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
import { Badge } from '@/components/ui/badge';
import { ServiceData } from '@/types/report';

interface ServiceChartProps {
  data: ServiceData;
  isLoading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function ServiceChart({ data, isLoading = false }: ServiceChartProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'destructive';
      case 'normal': return 'default';
      case 'high': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'low': return 'Thấp';
      case 'normal': return 'Bình thường';
      case 'high': return 'Cao';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Services */}
      <Card>
        <CardHeader>
          <CardTitle>Dịch vụ được sử dụng nhiều nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topServices} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number"
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <YAxis 
                dataKey="serviceName" 
                type="category"
                width={120}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? `${value.toLocaleString('vi-VN')} VND` : value,
                  name === 'revenue' ? 'Doanh thu' : 'Số lần sử dụng'
                ]}
              />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Thuốc được sử dụng nhiều nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topMedications}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="medicationName" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `${value.toLocaleString('vi-VN')} VND` : value,
                    name === 'revenue' ? 'Doanh thu' : 'Số lần sử dụng'
                  ]}
                />
                <Bar dataKey="usageCount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.revenueByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {data.revenueByCategory.map((entry, index) => (
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

      {/* Inventory Status */}
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái tồn kho</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.inventory.map((item) => (
              <div key={item.itemId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.itemName}</h4>
                  <p className="text-sm text-muted-foreground">
                    Tồn kho: {item.currentStock} / Tối thiểu: {item.minStock}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(item.status)}>
                    {getStatusText(item.status)}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {item.currentStock < item.minStock ? '⚠️' : '✅'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.topServices.length}</div>
              <p className="text-sm text-muted-foreground">Dịch vụ chính</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.topMedications.length}</div>
              <p className="text-sm text-muted-foreground">Loại thuốc</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {data.inventory.filter(item => item.status === 'low').length}
              </div>
              <p className="text-sm text-muted-foreground">Sản phẩm sắp hết</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
