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
import { PatientData } from '@/types/report';

interface PatientChartProps {
  data: PatientData;
  isLoading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function PatientChart({ data, isLoading = false }: PatientChartProps) {
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
      {/* Patient Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng bệnh nhân</CardTitle>
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
                  name === 'newPatients' ? 'Bệnh nhân mới' : 'Tổng bệnh nhân'
                ]}
                labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="newPatients" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Bệnh nhân mới"
              />
              <Line 
                type="monotone" 
                dataKey="totalPatients" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Tổng bệnh nhân"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố theo độ tuổi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.byAge}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ ageGroup, percentage }) => `${ageGroup}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.byAge.map((entry, index) => (
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

        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố theo giới tính</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.byGender}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gender" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [value, 'Số lượng']}
                />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố theo địa phương</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.byLocation} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="location" 
                  type="category"
                  width={80}
                />
                <Tooltip 
                  formatter={(value: number) => [value, 'Số lượng']}
                />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.total}</div>
              <p className="text-sm text-muted-foreground">Tổng bệnh nhân</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.newPatients}</div>
              <p className="text-sm text-muted-foreground">Bệnh nhân mới</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{data.returningPatients}</div>
              <p className="text-sm text-muted-foreground">Bệnh nhân tái khám</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
