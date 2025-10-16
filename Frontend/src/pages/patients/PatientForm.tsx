import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormProvider,
} from '@/components/ui/form';
import { ValidatedInput, ValidatedSelect, ValidatedTextarea } from '@/components/ui/ValidatedInput';
import { Loader2, X } from 'lucide-react';
import { patientService } from '@/api/services/patient.service';
import { usePatientStore } from '@/store/patient.store';
import { generatePatientCode } from '@/utils/format';
import { patientSchemas } from '@/utils/validationSchemas';
import { ValidationErrorHandler, NetworkErrorHandler } from '@/utils/validationHelpers';
import type { Patient, PatientCreateRequest, PatientUpdateRequest } from '@/types/patient';

type PatientFormData = {
  fullName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
};

interface PatientFormProps {
  patient?: Patient;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  onSuccess,
  onCancel,
}) => {
  const { setLoading, setError, closeForm } = usePatientStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<PatientFormData>({
    resolver: yupResolver(patient ? patientSchemas.update : patientSchemas.create),
    defaultValues: {
      fullName: patient?.name || '',
      gender: patient?.gender || 'MALE',
      dateOfBirth: patient?.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
      phone: patient?.phone || '',
      email: patient?.email || '',
      address: patient?.address || '',
      note: patient?.note || '',
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true);
    setLoading(true);
    setError(null);

    try {
      if (patient) {
        // Update existing patient
        const updateData: PatientUpdateRequest = {
          name: data.fullName,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          phone: data.phone,
          email: data.email || undefined,
          address: data.address || undefined,
          note: data.note || undefined,
        };
        await patientService.updatePatient(patient.id, updateData);
      } else {
        // Create new patient
        const createData: PatientCreateRequest = {
          fullName: data.fullName,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          phone: data.phone,
          email: data.email || undefined,
          address: data.address || undefined,
          note: data.note || undefined,
        };
        await patientService.createPatient(createData);
      }

      onSuccess?.();
      closeForm();
    } catch (error: any) {
      const errorMessage = NetworkErrorHandler.handleNetworkError(error);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
    closeForm();
  };

  return (
    <Dialog open={true} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {patient ? 'Chỉnh sửa bệnh nhân' : 'Thêm bệnh nhân mới'}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ValidatedInput
                    name="fullName"
                    label="Họ tên"
                    placeholder="Nhập họ tên"
                    required
                  />

                  <ValidatedSelect
                    name="gender"
                    label="Giới tính"
                    placeholder="Chọn giới tính"
                    required
                    options={[
                      { value: 'MALE', label: 'Nam' },
                      { value: 'FEMALE', label: 'Nữ' },
                      { value: 'OTHER', label: 'Khác' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ValidatedInput
                    name="dateOfBirth"
                    label="Ngày sinh"
                    type="date"
                    required
                  />

                  <ValidatedInput
                    name="phone"
                    label="Số điện thoại"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                <ValidatedInput
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Nhập email"
                />

                <ValidatedTextarea
                  name="address"
                  label="Địa chỉ"
                  placeholder="Nhập địa chỉ"
                  rows={2}
                />

                <ValidatedTextarea
                  name="note"
                  label="Ghi chú"
                  placeholder="Nhập ghi chú"
                  rows={3}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {patient ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
