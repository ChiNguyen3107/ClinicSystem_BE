import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, User, Stethoscope, MapPin, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppointmentStore } from '@/store/appointment.store';
import { usePatientStore } from '@/store/patient.store';
import { useDoctorStore } from '@/store/doctor.store';
import { 
  CreateAppointmentFormData, 
  UpdateAppointmentFormData,
  createAppointmentSchema,
  updateAppointmentSchema,
  Appointment 
} from '@/types/appointment';
import { Patient } from '@/types/patient';
import { Doctor } from '@/types/doctor';
import { toast } from 'sonner';

interface AppointmentFormProps {
  appointment?: Appointment | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  onSuccess,
  onCancel
}) => {
  const isEditing = !!appointment;
  const schema = isEditing ? updateAppointmentSchema : createAppointmentSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<CreateAppointmentFormData | UpdateAppointmentFormData>({
    resolver: zodResolver(schema),
    defaultValues: isEditing ? {
      doctorId: appointment.doctorId,
      roomId: appointment.roomId,
      appointmentDate: appointment.appointmentDate,
      startTime: appointment.startTime,
      duration: appointment.duration,
      reason: appointment.reason,
      notes: appointment.notes || ''
    } : {
      duration: 30
    }
  });

  const { createAppointment, updateAppointment, isCreating, isUpdating } = useAppointmentStore();
  const { patients, fetchPatients } = usePatientStore();
  const { doctors, fetchDoctors } = useDoctorStore();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [conflictCheck, setConflictCheck] = useState<{
    hasConflict: boolean;
    conflicts: Appointment[];
  } | null>(null);

  const watchedDoctorId = watch('doctorId');
  const watchedDate = watch('appointmentDate');
  const watchedStartTime = watch('startTime');
  const watchedDuration = watch('duration');

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (isEditing && appointment) {
      const patient = patients.find(p => p.id.toString() === appointment.patientId);
      const doctor = doctors.find(d => d.id === appointment.doctorId);
      setSelectedPatient(patient || null);
      setSelectedDoctor(doctor || null);
    }
  }, [isEditing, appointment, patients, doctors]);

  useEffect(() => {
    if (patientSearch) {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        patient.code.toLowerCase().includes(patientSearch.toLowerCase()) ||
        patient.phone.includes(patientSearch)
      );
      setFilteredPatients(filtered.slice(0, 10));
    } else {
      setFilteredPatients([]);
    }
  }, [patientSearch, patients]);

  useEffect(() => {
    if (watchedDoctorId && watchedDate && watchedStartTime && watchedDuration) {
      checkConflicts();
    }
  }, [watchedDoctorId, watchedDate, watchedStartTime, watchedDuration]);

  const checkConflicts = async () => {
    if (!watchedDoctorId || !watchedDate || !watchedStartTime || !watchedDuration) return;

    try {
      const { AppointmentService } = await import('@/api/services/appointment.service');
      const result = await AppointmentService.checkConflicts({
        doctorId: watchedDoctorId,
        appointmentDate: watchedDate,
        startTime: watchedStartTime,
        duration: watchedDuration,
        excludeId: isEditing ? appointment?.id : undefined
      });
      setConflictCheck(result);
    } catch (error) {
      console.error('Error checking conflicts:', error);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setValue('patientId', patient.id.toString());
    setPatientSearch('');
    setFilteredPatients([]);
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setValue('doctorId', doctor.id);
    setValue('roomId', doctor.room);
  };

  const onSubmit = async (data: CreateAppointmentFormData | UpdateAppointmentFormData) => {
    try {
      if (isEditing && appointment) {
        await updateAppointment(appointment.id, data as UpdateAppointmentFormData);
        toast.success('Cập nhật lịch hẹn thành công');
      } else {
        await createAppointment(data as CreateAppointmentFormData);
        toast.success('Tạo lịch hẹn thành công');
      }
      onSuccess();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu lịch hẹn');
    }
  };

  const durationOptions = [
    { value: 30, label: '30 phút' },
    { value: 45, label: '45 phút' },
    { value: 60, label: '60 phút' },
    { value: 90, label: '90 phút' },
    { value: 120, label: '120 phút' }
  ];

  const getAvailableRooms = () => {
    if (!selectedDoctor) return [];
    return [
      { id: selectedDoctor.room, name: selectedDoctor.room },
      { id: 'Phòng 101', name: 'Phòng 101' },
      { id: 'Phòng 102', name: 'Phòng 102' },
      { id: 'Phòng 103', name: 'Phòng 103' },
      { id: 'Phòng 104', name: 'Phòng 104' }
    ];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Patient Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Thông tin bệnh nhân
            </CardTitle>
            <CardDescription>
              {isEditing ? 'Bệnh nhân đã chọn' : 'Chọn bệnh nhân cho lịch hẹn'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <div className="font-medium">{appointment?.patientName}</div>
                <div className="text-sm text-muted-foreground">{appointment?.patientPhone}</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientSearch">Tìm kiếm bệnh nhân</Label>
                  <div className="relative">
                    <Input
                      id="patientSearch"
                      placeholder="Nhập tên, mã hoặc SĐT bệnh nhân..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                    />
                    {filteredPatients.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredPatients.map((patient) => (
                          <div
                            key={patient.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                            onClick={() => handlePatientSelect(patient)}
                          >
                            <div className="font-medium">{patient.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {patient.code} • {patient.phone}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {selectedPatient && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="font-medium text-green-800">{selectedPatient.name}</div>
                    <div className="text-sm text-green-600">
                      {selectedPatient.code} • {selectedPatient.phone}
                    </div>
                  </div>
                )}

                <input type="hidden" {...register('patientId')} />
                {errors.patientId && (
                  <p className="text-sm text-red-600">{errors.patientId.message}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Doctor Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Thông tin bác sĩ
            </CardTitle>
            <CardDescription>
              Chọn bác sĩ và phòng khám
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctorId">Bác sĩ</Label>
              <Select
                value={watchedDoctorId || ''}
                onValueChange={(value) => {
                  const doctor = doctors.find(d => d.id === value);
                  if (doctor) handleDoctorSelect(doctor);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn bác sĩ" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex flex-col">
                        <span>{doctor.fullName}</span>
                        <span className="text-sm text-muted-foreground">{doctor.specialty}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doctorId && (
                <p className="text-sm text-red-600">{errors.doctorId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomId">Phòng khám</Label>
              <Select
                value={watch('roomId') || ''}
                onValueChange={(value) => setValue('roomId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRooms().map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roomId && (
                <p className="text-sm text-red-600">{errors.roomId.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date and Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Thời gian hẹn
          </CardTitle>
          <CardDescription>
            Chọn ngày và giờ khám
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Ngày hẹn</Label>
              <Input
                id="appointmentDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                {...register('appointmentDate')}
              />
              {errors.appointmentDate && (
                <p className="text-sm text-red-600">{errors.appointmentDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Giờ bắt đầu</Label>
              <Input
                id="startTime"
                type="time"
                {...register('startTime')}
              />
              {errors.startTime && (
                <p className="text-sm text-red-600">{errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Thời gian</Label>
              <Select
                value={watchedDuration?.toString() || ''}
                onValueChange={(value) => setValue('duration', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thời gian" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.duration && (
                <p className="text-sm text-red-600">{errors.duration.message}</p>
              )}
            </div>
          </div>

          {/* Conflict Warning */}
          {conflictCheck?.hasConflict && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium">Cảnh báo trùng lịch!</div>
                <div className="text-sm">
                  Bác sĩ đã có lịch hẹn trong khoảng thời gian này:
                </div>
                <ul className="mt-2 text-sm">
                  {conflictCheck.conflicts.map((conflict) => (
                    <li key={conflict.id} className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {conflict.patientName} - {conflict.startTime} - {conflict.endTime}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Reason and Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Thông tin bổ sung
          </CardTitle>
          <CardDescription>
            Lý do khám và ghi chú
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Lý do khám</Label>
            <Input
              id="reason"
              placeholder="Nhập lý do khám..."
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-sm text-red-600">{errors.reason.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              placeholder="Ghi chú thêm (tùy chọn)..."
              rows={3}
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || isCreating || isUpdating}
        >
          {isSubmitting || isCreating || isUpdating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isEditing ? 'Đang cập nhật...' : 'Đang tạo...'}
            </>
          ) : (
            isEditing ? 'Cập nhật lịch hẹn' : 'Tạo lịch hẹn'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
