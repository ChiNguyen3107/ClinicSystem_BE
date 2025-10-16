import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Save } from 'lucide-react';
import { Prescription, PrescriptionItem, Medication, CreatePrescriptionItemRequest } from '@/types/medication';
import { formatCurrency } from '@/utils/currency';

interface PrescriptionEditorProps {
  prescription?: Prescription | null;
  medications: Medication[];
  onSave: (medications: CreatePrescriptionItemRequest[], notes?: string) => void;
  loading?: boolean;
}

export function PrescriptionEditor({
  prescription,
  medications,
  onSave,
  loading = false
}: PrescriptionEditorProps) {
  const [items, setItems] = useState<CreatePrescriptionItemRequest[]>([]);
  const [notes, setNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<CreatePrescriptionItemRequest>({
    medicationId: '',
    dosage: '',
    quantity: 1,
    unit: 'viên',
    usageNotes: ''
  });

  useEffect(() => {
    if (prescription) {
      setItems(prescription.medications.map(item => ({
        medicationId: item.medicationId,
        dosage: item.dosage,
        quantity: item.quantity,
        unit: item.unit,
        usageNotes: item.usageNotes
      })));
      setNotes(prescription.notes || '');
    }
  }, [prescription]);

  const handleAddItem = () => {
    if (newItem.medicationId && newItem.dosage && newItem.quantity > 0) {
      setItems([...items, { ...newItem }]);
      setNewItem({
        medicationId: '',
        dosage: '',
        quantity: 1,
        unit: 'viên',
        usageNotes: ''
      });
      setIsAdding(false);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof CreatePrescriptionItemRequest, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleSave = () => {
    onSave(items, notes);
  };

  const getMedicationById = (id: string) => {
    return medications.find(med => med.id === id);
  };

  const calculateItemTotal = (item: CreatePrescriptionItemRequest) => {
    const medication = getMedicationById(item.medicationId);
    if (!medication) return 0;
    return medication.price * item.quantity;
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đơn thuốc</CardTitle>
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
        <CardTitle>Đơn thuốc</CardTitle>
        <div className="flex space-x-2">
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm thuốc
            </Button>
          )}
          <Button onClick={handleSave} disabled={items.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            Lưu đơn thuốc
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new item form */}
        {isAdding && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Thêm thuốc mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medication">Thuốc</Label>
                  <Select
                    value={newItem.medicationId}
                    onValueChange={(value) => setNewItem({ ...newItem, medicationId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thuốc" />
                    </SelectTrigger>
                    <SelectContent>
                      {medications.map((medication) => (
                        <SelectItem key={medication.id} value={medication.id}>
                          {medication.name} - {formatCurrency(medication.price)}/{medication.unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dosage">Liều lượng</Label>
                  <Input
                    id="dosage"
                    value={newItem.dosage}
                    onChange={(e) => setNewItem({ ...newItem, dosage: e.target.value })}
                    placeholder="Ví dụ: 1 viên x 3 lần/ngày"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Số lượng</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Đơn vị</Label>
                  <Input
                    id="unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    placeholder="viên, gói, chai..."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="usageNotes">Hướng dẫn sử dụng</Label>
                <Textarea
                  id="usageNotes"
                  value={newItem.usageNotes}
                  onChange={(e) => setNewItem({ ...newItem, usageNotes: e.target.value })}
                  placeholder="Uống sau bữa ăn, tránh ánh sáng..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddItem} disabled={!newItem.medicationId || !newItem.dosage}>
                  Thêm
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prescription items table */}
        {items.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thuốc</TableHead>
                <TableHead>Liều lượng</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead>Thành tiền</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => {
                const medication = getMedicationById(item.medicationId);
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{medication?.name || 'Không tìm thấy'}</div>
                        <div className="text-sm text-gray-500">{medication?.genericName}</div>
                        {item.usageNotes && (
                          <div className="text-sm text-blue-600 mt-1">{item.usageNotes}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.dosage}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>{medication ? formatCurrency(medication.price) : 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(calculateItemTotal(item))}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Chưa có thuốc nào trong đơn
          </div>
        )}

        {/* Total and notes */}
        {items.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="text-lg font-semibold">
                Tổng cộng: {formatCurrency(calculateTotal())}
              </div>
            </div>
            <div>
              <Label htmlFor="prescription-notes">Ghi chú đơn thuốc</Label>
              <Textarea
                id="prescription-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú thêm về đơn thuốc..."
                rows={3}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
