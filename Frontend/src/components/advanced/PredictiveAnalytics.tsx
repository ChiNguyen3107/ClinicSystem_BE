import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

interface PatientTrend {
  period: string;
  newPatients: number;
  returningPatients: number;
  totalVisits: number;
  averageAge: number;
  topConditions: string[];
}

interface ServiceDemand {
  service: string;
  currentDemand: number;
  predictedDemand: number;
  growthRate: number;
  peakHours: string[];
  seasonalTrend: 'increasing' | 'stable' | 'decreasing';
}

interface RevenueForecast {
  month: string;
  actual: number;
  predicted: number;
  confidence: number;
  factors: string[];
}

interface CapacityPlanning {
  resource: string;
  currentCapacity: number;
  utilization: number;
  predictedNeed: number;
  recommendations: string[];
}

const PredictiveAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [patientTrends] = useState<PatientTrend[]>([
    {
      period: 'Tháng 1',
      newPatients: 45,
      returningPatients: 120,
      totalVisits: 165,
      averageAge: 42,
      topConditions: ['Cảm cúm', 'Đau đầu', 'Sốt']
    },
    {
      period: 'Tháng 2',
      newPatients: 52,
      returningPatients: 135,
      totalVisits: 187,
      averageAge: 41,
      topConditions: ['Cảm cúm', 'Viêm họng', 'Đau bụng']
    },
    {
      period: 'Tháng 3',
      newPatients: 48,
      returningPatients: 142,
      totalVisits: 190,
      averageAge: 43,
      topConditions: ['Dị ứng', 'Viêm họng', 'Đau đầu']
    }
  ]);

  const [serviceDemand] = useState<ServiceDemand[]>([
    {
      service: 'Khám tổng quát',
      currentDemand: 150,
      predictedDemand: 180,
      growthRate: 20,
      peakHours: ['8:00-10:00', '14:00-16:00'],
      seasonalTrend: 'increasing'
    },
    {
      service: 'Xét nghiệm',
      currentDemand: 80,
      predictedDemand: 95,
      growthRate: 18.75,
      peakHours: ['7:00-9:00', '13:00-15:00'],
      seasonalTrend: 'stable'
    },
    {
      service: 'Chẩn đoán hình ảnh',
      currentDemand: 45,
      predictedDemand: 60,
      growthRate: 33.33,
      peakHours: ['9:00-11:00', '15:00-17:00'],
      seasonalTrend: 'increasing'
    }
  ]);

  const [revenueForecast] = useState<RevenueForecast[]>([
    {
      month: 'Tháng 1',
      actual: 25000000,
      predicted: 25000000,
      confidence: 100,
      factors: ['Dịch vụ ổn định', 'Không có yếu tố bất thường']
    },
    {
      month: 'Tháng 2',
      actual: 28000000,
      predicted: 27500000,
      confidence: 95,
      factors: ['Tăng nhu cầu khám bệnh', 'Mùa cúm']
    },
    {
      month: 'Tháng 3',
      actual: 0,
      predicted: 30000000,
      confidence: 85,
      factors: ['Xu hướng tăng trưởng', 'Mùa dị ứng']
    }
  ]);

  const [capacityPlanning] = useState<CapacityPlanning[]>([
    {
      resource: 'Bác sĩ',
      currentCapacity: 5,
      utilization: 85,
      predictedNeed: 7,
      recommendations: [
        'Tuyển thêm 2 bác sĩ',
        'Tăng ca làm việc',
        'Phân bổ lại lịch khám'
      ]
    },
    {
      resource: 'Phòng khám',
      currentCapacity: 8,
      utilization: 75,
      predictedNeed: 10,
      recommendations: [
        'Mở rộng thêm 2 phòng',
        'Tối ưu hóa sử dụng phòng',
        'Cân nhắc khám ngoài giờ'
      ]
    },
    {
      resource: 'Thiết bị y tế',
      currentCapacity: 12,
      utilization: 90,
      predictedNeed: 15,
      recommendations: [
        'Mua thêm 3 thiết bị',
        'Bảo trì định kỳ',
        'Nâng cấp thiết bị cũ'
      ]
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'decreasing': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Xu hướng bệnh nhân</TabsTrigger>
          <TabsTrigger value="demand">Nhu cầu dịch vụ</TabsTrigger>
          <TabsTrigger value="revenue">Dự báo doanh thu</TabsTrigger>
          <TabsTrigger value="capacity">Quy hoạch năng lực</TabsTrigger>
        </TabsList>

        {/* Patient Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Xu hướng bệnh nhân
              </CardTitle>
              <CardDescription>
                Phân tích xu hướng và dự báo số lượng bệnh nhân
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">145</div>
                  <div className="text-sm text-gray-600">Bệnh nhân mới/tháng</div>
                  <div className="text-xs text-green-600">+12% so với tháng trước</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">397</div>
                  <div className="text-sm text-gray-600">Bệnh nhân cũ/tháng</div>
                  <div className="text-xs text-green-600">+8% so với tháng trước</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">42</div>
                  <div className="text-sm text-gray-600">Tuổi trung bình</div>
                  <div className="text-xs text-blue-600">Ổn định</div>
                </div>
              </div>

              <div className="space-y-4">
                {patientTrends.map((trend, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{trend.period}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600">Bệnh nhân mới</div>
                          <div className="text-xl font-bold">{trend.newPatients}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Bệnh nhân cũ</div>
                          <div className="text-xl font-bold">{trend.returningPatients}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Tổng lượt khám</div>
                          <div className="text-xl font-bold">{trend.totalVisits}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Tuổi trung bình</div>
                          <div className="text-xl font-bold">{trend.averageAge}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Bệnh phổ biến</div>
                        <div className="flex flex-wrap gap-1">
                          {trend.topConditions.map((condition, idx) => (
                            <Badge key={idx} variant="secondary">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Demand Tab */}
        <TabsContent value="demand" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Nhu cầu dịch vụ
              </CardTitle>
              <CardDescription>
                Dự báo nhu cầu các dịch vụ y tế
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceDemand.map((service, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{service.service}</CardTitle>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(service.seasonalTrend)}
                          <Badge className={getTrendColor(service.seasonalTrend)}>
                            {service.seasonalTrend === 'increasing' ? 'Tăng' : 
                             service.seasonalTrend === 'stable' ? 'Ổn định' : 'Giảm'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600">Nhu cầu hiện tại</div>
                          <div className="text-2xl font-bold">{service.currentDemand}/tháng</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Dự báo</div>
                          <div className="text-2xl font-bold text-blue-600">{service.predictedDemand}/tháng</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Tăng trưởng</div>
                          <div className="text-2xl font-bold text-green-600">+{service.growthRate}%</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Giờ cao điểm</div>
                        <div className="flex flex-wrap gap-1">
                          {service.peakHours.map((hour, idx) => (
                            <Badge key={idx} variant="outline">
                              {hour}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Tiến độ tăng trưởng</div>
                        <Progress value={service.growthRate} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Forecast Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Dự báo doanh thu
              </CardTitle>
              <CardDescription>
                Phân tích và dự báo doanh thu phòng khám
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueForecast.map((forecast, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{forecast.month}</CardTitle>
                        <Badge variant="outline">
                          {forecast.confidence}% tin cậy
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600">Doanh thu thực tế</div>
                          <div className="text-xl font-bold">
                            {forecast.actual > 0 ? formatCurrency(forecast.actual) : 'Chưa có dữ liệu'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Dự báo</div>
                          <div className="text-xl font-bold text-blue-600">
                            {formatCurrency(forecast.predicted)}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Độ tin cậy</div>
                        <Progress value={forecast.confidence} className="h-2" />
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Yếu tố ảnh hưởng</div>
                        <div className="flex flex-wrap gap-1">
                          {forecast.factors.map((factor, idx) => (
                            <Badge key={idx} variant="secondary">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capacity Planning Tab */}
        <TabsContent value="capacity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Quy hoạch năng lực
              </CardTitle>
              <CardDescription>
                Phân tích năng lực hiện tại và dự báo nhu cầu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {capacityPlanning.map((resource, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{resource.resource}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600">Năng lực hiện tại</div>
                          <div className="text-2xl font-bold">{resource.currentCapacity}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Mức sử dụng</div>
                          <div className="text-2xl font-bold">{resource.utilization}%</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Nhu cầu dự báo</div>
                          <div className="text-2xl font-bold text-blue-600">{resource.predictedNeed}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Mức sử dụng</div>
                        <Progress value={resource.utilization} className="h-2" />
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Khuyến nghị</div>
                        <ul className="space-y-1">
                          {resource.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveAnalytics;
