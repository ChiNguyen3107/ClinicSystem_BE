import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, ArrowLeft, Calendar, Clock, User, Phone, Mail } from 'lucide-react';
import { BookingForm } from '@/components/public';
import { PublicDoctor, PublicService, CreateBookingRequest } from '@/types/public';
import { getPublicDoctors, getPublicServices, createBooking } from '@/api/services/public.service';
import { toast } from 'sonner';

export const Booking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<PublicDoctor[]>([]);
  const [services, setServices] = useState<PublicService[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<PublicDoctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

  const selectedDoctorId = searchParams.get('doctor');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [doctorsData, servicesData] = await Promise.all([
          getPublicDoctors({ available: true }),
          getPublicServices({ available: true })
        ]);
        
        setDoctors(doctorsData.content);
        setServices(servicesData.content);

        // Auto-select doctor if specified in URL
        if (selectedDoctorId) {
          const doctor = doctorsData.content.find(d => d.id === selectedDoctorId);
          if (doctor) {
            setSelectedDoctor(doctor);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedDoctorId]);

  const handleDoctorSelect = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doctor || null);
  };

  const handleBookingSubmit = async (data: CreateBookingRequest) => {
    try {
      setIsSubmitting(true);
      const booking = await createBooking(data);
      setBookingId(booking.id);
      setBookingSuccess(true);
      toast.success('Đặt lịch thành công!');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Có lỗi xảy ra khi đặt lịch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewBookingStatus = () => {
    if (bookingId) {
      navigate(`/public/booking/${bookingId}/status`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Đặt lịch thành công!
              </h2>
              <p className="text-muted-foreground mb-6">
                Chúng tôi đã nhận được yêu cầu đặt lịch của bạn. 
                Chúng tôi sẽ liên hệ lại để xác nhận lịch hẹn.
              </p>
              <div className="space-y-3">
                <Button onClick={handleViewBookingStatus} className="w-full">
                  Xem trạng thái đặt lịch
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/public')}
                  className="w-full"
                >
                  Về trang chủ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
              <h1 className="text-2xl font-bold">Đặt lịch khám bệnh</h1>
              <p className="text-muted-foreground">Điền thông tin để đặt lịch khám</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm
              doctors={doctors}
              services={services}
              selectedDoctor={selectedDoctor}
              onDoctorSelect={handleDoctorSelect}
              onSubmit={handleBookingSubmit}
              isLoading={isSubmitting}
            />
          </div>

          {/* Booking Info */}
          <div className="space-y-6">
            {/* Selected Doctor Info */}
            {selectedDoctor && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Bác sĩ đã chọn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{selectedDoctor.fullName}</h4>
                      <p className="text-sm text-muted-foreground">{selectedDoctor.specialty}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {selectedDoctor.experience} năm kinh nghiệm
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {selectedDoctor.rating.toFixed(1)} ⭐
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Booking Process */}
            <Card>
              <CardHeader>
                <CardTitle>Quy trình đặt lịch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">1</span>
                    </div>
                    <span className="text-sm">Chọn bác sĩ và dịch vụ</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">2</span>
                    </div>
                    <span className="text-sm">Chọn ngày và giờ khám</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">3</span>
                    </div>
                    <span className="text-sm">Điền thông tin cá nhân</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">4</span>
                    </div>
                    <span className="text-sm">Xác nhận đặt lịch</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Lưu ý quan trọng:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Vui lòng đến đúng giờ hẹn</li>
                    <li>Mang theo CMND/CCCD</li>
                    <li>Liên hệ hotline nếu có thay đổi</li>
                    <li>Thanh toán tại phòng khám</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

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
                    <span className="text-sm">info@phongkham.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">8:00 - 20:00 (T2-T6)</span>
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
