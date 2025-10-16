import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Shield,
  Activity,
  MapPin,
  Calendar,
  FileText,
  Lightbulb,
  CheckCircle,
  Info
} from 'lucide-react';

interface CommunityHealth {
  region: string;
  population: number;
  healthScore: number;
  topDiseases: string[];
  vaccinationRate: number;
  lifeExpectancy: number;
  healthTrends: 'improving' | 'stable' | 'declining';
}

interface DiseaseTrend {
  disease: string;
  currentCases: number;
  previousCases: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  severity: 'low' | 'medium' | 'high';
  affectedAgeGroups: string[];
  seasonalPattern: boolean;
}

interface PreventionTip {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  targetAudience: string[];
  effectiveness: number;
}

interface HealthRecommendation {
  id: string;
  type: 'vaccination' | 'screening' | 'lifestyle' | 'environmental';
  title: string;
  description: string;
  urgency: 'immediate' | 'soon' | 'planned';
  targetPopulation: string;
  expectedImpact: number;
}

const HealthInsights: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [communityHealth] = useState<CommunityHealth[]>([
    {
      region: 'Quận 1',
      population: 150000,
      healthScore: 85,
      topDiseases: ['Cảm cúm', 'Dị ứng', 'Đau đầu'],
      vaccinationRate: 78,
      lifeExpectancy: 76,
      healthTrends: 'improving'
    },
    {
      region: 'Quận 2',
      population: 200000,
      healthScore: 82,
      topDiseases: ['Viêm họng', 'Cảm cúm', 'Đau bụng'],
      vaccinationRate: 75,
      lifeExpectancy: 74,
      healthTrends: 'stable'
    },
    {
      region: 'Quận 3',
      population: 180000,
      healthScore: 88,
      topDiseases: ['Dị ứng', 'Viêm họng', 'Sốt'],
      vaccinationRate: 82,
      lifeExpectancy: 77,
      healthTrends: 'improving'
    }
  ]);

  const [diseaseTrends] = useState<DiseaseTrend[]>([
    {
      disease: 'Cảm cúm',
      currentCases: 245,
      previousCases: 180,
      trend: 'increasing',
      severity: 'medium',
      affectedAgeGroups: ['Trẻ em', 'Người già'],
      seasonalPattern: true
    },
    {
      disease: 'Dị ứng',
      currentCases: 156,
      previousCases: 145,
      trend: 'increasing',
      severity: 'low',
      affectedAgeGroups: ['Trẻ em', 'Thanh niên'],
      seasonalPattern: true
    },
    {
      disease: 'Viêm họng',
      currentCases: 89,
      previousCases: 95,
      trend: 'decreasing',
      severity: 'low',
      affectedAgeGroups: ['Trẻ em', 'Thanh niên'],
      seasonalPattern: false
    }
  ]);

  const [preventionTips] = useState<PreventionTip[]>([
    {
      id: '1',
      category: 'Vệ sinh',
      title: 'Rửa tay thường xuyên',
      description: 'Rửa tay bằng xà phòng trong ít nhất 20 giây, đặc biệt sau khi ho, hắt hơi hoặc chạm vào các bề mặt công cộng.',
      priority: 'high',
      targetAudience: ['Mọi lứa tuổi'],
      effectiveness: 95
    },
    {
      id: '2',
      category: 'Dinh dưỡng',
      title: 'Ăn uống cân bằng',
      description: 'Tăng cường rau xanh, trái cây, uống đủ nước và hạn chế đồ ăn nhanh để tăng cường hệ miễn dịch.',
      priority: 'high',
      targetAudience: ['Mọi lứa tuổi'],
      effectiveness: 85
    },
    {
      id: '3',
      category: 'Vận động',
      title: 'Tập thể dục đều đặn',
      description: 'Ít nhất 30 phút vận động vừa phải mỗi ngày để tăng cường sức khỏe tim mạch và hệ miễn dịch.',
      priority: 'medium',
      targetAudience: ['Người trưởng thành'],
      effectiveness: 80
    }
  ]);

  const [healthRecommendations] = useState<HealthRecommendation[]>([
    {
      id: '1',
      type: 'vaccination',
      title: 'Tiêm phòng cúm mùa',
      description: 'Khuyến khích tiêm phòng cúm cho tất cả nhóm tuổi, đặc biệt người già và trẻ em.',
      urgency: 'immediate',
      targetPopulation: 'Toàn dân',
      expectedImpact: 90
    },
    {
      id: '2',
      type: 'screening',
      title: 'Tầm soát ung thư định kỳ',
      description: 'Thực hiện tầm soát ung thư vú, cổ tử cung và đại trực tràng cho nhóm tuổi có nguy cơ.',
      urgency: 'soon',
      targetPopulation: 'Người trên 40 tuổi',
      expectedImpact: 75
    },
    {
      id: '3',
      type: 'lifestyle',
      title: 'Chương trình giảm cân cộng đồng',
      description: 'Tổ chức các hoạt động thể thao và tư vấn dinh dưỡng cho cộng đồng.',
      urgency: 'planned',
      targetPopulation: 'Người thừa cân',
      expectedImpact: 60
    }
  ]);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-600';
      case 'stable': return 'text-blue-600';
      case 'decreasing': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'decreasing': return <TrendingUp className="h-4 w-4 text-green-600 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'bg-red-100 text-red-800 border-red-200';
      case 'soon': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="community" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="community">Sức khỏe cộng đồng</TabsTrigger>
          <TabsTrigger value="diseases">Xu hướng bệnh tật</TabsTrigger>
          <TabsTrigger value="prevention">Phòng ngừa</TabsTrigger>
          <TabsTrigger value="recommendations">Khuyến nghị</TabsTrigger>
        </TabsList>

        {/* Community Health Tab */}
        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Sức khỏe cộng đồng
              </CardTitle>
              <CardDescription>
                Phân tích tình hình sức khỏe theo khu vực địa lý
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communityHealth.map((community, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {community.region}
                        </CardTitle>
                        <Badge variant="outline">
                          {community.population.toLocaleString()} dân
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600">Điểm sức khỏe</div>
                          <div className="text-2xl font-bold text-blue-600">{community.healthScore}/100</div>
                          <Progress value={community.healthScore} className="h-2 mt-1" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Tỷ lệ tiêm chủng</div>
                          <div className="text-2xl font-bold text-green-600">{community.vaccinationRate}%</div>
                          <Progress value={community.vaccinationRate} className="h-2 mt-1" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Tuổi thọ trung bình</div>
                          <div className="text-2xl font-bold text-purple-600">{community.lifeExpectancy} tuổi</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Xu hướng</div>
                          <div className="flex items-center gap-1">
                            {community.healthTrends === 'improving' ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : community.healthTrends === 'stable' ? (
                              <Activity className="h-4 w-4 text-blue-600" />
                            ) : (
                              <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                            )}
                            <span className={getTrendColor(community.healthTrends)}>
                              {community.healthTrends === 'improving' ? 'Cải thiện' : 
                               community.healthTrends === 'stable' ? 'Ổn định' : 'Giảm sút'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Bệnh phổ biến</div>
                        <div className="flex flex-wrap gap-1">
                          {community.topDiseases.map((disease, idx) => (
                            <Badge key={idx} variant="secondary">
                              {disease}
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

        {/* Disease Trends Tab */}
        <TabsContent value="diseases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                Xu hướng bệnh tật
              </CardTitle>
              <CardDescription>
                Theo dõi và phân tích xu hướng các bệnh trong cộng đồng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {diseaseTrends.map((disease, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{disease.disease}</CardTitle>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(disease.trend)}
                          <Badge className={getSeverityColor(disease.severity)}>
                            {disease.severity === 'high' ? 'Cao' : 
                             disease.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600">Số ca hiện tại</div>
                          <div className="text-2xl font-bold">{disease.currentCases}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Số ca trước đó</div>
                          <div className="text-2xl font-bold">{disease.previousCases}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Thay đổi</div>
                          <div className={`text-2xl font-bold ${getTrendColor(disease.trend)}`}>
                            {disease.currentCases > disease.previousCases ? '+' : ''}
                            {((disease.currentCases - disease.previousCases) / disease.previousCases * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Nhóm tuổi bị ảnh hưởng</div>
                        <div className="flex flex-wrap gap-1">
                          {disease.affectedAgeGroups.map((age, idx) => (
                            <Badge key={idx} variant="outline">
                              {age}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {disease.seasonalPattern ? 'Có tính chất theo mùa' : 'Không theo mùa'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prevention Tips Tab */}
        <TabsContent value="prevention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Mẹo phòng ngừa
              </CardTitle>
              <CardDescription>
                Các biện pháp phòng ngừa bệnh tật hiệu quả
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {preventionTips.map((tip) => (
                  <Card key={tip.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{tip.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(tip.priority)}>
                            {tip.priority === 'high' ? 'Cao' : 
                             tip.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                          </Badge>
                          <Badge variant="outline">
                            {tip.effectiveness}% hiệu quả
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Mô tả</div>
                        <p className="text-sm">{tip.description}</p>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-2">Đối tượng</div>
                        <div className="flex flex-wrap gap-1">
                          {tip.targetAudience.map((audience, idx) => (
                            <Badge key={idx} variant="secondary">
                              {audience}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-2">Mức độ hiệu quả</div>
                        <Progress value={tip.effectiveness} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Khuyến nghị sức khỏe
              </CardTitle>
              <CardDescription>
                Các khuyến nghị dựa trên phân tích dữ liệu sức khỏe cộng đồng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthRecommendations.map((recommendation) => (
                  <Card key={recommendation.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getUrgencyColor(recommendation.urgency)}>
                            {recommendation.urgency === 'immediate' ? 'Ngay lập tức' : 
                             recommendation.urgency === 'soon' ? 'Sớm' : 'Kế hoạch'}
                          </Badge>
                          <Badge variant="outline">
                            {recommendation.expectedImpact}% tác động
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Mô tả</div>
                        <p className="text-sm">{recommendation.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600">Đối tượng</div>
                          <div className="text-sm">{recommendation.targetPopulation}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Tác động dự kiến</div>
                          <div className="text-sm">{recommendation.expectedImpact}%</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-2">Tác động dự kiến</div>
                        <Progress value={recommendation.expectedImpact} className="h-2" />
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

export default HealthInsights;
