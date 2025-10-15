import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, MoreHorizontal } from 'lucide-react';

export const Patients: React.FC = () => {
  // Mock data - replace with real data from API
  const patients = [
    {
      id: 1,
      code: 'BN001',
      fullName: 'Nguyễn Văn A',
      gender: 'MALE',
      dateOfBirth: '1990-01-15',
      phone: '0123456789',
      email: 'nguyenvana@email.com',
      address: '123 Đường ABC, Quận 1, TP.HCM',
    },
    {
      id: 2,
      code: 'BN002',
      fullName: 'Trần Thị B',
      gender: 'FEMALE',
      dateOfBirth: '1985-05-20',
      phone: '0987654321',
      email: 'tranthib@email.com',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
    },
    {
      id: 3,
      code: 'BN003',
      fullName: 'Lê Văn C',
      gender: 'MALE',
      dateOfBirth: '1992-12-10',
      phone: '0369852147',
      email: 'levanc@email.com',
      address: '789 Đường DEF, Quận 3, TP.HCM',
    },
  ];

  const getGenderLabel = (gender: string) => {
    const genderMap = {
      MALE: 'Nam',
      FEMALE: 'Nữ',
      OTHER: 'Khác',
    };
    return genderMap[gender as keyof typeof genderMap] || gender;
  };

  const getGenderBadge = (gender: string) => {
    const colorMap = {
      MALE: 'bg-blue-100 text-blue-800',
      FEMALE: 'bg-pink-100 text-pink-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colorMap[gender as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý bệnh nhân</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin bệnh nhân và lịch sử khám bệnh
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm bệnh nhân
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm và lọc</CardTitle>
          <CardDescription>
            Tìm kiếm bệnh nhân theo tên, mã số, hoặc số điện thoại
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bệnh nhân..."
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

      {/* Patients List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bệnh nhân</CardTitle>
          <CardDescription>
            Tổng cộng {patients.length} bệnh nhân
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {patient.fullName.split(' ').pop()?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{patient.fullName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Mã: {patient.code} • {patient.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {patient.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getGenderBadge(patient.gender)}>
                    {getGenderLabel(patient.gender)}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
