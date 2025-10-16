import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  X, 
  Edit, 
  Calendar, 
  FileText, 
  CreditCard,
  User,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import { patientService } from '@/api/services/patient.service';
import { usePatientStore } from '@/store/patient.store';
import { formatDateOfBirth, formatPhoneNumber, formatGender, formatStatus, formatDateTime, calculateAge } from '@/utils/format';
import type { PatientDetail as PatientDetailType } from '@/types/patient';

interface PatientDetailProps {
  patientId: number;
  onEdit?: (patient: any) => void;
  onClose?: () => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({
  patientId,
  onEdit,
  onClose,
}) => {
  const { closeDetail } = usePatientStore();
  const [patient, setPatient] = useState<PatientDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const data = await patientService.getPatientById(patientId);
        setPatient(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải thông tin bệnh nhân');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  const handleClose = () => {
    onClose?.();
    closeDetail();
  };

  const handleEdit = () => {
    if (patient) {
      onEdit?.(patient);
    }
  };

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết bệnh nhân</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !patient) {
    return (
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết bệnh nhân</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">Lỗi</div>
            <div className="text-sm text-gray-500">{error}</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Chi tiết bệnh nhân</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Button variant="outline" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="visits">Lịch khám</TabsTrigger>
            <TabsTrigger value="prescriptions">Đơn thuốc</TabsTrigger>
            <TabsTrigger value="billings">Hóa đơn</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mã bệnh nhân</label>
                    <div className="text-lg font-semibold">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {patient.code}
                      </code>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Họ tên</label>
                    <div className="text-lg font-semibold">{patient.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Giới tính</label>
                    <div className="text-lg">{formatGender(patient.gender)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ngày sinh</label>
                    <div className="text-lg">
                      {formatDateOfBirth(patient.dateOfBirth)} 
                      <span className="text-sm text-gray-500 ml-2">
                        ({calculateAge(patient.dateOfBirth)} tuổi)
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                    <div className="text-lg flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {formatPhoneNumber(patient.phone)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <div className="text-lg flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {patient.email || '-'}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Địa chỉ</label>
                    <div className="text-lg flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1" />
                      {patient.address || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                    <div className="mt-1">
                      <Badge variant={patient.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {formatStatus(patient.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                    <div className="text-lg flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatDateTime(patient.createdAt)}
                    </div>
                  </div>
                </div>
                {patient.note && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ghi chú</label>
                    <div className="text-lg mt-1 p-3 bg-gray-50 rounded-md">
                      {patient.note}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {patient.changeLogs && patient.changeLogs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử thay đổi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patient.changeLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div>
                          <div className="font-medium">{log.field}</div>
                          <div className="text-sm text-gray-500">
                            {log.oldValue} → {log.newValue}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDateTime(log.changedAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="visits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Lịch khám
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.visits && patient.visits.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ngày khám</TableHead>
                        <TableHead>Bác sĩ</TableHead>
                        <TableHead>Chẩn đoán</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.visits.map((visit) => (
                        <TableRow key={visit.id}>
                          <TableCell>{formatDateTime(visit.visitDate)}</TableCell>
                          <TableCell>{visit.doctorName}</TableCell>
                          <TableCell>{visit.diagnosis}</TableCell>
                          <TableCell>
                            <Badge variant={
                              visit.status === 'COMPLETED' ? 'default' : 
                              visit.status === 'PENDING' ? 'secondary' : 'destructive'
                            }>
                              {visit.status === 'COMPLETED' ? 'Hoàn thành' :
                               visit.status === 'PENDING' ? 'Chờ xử lý' : 'Hủy'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có lịch khám nào
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Đơn thuốc
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.prescriptions && patient.prescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {patient.prescriptions.map((prescription) => (
                      <div key={prescription.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">Đơn thuốc #{prescription.id}</div>
                            <div className="text-sm text-gray-500">
                              {formatDateTime(prescription.prescriptionDate)} - {prescription.doctorName}
                            </div>
                          </div>
                          <Badge variant={
                            prescription.status === 'ACTIVE' ? 'default' : 
                            prescription.status === 'COMPLETED' ? 'secondary' : 'destructive'
                          }>
                            {prescription.status === 'ACTIVE' ? 'Đang dùng' :
                             prescription.status === 'COMPLETED' ? 'Hoàn thành' : 'Hủy'}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <strong>Thuốc:</strong> {prescription.medications.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có đơn thuốc nào
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Hóa đơn
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.billings && patient.billings.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ngày</TableHead>
                        <TableHead>Dịch vụ</TableHead>
                        <TableHead>Số tiền</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.billings.map((billing) => (
                        <TableRow key={billing.id}>
                          <TableCell>{formatDateTime(billing.billingDate)}</TableCell>
                          <TableCell>{billing.services.join(', ')}</TableCell>
                          <TableCell className="font-medium">
                            {billing.totalAmount.toLocaleString('vi-VN')} VNĐ
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              billing.status === 'PAID' ? 'default' : 
                              billing.status === 'PENDING' ? 'secondary' : 'destructive'
                            }>
                              {billing.status === 'PAID' ? 'Đã thanh toán' :
                               billing.status === 'PENDING' ? 'Chờ thanh toán' : 'Hủy'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có hóa đơn nào
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
