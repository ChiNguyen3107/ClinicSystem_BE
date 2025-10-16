import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DrugPicker, InteractionAlert, InteractionSummary } from '@/components/prescriptions';
import { prescriptionService } from '@/api/services/prescription.service';
import { medicationService } from '@/api/services/medication.service';
import { doctorService } from '@/api/services/doctor.service';
import { patientService } from '@/api/services/patient.service';
import type { Prescription, Medication, Doctor, Patient, MedicationInteraction } from '@/types';

const prescriptionSchema = z.object({
  patientId: z.number().min(1, 'Vui lòng chọn bệnh nhân'),
  doctorId: z.number().min(1, 'Vui lòng chọn bác sĩ'),
  diagnosis: z.string().min(1, 'Vui lòng nhập chẩn đoán'),
  notes: z.string().optional(),
  items: z.array(z.object({
    medicationId: z.number().min(1, 'Vui lòng chọn thuốc'),
    dosage: z.string().min(1, 'Vui lòng nhập liều lượng'),
    frequency: z.string().min(1, 'Vui lòng nhập tần suất'),
    duration: z.string().min(1, 'Vui lòng nhập thời gian'),
    instructions: z.string().min(1, 'Vui lòng nhập hướng dẫn'),
    quantity: z.number().min(1, 'Số lượng phải lớn hơn 0')
  })).min(1, 'Vui lòng thêm ít nhất một thuốc')
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

export function PrescriptionEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [interactions, setInteractions] = useState<MedicationInteraction[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<number[]>([]);

  const form = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: 0,
      doctorId: 0,
      diagnosis: '',
      notes: '',
      items: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  });

  // Load data
  useEffect(() => {
    loadDoctors();
    loadPatients();
    if (isEdit) {
      loadPrescription();
    }
  }, [id]);

  // Check interactions when medications change
  useEffect(() => {
    if (selectedMedications.length > 1) {
      checkInteractions();
    } else {
      setInteractions([]);
    }
  }, [selectedMedications]);

  const loadPrescription = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const prescription = await prescriptionService.getPrescriptionById(parseInt(id));
      
      form.reset({
        patientId: prescription.patient.id,
        doctorId: prescription.doctor.id,
        diagnosis: prescription.diagnosis,
        notes: prescription.notes || '',
        items: prescription.items.map(item => ({
          medicationId: item.medication.id,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          instructions: item.instructions,
          quantity: item.quantity
        }))
      });

      setSelectedMedications(prescription.items.map(item => item.medication.id));
    } catch (error) {
      console.error('Lỗi tải đơn thuốc:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await doctorService.getDoctors({ page: 0, size: 100 });
      setDoctors(response.content);
    } catch (error) {
      console.error('Lỗi tải danh sách bác sĩ:', error);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await patientService.getPatients({ page: 0, size: 100 });
      setPatients(response.content);
    } catch (error) {
      console.error('Lỗi tải danh sách bệnh nhân:', error);
    }
  };

  const checkInteractions = async () => {
    try {
      const interactions = await medicationService.getMedicationInteractions(selectedMedications);
      setInteractions(interactions);
    } catch (error) {
      console.error('Lỗi kiểm tra tương tác thuốc:', error);
    }
  };

  const handleAddMedication = (medication: Medication) => {
    const newItem = {
      medicationId: medication.id,
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      quantity: 1
    };
    
    append(newItem);
    setSelectedMedications(prev => [...prev, medication.id]);
  };

  const handleRemoveMedication = (index: number) => {
    const medicationId = form.getValues(`items.${index}.medicationId`);
    remove(index);
    setSelectedMedications(prev => prev.filter(id => id !== medicationId));
  };

  const onSubmit = async (data: PrescriptionFormData) => {
    try {
      setSaving(true);
      
      if (isEdit) {
        await prescriptionService.updatePrescription(parseInt(id!), data);
      } else {
        await prescriptionService.createPrescription(data);
      }
      
      navigate('/prescriptions');
    } catch (error) {
      console.error('Lỗi lưu đơn thuốc:', error);
    } finally {
      setSaving(false);
    }
  };

  const calculateTotal = () => {
    const items = form.getValues('items');
    return items.reduce((total, item) => {
      // Giả sử có API để lấy giá thuốc
      const unitPrice = 10000; // Giá mặc định
      return total + (item.quantity * unitPrice);
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? 'Chỉnh sửa đơn thuốc' : 'Tạo đơn thuốc mới'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Cập nhật thông tin đơn thuốc' : 'Nhập thông tin để tạo đơn thuốc mới'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/prescriptions')}>
            Hủy
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Lưu đơn thuốc
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientId">Bệnh nhân *</Label>
                <select
                  id="patientId"
                  {...form.register('patientId', { valueAsNumber: true })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={0}>Chọn bệnh nhân</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.fullName} - {patient.phone}
                    </option>
                  ))}
                </select>
                {form.formState.errors.patientId && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.patientId.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="doctorId">Bác sĩ *</Label>
                <select
                  id="doctorId"
                  {...form.register('doctorId', { valueAsNumber: true })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={0}>Chọn bác sĩ</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.account.fullName} - {doctor.specialty}
                    </option>
                  ))}
                </select>
                {form.formState.errors.doctorId && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.doctorId.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="diagnosis">Chẩn đoán *</Label>
              <Textarea
                id="diagnosis"
                {...form.register('diagnosis')}
                placeholder="Nhập chẩn đoán..."
                className="mt-1"
              />
              {form.formState.errors.diagnosis && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.diagnosis.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                {...form.register('notes')}
                placeholder="Nhập ghi chú thêm..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Drug Interactions Alert */}
        {interactions.length > 0 && (
          <InteractionAlert
            interactions={interactions}
            onDismiss={() => setInteractions([])}
          />
        )}

        {/* Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Danh sách thuốc</span>
              <div className="flex items-center gap-2">
                <InteractionSummary interactions={interactions} />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddMedication({} as Medication)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thuốc
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      Thuốc {index + 1}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMedication(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Tìm thuốc</Label>
                    <DrugPicker
                      onSelect={(medication) => {
                        form.setValue(`items.${index}.medicationId`, medication.id);
                        handleAddMedication(medication);
                      }}
                      selectedMedications={selectedMedications}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`items.${index}.dosage`}>Liều lượng *</Label>
                      <Input
                        id={`items.${index}.dosage`}
                        {...form.register(`items.${index}.dosage`)}
                        placeholder="Ví dụ: 500mg"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`items.${index}.frequency`}>Tần suất *</Label>
                      <Input
                        id={`items.${index}.frequency`}
                        {...form.register(`items.${index}.frequency`)}
                        placeholder="Ví dụ: 3 lần/ngày"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`items.${index}.duration`}>Thời gian *</Label>
                      <Input
                        id={`items.${index}.duration`}
                        {...form.register(`items.${index}.duration`)}
                        placeholder="Ví dụ: 7 ngày"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`items.${index}.quantity`}>Số lượng *</Label>
                      <Input
                        id={`items.${index}.quantity`}
                        type="number"
                        {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                        placeholder="1"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`items.${index}.instructions`}>Hướng dẫn sử dụng *</Label>
                    <Textarea
                      id={`items.${index}.instructions`}
                      {...form.register(`items.${index}.instructions`)}
                      placeholder="Nhập hướng dẫn chi tiết..."
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Chưa có thuốc nào được thêm</p>
                <p className="text-sm">Nhấn "Thêm thuốc" để bắt đầu</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Tổng kết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Tổng cộng:</span>
              <span className="text-xl font-bold">
                {calculateTotal().toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
