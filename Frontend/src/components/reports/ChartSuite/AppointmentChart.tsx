import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentData } from '@/types/report';

interface AppointmentChartProps {
  data: AppointmentData;
  isLoading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AppointmentChart({ data, isLoading = false }: AppointmentChartProps) {
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
      {/* Appointment Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng lịch hẹn</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  value,
                  name === 'scheduled' ? 'Đã đặt' : 
                  name === 'completed' ? 'Hoàn thành' : 'Đã hủy'
                ]}
                labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="scheduled" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Đã đặt"
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Hoàn thành"
              />
              <Line 
                type="monotone" 
                dataKey="cancelled" 
                stroke="#ff7300" 
                strokeWidth={2}
                name="Đã hủy"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by Doctor */}
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất theo bác sĩ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.byDoctor} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number"
                  domain={[0, 100]}
                />
                <YAxis 
                  dataKey="doctorName" 
                  type="category"
                  width={100}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'completionRate' ? `${value.toFixed(1)}%` : value,
                    name === 'completionRate' ? 'Tỷ lệ hoàn thành' : 'Số lượng'
                  ]}
                />
                <Bar dataKey="completionRate" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance by Time Slot */}
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất theo khung giờ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.byTimeSlot}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeSlot" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'completionRate' ? `${value.toFixed(1)}%` : value,
                    name === 'completionRate' ? 'Tỷ lệ hoàn thành' : 'Số lượng'
                  ]}
                />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Reasons */}
      <Card>
        <CardHeader>
          <CardTitle>Lý do hủy lịch hẹn</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.cancelReasons}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ reason, percentage }) => `${reason}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.cancelReasons.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, 'Số lượng']}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.total}</div>
              <p className="text-sm text-muted-foreground">Tổng lịch hẹn</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.completed}</div>
              <p className="text-sm text-muted-foreground">Hoàn thành</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{data.completionRate.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{data.averageWaitingTime}</div>
              <p className="text-sm text-muted-foreground">Thời gian chờ TB (phút)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
