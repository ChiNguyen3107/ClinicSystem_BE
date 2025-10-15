import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, User, Star, Calendar } from 'lucide-react';

export const Doctors: React.FC = () => {
  // Mock data - replace with real data from API
  const doctors = [
    {
      id: 1,
      fullName: 'BS. Trần Thị B',
      specialty: 'Tim mạch',
      licenseNumber: 'BS001',
      examinationRoom: 'Phòng 101',
      biography: 'Chuyên gia tim mạch với 15 năm kinh nghiệm',
      rating: 4.8,
      totalPatients: 1250,
      isActive: true,
    },
    {
      id: 2,
      fullName: 'BS. Phạm Văn D',
      specialty: 'Nội khoa',
      licenseNumber: 'BS002',
      examinationRoom: 'Phòng 102',
      biography: 'Bác sĩ nội khoa chuyên điều trị các bệnh lý nội tạng',
      rating: 4.6,
      totalPatients: 980,
      isActive: true,
    },
    {
      id: 3,
      fullName: 'BS. Nguyễn Thị F',
      specialty: 'Ngoại khoa',
      licenseNumber: 'BS003',
      examinationRoom: 'Phòng 103',
      biography: 'Bác sĩ ngoại khoa chuyên phẫu thuật',
      rating: 4.9,
      totalPatients: 750,
      isActive: false,
    },
  ];

  const getActiveBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
    ) : (
      <Badge variant="secondary">Tạm nghỉ</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý bác sĩ</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin bác sĩ và lịch làm việc
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm bác sĩ
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm và lọc</CardTitle>
          <CardDescription>
            Tìm kiếm bác sĩ theo tên, chuyên khoa, hoặc phòng khám
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bác sĩ..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{doctor.fullName}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                  </div>
                </div>
                {getActiveBadge(doctor.isActive)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Số giấy phép:</span>
                  <span className="font-medium">{doctor.licenseNumber}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Phòng khám:</span>
                  <span className="font-medium">{doctor.examinationRoom}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Đánh giá:</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{doctor.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Bệnh nhân:</span>
                  <span className="font-medium">{doctor.totalPatients.toLocaleString()}</span>
                </div>
                
                <p className="text-sm text-muted-foreground mt-3">
                  {doctor.biography}
                </p>
                
                <div className="flex space-x-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="mr-2 h-4 w-4" />
                    Lịch làm việc
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Chỉnh sửa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
