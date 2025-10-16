import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Minus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { formatCurrency, calculateBillingTotals } from '@/utils/currency';
import { billingService } from '@/api/services/billing.service';
import type { Billing, CreateBillingRequest, UpdateBillingRequest, MedicalService, Medication } from '@/types';

const billingSchema = z.object({
  visitId: z.string().min(1, 'Chọn lần khám là bắt buộc'),
  services: z.array(z.object({
    serviceId: z.string(),
    quantity: z.number().min(1, 'Số lượng phải lớn hơn 0')
  })).min(1, 'Phải có ít nhất một dịch vụ hoặc thuốc'),
  medications: z.array(z.object({
    medicationId: z.string(),
    quantity: z.number().min(1, 'Số lượng phải lớn hơn 0')
  })),
  discountCode: z.string().optional(),
  discountAmount: z.number().min(0, 'Số tiền giảm giá phải lớn hơn 0').optional(),
  discountPercentage: z.number().min(0, 'Phần trăm giảm giá phải lớn hơn 0').max(100, 'Phần trăm giảm giá không được vượt quá 100%').optional(),
  notes: z.string().optional()
});

type BillingFormData = z.infer<typeof billingSchema>;

interface BillingEditorProps {
  billing?: Billing;
  isEdit?: boolean;
}

export function BillingEditor({ billing, isEdit = false }: BillingEditorProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<Array<{ serviceId: string; quantity: number; service?: MedicalService }>>([]);
  const [medications, setMedications] = useState<Array<{ medicationId: string; quantity: number; medication?: Medication }>>([]);
  const [availableServices, setAvailableServices] = useState<MedicalService[]>([]);
  const [availableMedications, setAvailableMedications] = useState<Medication[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const form = useForm<BillingFormData>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      visitId: billing?.visitId || '',
      services: billing?.services.map(s => ({ serviceId: s.serviceId, quantity: s.quantity })) || [],
      medications: billing?.medications.map(m => ({ medicationId: m.medicationId, quantity: m.quantity })) || [],
      discountCode: billing?.discountCode || '',
      discountAmount: billing?.discountAmount || 0,
      discountPercentage: billing?.discountPercentage || 0,
      notes: billing?.notes || ''
    }
  });

  useEffect(() => {
    if (isEdit && billing) {
      setServices(billing.services.map(s => ({ 
        serviceId: s.serviceId, 
        quantity: s.quantity,
        service: { id: s.serviceId, name: s.serviceName, price: s.unitPrice } as MedicalService
      })));
      setMedications(billing.medications.map(m => ({ 
        medicationId: m.medicationId, 
        quantity: m.quantity,
        medication: { id: m.medicationId, name: m.medicationName, price: m.unitPrice } as Medication
      })));
    }
  }, [billing, isEdit]);

  const handleAddService = (serviceId: string) => {
    const service = availableServices.find(s => s.id === serviceId);
    if (service) {
      const existingIndex = services.findIndex(s => s.serviceId === serviceId);
      if (existingIndex >= 0) {
        const updated = [...services];
        updated[existingIndex].quantity += 1;
        setServices(updated);
      } else {
        setServices([...services, { serviceId, quantity: 1, service }]);
      }
    }
  };

  const handleAddMedication = (medicationId: string) => {
    const medication = availableMedications.find(m => m.id === medicationId);
    if (medication) {
      const existingIndex = medications.findIndex(m => m.medicationId === medicationId);
      if (existingIndex >= 0) {
        const updated = [...medications];
        updated[existingIndex].quantity += 1;
        setMedications(updated);
      } else {
        setMedications([...medications, { medicationId, quantity: 1, medication }]);
      }
    }
  };

  const handleUpdateQuantity = (type: 'service' | 'medication', id: string, quantity: number) => {
    if (type === 'service') {
      setServices(services.map(s => 
        s.serviceId === id ? { ...s, quantity: Math.max(1, quantity) } : s
      ));
    } else {
      setMedications(medications.map(m => 
        m.medicationId === id ? { ...m, quantity: Math.max(1, quantity) } : m
      ));
    }
  };

  const handleRemoveItem = (type: 'service' | 'medication', id: string) => {
    if (type === 'service') {
      setServices(services.filter(s => s.serviceId !== id));
    } else {
      setMedications(medications.filter(m => m.medicationId !== id));
    }
  };

  const calculateSubtotal = () => {
    const serviceTotal = services.reduce((sum, s) => sum + (s.service?.price || 0) * s.quantity, 0);
    const medicationTotal = medications.reduce((sum, m) => sum + (m.medication?.price || 0) * m.quantity, 0);
    return serviceTotal + medicationTotal;
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountPercentage > 0) {
      return Math.round((subtotal * discountPercentage) / 100);
    }
    return discountAmount;
  };

  const totals = calculateBillingTotals(calculateSubtotal(), calculateDiscount());

  const handleSubmit = async (data: BillingFormData) => {
    try {
      setIsSubmitting(true);
      
      const submitData = {
        ...data,
        services: services.map(s => ({ serviceId: s.serviceId, quantity: s.quantity })),
        medications: medications.map(m => ({ medicationId: m.medicationId, quantity: m.quantity }))
      };

      if (isEdit && id) {
        await billingService.updateBilling(id, submitData);
      } else {
        await billingService.createBilling(submitData);
      }
      
      navigate('/billing');
    } catch (error) {
      console.error('Error saving billing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/billing')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? 'Chỉnh sửa hóa đơn' : 'Tạo hóa đơn mới'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Cập nhật thông tin hóa đơn' : 'Tạo hóa đơn mới cho bệnh nhân'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Visit Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin lần khám</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="visitId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lần khám *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn lần khám" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* This would be populated with actual visits */}
                            <SelectItem value="visit1">Lần khám 1 - Nguyễn Văn A</SelectItem>
                            <SelectItem value="visit2">Lần khám 2 - Trần Thị B</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Dịch vụ</CardTitle>
                  <CardDescription>Thêm các dịch vụ y tế</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Select onValueChange={handleAddService}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Chọn dịch vụ" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableServices.map(service => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - {formatCurrency(service.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={() => {}}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {services.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tên dịch vụ</TableHead>
                            <TableHead>Đơn giá</TableHead>
                            <TableHead>Số lượng</TableHead>
                            <TableHead>Thành tiền</TableHead>
                            <TableHead>Thao tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {services.map((service) => (
                            <TableRow key={service.serviceId}>
                              <TableCell>{service.service?.name}</TableCell>
                              <TableCell>{formatCurrency(service.service?.price || 0)}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateQuantity('service', service.serviceId, service.quantity - 1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <Input
                                    type="number"
                                    value={service.quantity}
                                    onChange={(e) => handleUpdateQuantity('service', service.serviceId, Number(e.target.value))}
                                    className="w-20 text-center"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateQuantity('service', service.serviceId, service.quantity + 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatCurrency((service.service?.price || 0) * service.quantity)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveItem('service', service.serviceId)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Medications */}
              <Card>
                <CardHeader>
                  <CardTitle>Thuốc</CardTitle>
                  <CardDescription>Thêm các loại thuốc</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Select onValueChange={handleAddMedication}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Chọn thuốc" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMedications.map(medication => (
                            <SelectItem key={medication.id} value={medication.id}>
                              {medication.name} - {formatCurrency(medication.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={() => {}}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {medications.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tên thuốc</TableHead>
                            <TableHead>Đơn giá</TableHead>
                            <TableHead>Số lượng</TableHead>
                            <TableHead>Thành tiền</TableHead>
                            <TableHead>Thao tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {medications.map((medication) => (
                            <TableRow key={medication.medicationId}>
                              <TableCell>{medication.medication?.name}</TableCell>
                              <TableCell>{formatCurrency(medication.medication?.price || 0)}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateQuantity('medication', medication.medicationId, medication.quantity - 1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <Input
                                    type="number"
                                    value={medication.quantity}
                                    onChange={(e) => handleUpdateQuantity('medication', medication.medicationId, Number(e.target.value))}
                                    className="w-20 text-center"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateQuantity('medication', medication.medicationId, medication.quantity + 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatCurrency((medication.medication?.price || 0) * medication.quantity)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveItem('medication', medication.medicationId)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Ghi chú</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="Nhập ghi chú cho hóa đơn"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Totals and Discount */}
            <div className="space-y-6">
              {/* Discount */}
              <Card>
                <CardHeader>
                  <CardTitle>Giảm giá</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Mã giảm giá</Label>
                    <Input
                      placeholder="Nhập mã giảm giá"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Giảm giá theo phần trăm (%)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label>Giảm giá theo số tiền (₫)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Totals */}
              <Card>
                <CardHeader>
                  <CardTitle>Tổng kết</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tổng tiền dịch vụ:</span>
                      <span>{formatCurrency(totals.subtotal)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá:</span>
                        <span>-{formatCurrency(totals.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>VAT ({totals.vatRate}%):</span>
                      <span>{formatCurrency(totals.vatAmount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Tổng cộng:</span>
                      <span>{formatCurrency(totals.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={() => navigate('/billing')}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo hóa đơn')}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
