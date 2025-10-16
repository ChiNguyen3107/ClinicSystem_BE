import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Edit,
  Trash2
} from 'lucide-react';
import { BookingRequest } from '@/types/public';
import { getBooking, updateBooking, cancelBooking } from '@/api/services/public.service';
import { formatCurrency } from '@/utils/currency';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';

export const BookingStatus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (id) {
      loadBooking();
    }
  }, [id]);

  const loadBooking = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const bookingData = await getBooking(id);
      setBooking(bookingData);
    } catch (error) {
      console.error('Error loading booking:', error);
      toast.error('Có lỗi xảy ra khi tải thông tin đặt lịch');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!id || !cancelReason.trim()) return;

    try {
      setIsUpdating(true);
      await cancelBooking(id, cancelReason);
      await loadBooking(); // Reload booking data
      setShowCancelDialog(false);
      setCancelReason('');
      toast.success('Hủy đặt lịch thành công');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Có lỗi xảy ra khi hủy đặt lịch');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReschedule = () => {
    if (booking?.doctorId) {
      navigate(`/public/booking?doctor=${booking.doctorId}&reschedule=${id}`);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          text: 'Chờ xác nhận',
          description: 'Yêu cầu đặt lịch đang chờ xác nhận từ phòng khám'
        };
      case 'CONFIRMED':
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Đã xác nhận',
          description: 'Lịch hẹn đã được xác nhận. Vui lòng đến đúng giờ hẹn'
        };
      case 'CANCELLED':
        return {
          icon: <XCircle className="h-5 w-5" />,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          text: 'Đã hủy',
          description: 'Lịch hẹn đã bị hủy'
        };
      case 'COMPLETED':
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          text: 'Hoàn thành',
          description: 'Lịch hẹn đã hoàn thành'
        };
      case 'NO_SHOW':
        return {
          icon: <XCircle className="h-5 w-5" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          text: 'Không đến',
          description: 'Bệnh nhân không đến khám'
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          text: 'Không xác định',
          description: 'Trạng thái không xác định'
        };
    }
  };

  const getPaymentStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { text: 'Chưa thanh toán', variant: 'secondary' as const };
      case 'PAID':
        return { text: 'Đã thanh toán', variant: 'default' as const };
      case 'FAILED':
        return { text: 'Thanh toán thất bại', variant: 'destructive' as const };
      case 'REFUNDED':
        return { text: 'Đã hoàn tiền', variant: 'outline' as const };
      default:
        return { text: 'Không xác định', variant: 'secondary' as const };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy lịch hẹn</h2>
          <p className="text-muted-foreground mb-4">Lịch hẹn này có thể không tồn tại hoặc đã bị xóa</p>
          <Button onClick={() => navigate('/public')}>
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(booking.status);
  const paymentStatusInfo = getPaymentStatusInfo(booking.paymentStatus);

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
              <h1 className="text-2xl font-bold">Trạng thái đặt lịch</h1>
              <p className="text-muted-foreground">Mã đặt lịch: {booking.id}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${statusInfo.bgColor}`}>
                    <div className={statusInfo.color}>
                      {statusInfo.icon}
                    </div>
                  </div>
                  Trạng thái lịch hẹn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Trạng thái:</span>
                    <Badge variant="outline" className={statusInfo.color}>
                      {statusInfo.text}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {statusInfo.description}
                  </p>
                  
                  {booking.status === 'PENDING' && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Lịch hẹn đang chờ xác nhận. Chúng tôi sẽ liên hệ lại trong vòng 24 giờ.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Appointment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Thông tin lịch hẹn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày khám</p>
                        <p className="font-medium">
                          {format(new Date(booking.appointmentDate), 'dd/MM/yyyy', { locale: vi })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Giờ khám</p>
                        <p className="font-medium">{booking.appointmentTime}</p>
                      </div>
                    </div>
                  </div>

                  {booking.doctor && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bác sĩ</p>
                        <p className="font-medium">{booking.doctor.fullName}</p>
                        <p className="text-sm text-muted-foreground">{booking.doctor.specialty}</p>
                      </div>
                    </div>
                  )}

                  {booking.service && (
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 text-muted-foreground">🩺</div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dịch vụ</p>
                        <p className="font-medium">{booking.service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(booking.service.price)}
                        </p>
                      </div>
                    </div>
                  )}

                  {booking.symptoms && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Triệu chứng</p>
                      <p className="text-sm">{booking.symptoms}</p>
                    </div>
                  )}

                  {booking.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                      <p className="text-sm">{booking.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin bệnh nhân
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{booking.patientName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.patientPhone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.patientEmail}</span>
                  </div>
                  {booking.patientDob && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(booking.patientDob), 'dd/MM/yyyy', { locale: vi })}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
              <Card>
                <CardHeader>
                  <CardTitle>Thao tác</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {booking.status === 'PENDING' && (
                      <Button variant="outline" onClick={handleReschedule}>
                        <Edit className="h-4 w-4 mr-2" />
                        Đổi lịch
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      onClick={() => setShowCancelDialog(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hủy lịch
                    </Button>
                    <Button variant="outline" onClick={loadBooking}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Làm mới
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Trạng thái:</span>
                    <Badge variant={paymentStatusInfo.variant}>
                      {paymentStatusInfo.text}
                    </Badge>
                  </div>
                  {booking.totalAmount && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Số tiền:</span>
                      <span className="font-medium">{formatCurrency(booking.totalAmount)}</span>
                    </div>
                  )}
                  {booking.paymentMethod && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Phương thức:</span>
                      <span className="text-sm">{booking.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Liên hệ hỗ trợ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">0123 456 789</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">support@phongkham.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">123 Đường ABC, Quận 1, TP.HCM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Thao tác nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Gọi hotline
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi email
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/public')}>
                  Đặt lịch mới
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Hủy lịch hẹn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Lý do hủy lịch</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Nhập lý do hủy lịch..."
                  className="w-full mt-1 p-2 border rounded-md"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleCancelBooking}
                  disabled={!cancelReason.trim() || isUpdating}
                  className="flex-1"
                >
                  {isUpdating ? 'Đang xử lý...' : 'Xác nhận hủy'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
