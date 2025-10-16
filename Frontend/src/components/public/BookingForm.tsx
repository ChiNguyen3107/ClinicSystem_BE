import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, User, Phone, Mail, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/utils/cn';
import { PublicDoctor, PublicService, CreateBookingRequest } from '@/types/public';

const bookingSchema = z.object({
  patientName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  patientPhone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
  patientEmail: z.string().email('Email không hợp lệ'),
  patientDob: z.string().optional(),
  doctorId: z.string().min(1, 'Vui lòng chọn bác sĩ'),
  serviceId: z.string().optional(),
  appointmentDate: z.string().min(1, 'Vui lòng chọn ngày khám'),
  appointmentTime: z.string().min(1, 'Vui lòng chọn giờ khám'),
  symptoms: z.string().optional(),
  paymentMethod: z.enum(['CASH', 'VNPAY', 'MOMO']).optional(),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  doctors: PublicDoctor[];
  services: PublicService[];
  selectedDoctor?: PublicDoctor;
  onDoctorSelect: (doctorId: string) => void;
  onSubmit: (data: CreateBookingRequest) => void;
  isLoading?: boolean;
}

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00'
];

export const BookingForm: React.FC<BookingFormProps> = ({
  doctors,
  services,
  selectedDoctor,
  onDoctorSelect,
  onSubmit,
  isLoading = false
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: 'onChange'
  });

  const watchedDoctorId = watch('doctorId');
  const watchedDate = watch('appointmentDate');

  // Update available times when doctor or date changes
  useEffect(() => {
    if (watchedDoctorId && watchedDate) {
      // Mock available times - in real app, fetch from API
      const selectedDoctor = doctors.find(d => d.id === watchedDoctorId);
      if (selectedDoctor) {
        // Filter times based on doctor's schedule
        const availableTimesForDate = timeSlots.filter(time => {
          const dayOfWeek = new Date(watchedDate).getDay();
          return selectedDoctor.schedule.some(schedule => 
            schedule.dayOfWeek === dayOfWeek && 
            schedule.isAvailable &&
            time >= schedule.startTime && 
            time <= schedule.endTime
          );
        });
        setAvailableTimes(availableTimesForDate);
      }
    }
  }, [watchedDoctorId, watchedDate, doctors]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setValue('appointmentDate', format(date, 'yyyy-MM-dd'));
      setValue('appointmentTime', ''); // Reset time when date changes
    }
  };

  const handleDoctorChange = (doctorId: string) => {
    setValue('doctorId', doctorId);
    onDoctorSelect(doctorId);
    setValue('appointmentDate', '');
    setValue('appointmentTime', '');
    setSelectedDate(undefined);
  };

  const handleFormSubmit = (data: BookingFormData) => {
    onSubmit(data);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectedDoctorData = doctors.find(d => d.id === watchedDoctorId);
  const selectedService = services.find(s => s.id === watch('serviceId'));

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Đặt lịch khám bệnh
        </CardTitle>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                step <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step}
            </div>
          ))}
          <span className="text-sm text-muted-foreground ml-2">
            Bước {currentStep}/3
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Step 1: Doctor Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="doctorId">Chọn bác sĩ *</Label>
                <Select onValueChange={handleDoctorChange} value={watchedDoctorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn bác sĩ" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        <div className="flex items-center gap-2">
                          <span>{doctor.fullName}</span>
                          <Badge variant="secondary">{doctor.specialty}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.doctorId && (
                  <p className="text-sm text-destructive mt-1">{errors.doctorId.message}</p>
                )}
              </div>

              {selectedDoctorData && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{selectedDoctorData.fullName}</h4>
                      <p className="text-sm text-muted-foreground">{selectedDoctorData.specialty}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="serviceId">Dịch vụ (tùy chọn)</Label>
                <Select onValueChange={(value) => setValue('serviceId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn dịch vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Chọn ngày khám *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.appointmentDate && (
                  <p className="text-sm text-destructive mt-1">{errors.appointmentDate.message}</p>
                )}
              </div>

              {watchedDate && (
                <div>
                  <Label htmlFor="appointmentTime">Chọn giờ khám *</Label>
                  <Select onValueChange={(value) => setValue('appointmentTime', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.appointmentTime && (
                    <p className="text-sm text-destructive mt-1">{errors.appointmentTime.message}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Patient Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientName">Họ và tên *</Label>
                  <Input
                    id="patientName"
                    {...register('patientName')}
                    placeholder="Nhập họ và tên"
                  />
                  {errors.patientName && (
                    <p className="text-sm text-destructive mt-1">{errors.patientName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="patientPhone">Số điện thoại *</Label>
                  <Input
                    id="patientPhone"
                    {...register('patientPhone')}
                    placeholder="Nhập số điện thoại"
                  />
                  {errors.patientPhone && (
                    <p className="text-sm text-destructive mt-1">{errors.patientPhone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientEmail">Email *</Label>
                  <Input
                    id="patientEmail"
                    type="email"
                    {...register('patientEmail')}
                    placeholder="Nhập email"
                  />
                  {errors.patientEmail && (
                    <p className="text-sm text-destructive mt-1">{errors.patientEmail.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="patientDob">Ngày sinh</Label>
                  <Input
                    id="patientDob"
                    type="date"
                    {...register('patientDob')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="symptoms">Triệu chứng</Label>
                <Textarea
                  id="symptoms"
                  {...register('symptoms')}
                  placeholder="Mô tả triệu chứng hiện tại"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
                <Select onValueChange={(value) => setValue('paymentMethod', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phương thức thanh toán" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Thanh toán tại phòng khám</SelectItem>
                    <SelectItem value="VNPAY">VNPay</SelectItem>
                    <SelectItem value="MOMO">MoMo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Ghi chú thêm</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Ghi chú thêm (nếu có)"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Quay lại
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isValid}
              >
                Tiếp theo
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? 'Đang xử lý...' : 'Đặt lịch'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
