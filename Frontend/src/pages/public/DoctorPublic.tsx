import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  ArrowLeft,
  User,
  Award,
  Languages,
  GraduationCap,
  Stethoscope
} from 'lucide-react';
import { RatingList } from '@/components/public';
import { PublicDoctor, Rating, RatingStats } from '@/types/public';
import { getPublicDoctor, getDoctorRatings, getDoctorRatingStats } from '@/api/services/public.service';
import { formatCurrency } from '@/utils/currency';
import { toast } from 'sonner';

export const DoctorPublic: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<PublicDoctor | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ratingsPage, setRatingsPage] = useState(0);
  const [hasMoreRatings, setHasMoreRatings] = useState(false);

  useEffect(() => {
    if (id) {
      loadDoctorData();
    }
  }, [id]);

  const loadDoctorData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const [doctorData, ratingsData, statsData] = await Promise.all([
        getPublicDoctor(id),
        getDoctorRatings(id, { page: 0, size: 10 }),
        getDoctorRatingStats(id)
      ]);

      setDoctor(doctorData);
      setRatings(ratingsData.content);
      setRatingStats(statsData);
      setHasMoreRatings(ratingsData.totalPages > 1);
    } catch (error) {
      console.error('Error loading doctor data:', error);
      toast.error('Có lỗi xảy ra khi tải thông tin bác sĩ');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreRatings = async () => {
    if (!id || !hasMoreRatings) return;

    try {
      const nextPage = ratingsPage + 1;
      const ratingsData = await getDoctorRatings(id, { page: nextPage, size: 10 });
      
      setRatings(prev => [...prev, ...ratingsData.content]);
      setRatingsPage(nextPage);
      setHasMoreRatings(ratingsData.totalPages > nextPage + 1);
    } catch (error) {
      console.error('Error loading more ratings:', error);
      toast.error('Có lỗi xảy ra khi tải thêm đánh giá');
    }
  };

  const handleBookAppointment = () => {
    navigate(`/public/booking?doctor=${id}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[dayOfWeek];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy bác sĩ</h2>
          <p className="text-muted-foreground mb-4">Bác sĩ này có thể không tồn tại hoặc đã bị xóa</p>
          <Button onClick={() => navigate('/public')}>
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/public')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Thông tin bác sĩ</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={doctor.avatar} alt={doctor.fullName} />
                    <AvatarFallback className="text-lg">
                      {getInitials(doctor.fullName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{doctor.fullName}</h2>
                        <p className="text-lg text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{doctor.rating.toFixed(1)}</span>
                            <span className="text-sm text-muted-foreground">({doctor.totalReviews} đánh giá)</span>
                          </div>
                          <Badge variant="secondary">
                            {doctor.experience} năm kinh nghiệm
                          </Badge>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(doctor.consultationFee)}
                        </div>
                        <p className="text-sm text-muted-foreground">Phí khám</p>
                      </div>
                    </div>

                    {doctor.bio && (
                      <p className="text-muted-foreground mb-4">{doctor.bio}</p>
                    )}

                    <div className="flex gap-3">
                      <Button onClick={handleBookAppointment} disabled={!doctor.isAvailable}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Đặt lịch khám
                      </Button>
                      <Button variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Liên hệ
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="schedule" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="schedule">Lịch làm việc</TabsTrigger>
                <TabsTrigger value="education">Học vấn & Kinh nghiệm</TabsTrigger>
                <TabsTrigger value="ratings">Đánh giá</TabsTrigger>
              </TabsList>

              <TabsContent value="schedule" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Lịch làm việc
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {doctor.schedule.map((schedule, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{getDayName(schedule.dayOfWeek)}</p>
                              <p className="text-sm text-muted-foreground">
                                {schedule.startTime} - {schedule.endTime}
                              </p>
                            </div>
                          </div>
                          <Badge variant={schedule.isAvailable ? "default" : "secondary"}>
                            {schedule.isAvailable ? "Có thể đặt lịch" : "Không khả dụng"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Học vấn & Kinh nghiệm
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {doctor.education && (
                      <div>
                        <h4 className="font-medium mb-2">Học vấn</h4>
                        <p className="text-muted-foreground">{doctor.education}</p>
                      </div>
                    )}

                    {doctor.certifications && doctor.certifications.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Chứng chỉ</h4>
                        <div className="flex flex-wrap gap-2">
                          {doctor.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {doctor.languages && doctor.languages.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Ngôn ngữ</h4>
                        <div className="flex flex-wrap gap-2">
                          {doctor.languages.map((language, index) => (
                            <Badge key={index} variant="secondary">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ratings">
                {ratingStats && (
                  <RatingList
                    ratings={ratings}
                    stats={ratingStats}
                    onLoadMore={loadMoreRatings}
                    hasMore={hasMoreRatings}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Thao tác nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleBookAppointment} className="w-full" disabled={!doctor.isAvailable}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Đặt lịch khám
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Gọi điện
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi email
                </Button>
              </CardContent>
            </Card>

            {/* Doctor Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Đánh giá trung bình</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{doctor.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tổng đánh giá</span>
                    <span className="font-medium">{doctor.totalReviews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Kinh nghiệm</span>
                    <span className="font-medium">{doctor.experience} năm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Trạng thái</span>
                    <Badge variant={doctor.isAvailable ? "default" : "secondary"}>
                      {doctor.isAvailable ? "Có thể đặt lịch" : "Không khả dụng"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">0123 456 789</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">doctor@phongkham.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Phòng 201, Tầng 2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
