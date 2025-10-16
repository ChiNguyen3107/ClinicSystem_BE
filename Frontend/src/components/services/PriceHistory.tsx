import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { PriceHistory as PriceHistoryType } from '../../types/service';
import { formatCurrency } from '../../utils/currency';

interface PriceHistoryProps {
  serviceId: string;
  priceHistory: PriceHistoryType[];
  onUpdatePrice: (newPrice: number, effectiveDate: string, reason?: string) => Promise<void>;
  isLoading?: boolean;
}

export const PriceHistory: React.FC<PriceHistoryProps> = ({
  priceHistory,
  onUpdatePrice
}) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [effectiveDate, setEffectiveDate] = useState<Date | undefined>(new Date());
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdatePrice = async () => {
    if (!newPrice || !effectiveDate) return;

    setIsSubmitting(true);
    try {
      await onUpdatePrice(Number(newPrice), effectiveDate.toISOString(), reason || undefined);
      setIsUpdateDialogOpen(false);
      setNewPrice('');
      setReason('');
    } catch (error) {
      console.error('Error updating price:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriceChangeIcon = (oldPrice: number, newPrice: number) => {
    if (newPrice > oldPrice) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else if (newPrice < oldPrice) {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  const getPriceChangeBadge = (oldPrice: number, newPrice: number) => {
    const change = newPrice - oldPrice;
    const percentage = ((change / oldPrice) * 100).toFixed(1);
    
    if (change > 0) {
      return <Badge variant="destructive">+{formatCurrency(change)} (+{percentage}%)</Badge>;
    } else if (change < 0) {
      return <Badge variant="default" className="bg-green-500">-{formatCurrency(Math.abs(change))} (-{percentage}%)</Badge>;
    }
    return <Badge variant="secondary">Không đổi</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lịch sử giá</CardTitle>
            <CardDescription>
              Theo dõi các thay đổi giá của dịch vụ
            </CardDescription>
          </div>
          <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Cập nhật giá</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cập nhật giá dịch vụ</DialogTitle>
                <DialogDescription>
                  Nhập giá mới và ngày áp dụng
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPrice">Giá mới (VND)</Label>
                  <Input
                    id="newPrice"
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Nhập giá mới"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ngày áp dụng</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {effectiveDate ? format(effectiveDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={effectiveDate}
                        onSelect={setEffectiveDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Lý do thay đổi (tùy chọn)</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nhập lý do thay đổi giá"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button 
                    onClick={handleUpdatePrice}
                    disabled={!newPrice || !effectiveDate || isSubmitting}
                  >
                    {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {priceHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có lịch sử thay đổi giá</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày thay đổi</TableHead>
                  <TableHead>Giá cũ</TableHead>
                  <TableHead>Giá mới</TableHead>
                  <TableHead>Thay đổi</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Người thực hiện</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceHistory.map((history, index) => (
                  <TableRow key={history.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {index === 0 && <Badge variant="outline">Hiện tại</Badge>}
                        {format(new Date(history.effectiveDate), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPriceChangeIcon(history.oldPrice, history.newPrice)}
                        {formatCurrency(history.oldPrice)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(history.newPrice)}
                    </TableCell>
                    <TableCell>
                      {getPriceChangeBadge(history.oldPrice, history.newPrice)}
                    </TableCell>
                    <TableCell>
                      {history.reason || '-'}
                    </TableCell>
                    <TableCell>
                      {history.createdBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
