import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, User, Stethoscope, Calendar, FileText, Pill, CreditCard } from 'lucide-react';
import { Visit, VisitStatus } from '@/types/visit';
import { ServiceOrder, MedicalService } from '@/types/service';
import { Prescription, Medication } from '@/types/medication';
import { Billing } from '@/types/medication';
import { visitService } from '@/api/services/visit.service';
import { serviceOrderService } from '@/api/services/serviceOrder.service';
import { medicationService } from '@/api/services/medication.service';
import { ServiceOrderTable } from '@/components/visits/ServiceOrderTable';
import { PrescriptionEditor } from '@/components/visits/PrescriptionEditor';
import { BillingPreview } from '@/components/visits/BillingPreview';
import { formatDate } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';

const statusConfig = {
  PENDING: { label: 'Chờ khám', color: 'bg-yellow-100 text-yellow-800' },
  IN_PROGRESS: { label: 'Đang khám', color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Hủy bỏ', color: 'bg-red-100 text-red-800' },
};

export function VisitEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [billing, setBilling] = useState<Billing | null>(null);
  const [medicalServices, setMedicalServices] = useState<MedicalService[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doctors, setDoctors] = useState<Array<{ id: string; fullName: string; specialization: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Form state
  const [formData, setFormData] = useState({
    preliminaryDx: '',
    symptoms: '',
    clinicalNotes: '',
    status: 'PENDING' as VisitStatus
  });

  useEffect(() => {
    if (id) {
      loadVisitData();
    }
  }, [id]);

  const loadVisitData = async () => {
    try {
      setLoading(true);
      const [visitData, services, meds, serviceOrdersData, prescriptionData, billingData] = await Promise.all([
        visitService.getVisitById(id!),
        serviceOrderService.getMedicalServices(),
        medicationService.getMedications(),
        serviceOrderService.getServiceOrdersByVisit(id!),
        medicationService.getPrescriptionByVisit(id!),
        medicationService.getBillingByVisit(id!)
      ]);

      setVisit(visitData);
      setMedicalServices(services);
      setMedications(meds);
      setServiceOrders(serviceOrdersData);
      setPrescription(prescriptionData);
      setBilling(billingData);

      // Set form data
      setFormData({
        preliminaryDx: visitData.preliminaryDx,
        symptoms: visitData.symptoms,
        clinicalNotes: visitData.clinicalNotes,
        status: visitData.status
      });

      // Load doctors
      setDoctors([
        { id: '1', fullName: 'BS. Nguyễn Văn A', specialization: 'Tim mạch' },
        { id: '2', fullName: 'BS. Trần Thị B', specialization: 'Nội khoa' },
        { id: '3', fullName: 'BS. Lê Văn C', specialization: 'Ngoại khoa' },
      ]);
    } catch (error) {
      console.error('Error loading visit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVisit = async () => {
    if (!visit) return;

    try {
      setSaving(true);
      await visitService.updateVisit(visit.id, formData);
      await loadVisitData();
    } catch (error) {
      console.error('Error saving visit:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = async (serviceId: string, performerId?: string, notes?: string) => {
    if (!visit) return;

    try {
      await serviceOrderService.createServiceOrder(visit.id, {
        serviceId,
        performerId,
        notes
      });
      await loadVisitData();
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleUpdateService = async (orderId: string, data: Partial<ServiceOrder>) => {
    if (!visit) return;

    try {
      await serviceOrderService.updateServiceOrder(visit.id, orderId, data);
      await loadVisitData();
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleDeleteService = async (orderId: string) => {
    if (!visit) return;

    try {
      await serviceOrderService.deleteServiceOrder(visit.id, orderId);
      await loadVisitData();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleSavePrescription = async (medications: any[], notes?: string) => {
    if (!visit) return;

    try {
      if (prescription) {
        await medicationService.updatePrescription(visit.id, { medications, notes });
      } else {
        await medicationService.createPrescription(visit.id, { medications, notes });
      }
      await loadVisitData();
    } catch (error) {
      console.error('Error saving prescription:', error);
    }
  };

  const handleUpdateBilling = async (discount: number, discountReason?: string) => {
    if (!visit) return;

    try {
      if (billing) {
        await medicationService.updateBilling(visit.id, { discount, discountReason });
      } else {
        await medicationService.createBilling(visit.id, { discount, discountReason });
      }
      await loadVisitData();
    } catch (error) {
      console.error('Error updating billing:', error);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!visit) return;

    try {
      await medicationService.markBillingAsPaid(visit.id);
      await loadVisitData();
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };

  const handleGeneratePDF = async () => {
    if (!visit) return;

    try {
      const blob = await medicationService.generateBillingPDF(visit.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hoa-don-${visit.visitCode}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const getStatusBadge = (status: VisitStatus) => {
    const config = statusConfig[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-600">Không tìm thấy hồ sơ khám</h2>
        <Button onClick={() => navigate('/visits')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/visits')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Hồ sơ khám {visit.visitCode}</h1>
            <p className="text-gray-600">
              {visit.patient.fullName} - {formatDate(visit.visitDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(visit.status)}
          <Button onClick={handleSaveVisit} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <FileText className="w-4 h-4 mr-2" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="services">
            <Stethoscope className="w-4 h-4 mr-2" />
            Dịch vụ
          </TabsTrigger>
          <TabsTrigger value="lab-results">
            <FileText className="w-4 h-4 mr-2" />
            Kết quả xét nghiệm
          </TabsTrigger>
          <TabsTrigger value="prescription">
            <Pill className="w-4 h-4 mr-2" />
            Đơn thuốc
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="w-4 h-4 mr-2" />
            Hóa đơn
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Thông tin bệnh nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Họ tên</Label>
                  <p className="text-lg">{visit.patient.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Ngày sinh</Label>
                  <p>{formatDate(visit.patient.dateOfBirth)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Số điện thoại</Label>
                  <p>{visit.patient.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Địa chỉ</Label>
                  <p>{visit.patient.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Doctor Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Thông tin bác sĩ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Họ tên</Label>
                  <p className="text-lg">{visit.doctor.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Chuyên khoa</Label>
                  <p>{visit.doctor.specialization}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Số điện thoại</Label>
                  <p>{visit.doctor.phoneNumber}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visit Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết khám bệnh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preliminaryDx">Chẩn đoán sơ bộ</Label>
                  <Input
                    id="preliminaryDx"
                    value={formData.preliminaryDx}
                    onChange={(e) => setFormData({ ...formData, preliminaryDx: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as VisitStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Chờ khám</SelectItem>
                      <SelectItem value="IN_PROGRESS">Đang khám</SelectItem>
                      <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                      <SelectItem value="CANCELLED">Hủy bỏ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="symptoms">Triệu chứng</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="clinicalNotes">Ghi chú lâm sàng</Label>
                <Textarea
                  id="clinicalNotes"
                  value={formData.clinicalNotes}
                  onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services">
          <ServiceOrderTable
            serviceOrders={serviceOrders}
            medicalServices={medicalServices}
            doctors={doctors}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
            onDeleteService={handleDeleteService}
            loading={loading}
          />
        </TabsContent>

        {/* Lab Results Tab */}
        <TabsContent value="lab-results">
          <Card>
            <CardHeader>
              <CardTitle>Kết quả xét nghiệm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                Tính năng này sẽ được phát triển trong phiên bản tiếp theo
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescription Tab */}
        <TabsContent value="prescription">
          <PrescriptionEditor
            prescription={prescription}
            medications={medications}
            onSave={handleSavePrescription}
            loading={loading}
          />
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <BillingPreview
            billing={billing}
            serviceOrders={serviceOrders}
            prescription={prescription}
            onUpdateBilling={handleUpdateBilling}
            onMarkAsPaid={handleMarkAsPaid}
            onGeneratePDF={handleGeneratePDF}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
