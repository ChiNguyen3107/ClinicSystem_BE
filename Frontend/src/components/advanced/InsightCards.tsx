import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Activity,
  Target,
  Zap,
  Brain,
  Shield,
  DollarSign,
  Calendar,
  FileText,
  Download,
  RefreshCw,
  Eye,
  Filter
} from 'lucide-react';

interface AnalyticsInsight {
  id: string;
  title: string;
  type: 'prediction' | 'trend' | 'anomaly' | 'recommendation' | 'performance';
  confidence: number;
  value: number | string;
  unit?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'stable';
  description: string;
  category: 'patient' | 'revenue' | 'efficiency' | 'quality' | 'risk';
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  timestamp: Date;
}

interface PredictiveModel {
  id: string;
  name: string;
  accuracy: number;
  lastTrained: Date;
  predictions: number;
  status: 'active' | 'training' | 'error';
}

const InsightCards: React.FC = () => {
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [models, setModels] = useState<PredictiveModel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Mock insights data
    const mockInsights: AnalyticsInsight[] = [
      {
        id: '1',
        title: 'Tăng 15% bệnh nhân mắc tiểu đường',
        type: 'trend',
        confidence: 0.87,
        value: 15,
        unit: '%',
        change: 15,
        changeType: 'increase',
        description: 'Dự đoán số lượng bệnh nhân tiểu đường sẽ tăng 15% trong quý tới dựa trên dữ liệu lịch sử',
        category: 'patient',
        priority: 'high',
        actionable: true,
        timestamp: new Date()
      },
      {
        id: '2',
        title: 'Giảm 8% doanh thu khám ngoại trú',
        type: 'anomaly',
        confidence: 0.92,
        value: -8,
        unit: '%',
        change: -8,
        changeType: 'decrease',
        description: 'Phát hiện xu hướng giảm doanh thu khám ngoại trú so với cùng kỳ năm trước',
        category: 'revenue',
        priority: 'high',
        actionable: true,
        timestamp: new Date()
      },
      {
        id: '3',
        title: 'Tối ưu hóa lịch khám',
        type: 'recommendation',
        confidence: 0.78,
        value: 23,
        unit: 'phút',
        change: 23,
        changeType: 'increase',
        description: 'Có thể tiết kiệm 23 phút/ngày bằng cách tối ưu hóa lịch khám',
        category: 'efficiency',
        priority: 'medium',
        actionable: true,
        timestamp: new Date()
      },
      {
        id: '4',
        title: 'Tỷ lệ hài lòng bệnh nhân 94%',
        type: 'performance',
        confidence: 0.95,
        value: 94,
        unit: '%',
        change: 2,
        changeType: 'increase',
        description: 'Tỷ lệ hài lòng bệnh nhân tăng 2% so với tháng trước',
        category: 'quality',
        priority: 'low',
        actionable: false,
        timestamp: new Date()
      },
      {
        id: '5',
        title: 'Nguy cơ quá tải phòng khám',
        type: 'prediction',
        confidence: 0.83,
        value: 85,
        unit: '%',
        change: 10,
        changeType: 'increase',
        description: 'Dự đoán 85% khả năng quá tải phòng khám vào cuối tuần',
        category: 'risk',
        priority: 'high',
        actionable: true,
        timestamp: new Date()
      },
      {
        id: '6',
        title: 'Hiệu quả sử dụng thuốc tăng',
        type: 'trend',
        confidence: 0.76,
        value: 12,
        unit: '%',
        change: 12,
        changeType: 'increase',
        description: 'Hiệu quả sử dụng thuốc tăng 12% nhờ AI gợi ý',
        category: 'quality',
        priority: 'medium',
        actionable: false,
        timestamp: new Date()
      }
    ];

    const mockModels: PredictiveModel[] = [
      {
        id: '1',
        name: 'Mô hình dự đoán bệnh tim',
        accuracy: 0.89,
        lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        predictions: 1247,
        status: 'active'
      },
      {
        id: '2',
        name: 'Mô hình tối ưu lịch khám',
        accuracy: 0.82,
        lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        predictions: 892,
        status: 'active'
      },
      {
        id: '3',
        name: 'Mô hình dự đoán doanh thu',
        accuracy: 0.91,
        lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        predictions: 156,
        status: 'training'
      }
    ];

    setInsights(mockInsights);
    setModels(mockModels);
  }, []);

  const getCategoryIcon = (category: string) => {
    const icons = {
      patient: Users,
      revenue: DollarSign,
      efficiency: Target,
      quality: Shield,
      risk: AlertTriangle
    };
    return icons[category as keyof typeof icons] || Activity;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      patient: 'text-blue-500',
      revenue: 'text-green-500',
      efficiency: 'text-purple-500',
      quality: 'text-orange-500',
      risk: 'text-red-500'
    };
    return colors[category as keyof typeof colors] || 'text-gray-500';
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: { variant: 'destructive' as const, label: 'Cao' },
      medium: { variant: 'secondary' as const, label: 'Trung bình' },
      low: { variant: 'outline' as const, label: 'Thấp' }
    };
    return variants[priority as keyof typeof variants];
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      prediction: Brain,
      trend: TrendingUp,
      anomaly: AlertTriangle,
      recommendation: Target,
      performance: BarChart3
    };
    return icons[type as keyof typeof icons] || Activity;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const filteredInsights = insights.filter(insight => 
    selectedCategory === 'all' || insight.category === selectedCategory
  );

  const highPriorityInsights = insights.filter(i => i.priority === 'high').length;
  const actionableInsights = insights.filter(i => i.actionable).length;
  const avgConfidence = insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng insights</p>
                <p className="text-2xl font-bold">{insights.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ưu tiên cao</p>
                <p className="text-2xl font-bold text-red-500">{highPriorityInsights}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Có thể hành động</p>
                <p className="text-2xl font-bold text-green-500">{actionableInsights}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Độ tin cậy TB</p>
                <p className="text-2xl font-bold">{Math.round(avgConfidence * 100)}%</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Models */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Mô hình dự đoán
          </CardTitle>
          <CardDescription>
            Các mô hình AI đang hoạt động và hiệu suất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {models.map((model) => (
              <Card key={model.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{model.name}</h4>
                    <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                      {model.status === 'active' ? 'Hoạt động' : 'Đang huấn luyện'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Độ chính xác:</span>
                      <span className="font-medium">{Math.round(model.accuracy * 100)}%</span>
                    </div>
                    <Progress value={model.accuracy * 100} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Dự đoán:</span>
                      <span>{model.predictions}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Cập nhật:</span>
                      <span>{Math.floor((Date.now() - model.lastTrained.getTime()) / (24 * 60 * 60 * 1000))} ngày trước</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Insights & Dự đoán
              </CardTitle>
              <CardDescription>
                Phân tích thông minh và gợi ý hành động
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Category Filter */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Tất cả
            </Button>
            <Button
              variant={selectedCategory === 'patient' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('patient')}
            >
              Bệnh nhân
            </Button>
            <Button
              variant={selectedCategory === 'revenue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('revenue')}
            >
              Doanh thu
            </Button>
            <Button
              variant={selectedCategory === 'efficiency' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('efficiency')}
            >
              Hiệu quả
            </Button>
            <Button
              variant={selectedCategory === 'quality' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('quality')}
            >
              Chất lượng
            </Button>
            <Button
              variant={selectedCategory === 'risk' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('risk')}
            >
              Rủi ro
            </Button>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInsights.map((insight) => {
              const CategoryIcon = getCategoryIcon(insight.category);
              const TypeIcon = getTypeIcon(insight.type);
              const priorityConfig = getPriorityBadge(insight.priority);

              return (
                <Card key={insight.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className={`h-4 w-4 ${getCategoryColor(insight.category)}`} />
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex gap-1">
                        <Badge variant={priorityConfig.variant} className="text-xs">
                          {priorityConfig.label}
                        </Badge>
                        {insight.actionable && (
                          <Badge variant="outline" className="text-xs">
                            Hành động
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-sm">{insight.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Value Display */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">
                          {typeof insight.value === 'number' ? insight.value : insight.value}
                        </span>
                        {insight.unit && (
                          <span className="text-sm text-muted-foreground">{insight.unit}</span>
                        )}
                        {insight.change && (
                          <div className="flex items-center gap-1">
                            {insight.changeType === 'increase' ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : insight.changeType === 'decrease' ? (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            ) : (
                              <Activity className="h-3 w-3 text-gray-500" />
                            )}
                            <span className={`text-xs ${
                              insight.changeType === 'increase' ? 'text-green-500' :
                              insight.changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'
                            }`}>
                              {insight.change > 0 ? '+' : ''}{insight.change}{insight.unit}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground">{insight.description}</p>

                      {/* Confidence */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Độ tin cậy</span>
                          <span>{Math.round(insight.confidence * 100)}%</span>
                        </div>
                        <Progress value={insight.confidence * 100} className="h-1" />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Chi tiết
                        </Button>
                        {insight.actionable && (
                          <Button variant="default" size="sm" className="flex-1">
                            <Target className="h-3 w-3 mr-1" />
                            Hành động
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Báo cáo tùy chỉnh
          </CardTitle>
          <CardDescription>
            Tạo và quản lý báo cáo phân tích
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-dashed border-2 hover:border-blue-500 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium mb-1">Báo cáo doanh thu</h4>
                <p className="text-sm text-muted-foreground">Phân tích doanh thu theo thời gian</p>
              </CardContent>
            </Card>

            <Card className="border-dashed border-2 hover:border-green-500 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium mb-1">Báo cáo bệnh nhân</h4>
                <p className="text-sm text-muted-foreground">Thống kê và xu hướng bệnh nhân</p>
              </CardContent>
            </Card>

            <Card className="border-dashed border-2 hover:border-purple-500 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-1">Báo cáo hiệu quả</h4>
                <p className="text-sm text-muted-foreground">Đo lường hiệu quả hoạt động</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { InsightCards };
