import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { ServiceOrder, MedicalService, ServiceOrderStatus } from '@/types/service';
import { formatCurrency } from '@/utils/currency';

interface ServiceOrderTableProps {
  serviceOrders: ServiceOrder[];
  medicalServices: MedicalService[];
  onAddService: (serviceId: string, performerId?: string, notes?: string) => void;
  onUpdateService: (orderId: string, data: Partial<ServiceOrder>) => void;
  onDeleteService: (orderId: string) => void;
  doctors: Array<{ id: string; fullName: string; specialization: string }>;
  loading?: boolean;
}

const statusConfig = {
  PENDING: { label: 'Chờ thực hiện', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  IN_PROGRESS: { label: 'Đang thực hiện', color: 'bg-blue-100 text-blue-800', icon: Clock },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Hủy bỏ', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export function ServiceOrderTable({
  serviceOrders,
  medicalServices,
  onAddService,
  onUpdateService,
  onDeleteService,
  doctors,
  loading = false
}: ServiceOrderTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedPerformerId, setSelectedPerformerId] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState('');

  const handleAddService = () => {
    if (selectedServiceId) {
      onAddService(selectedServiceId, selectedPerformerId || undefined, notes || undefined);
      setSelectedServiceId('');
      setSelectedPerformerId('');
      setNotes('');
      setIsAddDialogOpen(false);
    }
  };

  const handleEditService = (order: ServiceOrder) => {
    setEditingOrder(order);
    setSelectedPerformerId(order.performerId || '');
    setNotes(order.notes || '');
    setResult(order.result || '');
    setIsEditDialogOpen(true);
  };

  const handleUpdateService = () => {
    if (editingOrder) {
      onUpdateService(editingOrder.id, {
        performerId: selectedPerformerId || undefined,
        notes: notes || undefined,
        result: result || undefined,
      });
      setIsEditDialogOpen(false);
      setEditingOrder(null);
    }
  };

  const getStatusBadge = (status: ServiceOrderStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dịch vụ y tế</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Dịch vụ y tế</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm dịch vụ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm dịch vụ mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="service">Dịch vụ</Label>
                <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn dịch vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicalServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - {formatCurrency(service.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="performer">Người thực hiện</Label>
                <Select value={selectedPerformerId} onValueChange={setSelectedPerformerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn người thực hiện" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.fullName} - {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập ghi chú..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddService} disabled={!selectedServiceId}>
                  Thêm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dịch vụ</TableHead>
              <TableHead>Người thực hiện</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {serviceOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Chưa có dịch vụ nào
                </TableCell>
              </TableRow>
            ) : (
              serviceOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.service.name}</div>
                      <div className="text-sm text-gray-500">{order.service.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.performer ? (
                      <div>
                        <div className="font-medium">{order.performer.fullName}</div>
                        <div className="text-sm text-gray-500">{order.performer.specialization}</div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Chưa phân công</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{formatCurrency(order.service.price)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditService(order)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteService(order.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa dịch vụ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-performer">Người thực hiện</Label>
                <Select value={selectedPerformerId} onValueChange={setSelectedPerformerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn người thực hiện" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.fullName} - {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-result">Kết quả</Label>
                <Textarea
                  id="edit-result"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="Nhập kết quả..."
                />
              </div>
              <div>
                <Label htmlFor="edit-notes">Ghi chú</Label>
                <Textarea
                  id="edit-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập ghi chú..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleUpdateService}>
                  Cập nhật
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
