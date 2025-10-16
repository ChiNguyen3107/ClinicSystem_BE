import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Check, User, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { useDoctorStore } from '@/store/doctor.store';
import { toast } from 'sonner';

// Step 1: User Account Schema
const userAccountSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  dateOfBirth: z.string().optional(),
});

// Step 2: Doctor Profile Schema
const doctorProfileSchema = z.object({
  specialty: z.string().min(1, 'Vui lòng chọn chuyên khoa'),
  licenseNo: z.string().min(1, 'Số bằng hành nghề không được để trống'),
  room: z.string().optional(),
  bio: z.string().optional(),
});

// Combined schema
const doctorWizardSchema = userAccountSchema.merge(doctorProfileSchema);

type DoctorWizardForm = z.infer<typeof doctorWizardSchema>;

const DoctorWizard: React.FC = () => {
  const navigate = useNavigate();
  const { createDoctor, loading } = useDoctorStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<DoctorWizardForm>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<DoctorWizardForm>({
    resolver: zodResolver(doctorWizardSchema),
    defaultValues: formData,
  });

  const specialties = [
    'Tim mạch',
    'Nhi khoa',
    'Ngoại khoa',
    'Sản phụ khoa',
    'Thần kinh',
    'Da liễu',
    'Mắt',
    'Tai mũi họng',
    'Nội tiết',
    'Tiêu hóa',
    'Hô hấp',
    'Ung bướu',
    'Xương khớp',
    'Tâm thần',
    'Y học cổ truyền'
  ];

  const steps = [
    {
      id: 1,
      title: 'Tài khoản người dùng',
      description: 'Thông tin cơ bản và tài khoản đăng nhập',
      icon: User,
    },
    {
      id: 2,
      title: 'Hồ sơ bác sĩ',
      description: 'Thông tin chuyên môn và bằng cấp',
      icon: Stethoscope,
    },
  ];

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      const formValues = watch();
      setFormData({ ...formData, ...formValues });
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    const formValues = watch();
    setFormData({ ...formData, ...formValues });
    setCurrentStep(1);
  };

  const onSubmit = async (data: DoctorWizardForm) => {
    try {
      await createDoctor(data);
      toast.success('Tạo bác sĩ thành công! Email thông báo đã được gửi.');
      navigate('/doctors');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo bác sĩ');
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/doctors')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thêm bác sĩ mới</h1>
          <p className="text-muted-foreground">
            Tạo tài khoản và hồ sơ bác sĩ mới
          </p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Tiến độ</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="flex justify-between">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex flex-col items-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : isActive
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-medium ${
                        isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 ? 'Thông tin tài khoản' : 'Thông tin chuyên môn'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="bacsi@clinic.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mật khẩu mạnh"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <Input
                    id="fullName"
                    placeholder="BS. Nguyễn Văn A"
                    {...register('fullName')}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    placeholder="0123456789"
                    {...register('phone')}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Giới tính</Label>
                  <RadioGroup
                    value={watch('gender') || ''}
                    onValueChange={(value) => setValue('gender', value as any)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MALE" id="male" />
                      <Label htmlFor="male">Nam</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="FEMALE" id="female" />
                      <Label htmlFor="female">Nữ</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="OTHER" id="other" />
                      <Label htmlFor="other">Khác</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register('dateOfBirth')}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Chuyên khoa *</Label>
                    <Select
                      value={watch('specialty') || ''}
                      onValueChange={(value) => setValue('specialty', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chuyên khoa" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map(specialty => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.specialty && (
                      <p className="text-sm text-red-500">{errors.specialty.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseNo">Số bằng hành nghề *</Label>
                    <Input
                      id="licenseNo"
                      placeholder="BS001"
                      {...register('licenseNo')}
                    />
                    {errors.licenseNo && (
                      <p className="text-sm text-red-500">{errors.licenseNo.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room">Phòng làm việc</Label>
                    <Input
                      id="room"
                      placeholder="Phòng 101"
                      {...register('room')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Tiểu sử</Label>
                  <Textarea
                    id="bio"
                    placeholder="Mô tả về kinh nghiệm và chuyên môn..."
                    rows={4}
                    {...register('bio')}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 1 ? () => navigate('/doctors') : handleBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentStep === 1 ? 'Hủy' : 'Quay lại'}
              </Button>

              {currentStep === 1 ? (
                <Button type="button" onClick={handleNext}>
                  Tiếp theo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang tạo...' : 'Hoàn thành'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default DoctorWizard;
