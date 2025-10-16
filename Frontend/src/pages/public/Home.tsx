import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Stethoscope, 
  Users, 
  Clock, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Search,
  Filter,
  ArrowRight,
  Shield,
  Heart,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DoctorCard, BookingForm } from '@/components/public';
import { PublicDoctor, PublicService, ClinicInfo } from '@/types/public';
import { getPublicDoctors, getPublicServices, getClinicInfo } from '@/api/services/public.service';

export const Home: React.FC = () => {
  const [doctors, setDoctors] = useState<PublicDoctor[]>([]);
  const [services, setServices] = useState<PublicService[]>([]);
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [doctorsData, servicesData, clinicData] = await Promise.all([
          getPublicDoctors({ available: true, size: 6 }),
          getPublicServices({ available: true, size: 8 }),
          getClinicInfo()
        ]);
        
        setDoctors(doctorsData.content);
        setServices(servicesData.content);
        setClinicInfo(clinicData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctorId: string) => {
    // Navigate to booking page with selected doctor
    window.location.href = `/public/booking?doctor=${doctorId}`;
  };

  const handleViewProfile = (doctorId: string) => {
    // Navigate to doctor profile page
    window.location.href = `/public/doctors/${doctorId}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">
                  {clinicInfo?.name || 'Phòng khám ABC'}
                </h1>
                <p className="text-sm text-muted-foreground">Chăm sóc sức khỏe toàn diện</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline">
                <Link to="/public/booking">Đặt lịch</Link>
              </Button>
              <Button asChild>
                <Link to="/login">Đăng nhập</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Chăm sóc sức khỏe chuyên nghiệp
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại, 
            dịch vụ chăm sóc tận tình
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/public/booking">Đặt lịch ngay</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
              <Link to="#doctors">Xem bác sĩ</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Tại sao chọn chúng tôi?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe tốt nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">An toàn & Tin cậy</h4>
              <p className="text-muted-foreground">
                Tuân thủ nghiêm ngặt các tiêu chuẩn y tế quốc tế
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Chăm sóc tận tình</h4>
              <p className="text-muted-foreground">
                Đội ngũ y bác sĩ giàu kinh nghiệm, tận tâm với bệnh nhân
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Chất lượng cao</h4>
              <p className="text-muted-foreground">
                Trang thiết bị hiện đại, quy trình khám chữa bệnh chuẩn
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Đội ngũ bác sĩ</h3>
            <p className="text-lg text-muted-foreground">
              Các chuyên gia y tế giàu kinh nghiệm
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bác sĩ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-full md:w-64">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Chọn chuyên khoa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả chuyên khoa</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onBookAppointment={handleBookAppointment}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Không tìm thấy bác sĩ phù hợp</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/public/doctors">Xem tất cả bác sĩ</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Dịch vụ y tế</h3>
            <p className="text-lg text-muted-foreground">
              Các dịch vụ khám chữa bệnh chuyên nghiệp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{service.category}</Badge>
                    <span className="font-semibold text-primary">
                      {service.price.toLocaleString()} VNĐ
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-6">Liên hệ với chúng tôi</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5" />
                  <span>{clinicInfo?.address || '123 Đường ABC, Quận 1, TP.HCM'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  <span>{clinicInfo?.phone || '0123 456 789'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5" />
                  <span>{clinicInfo?.email || 'info@phongkham.com'}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-4">Giờ làm việc</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Thứ 2 - Thứ 6:</span>
                  <span>8:00 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Thứ 7:</span>
                  <span>8:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Chủ nhật:</span>
                  <span>8:00 - 12:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Phòng khám ABC. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
};
