import React, { useState, useEffect } from 'react';
import { Search, Pill, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { medicationService } from '@/api/services/medication.service';
import type { Medication, MedicationCategory } from '@/types';

interface DrugPickerProps {
  onSelect: (medication: Medication) => void;
  selectedMedications?: number[];
  className?: string;
}

const categoryLabels: Record<MedicationCategory, string> = {
  ANTIBIOTIC: 'Kháng sinh',
  ANALGESIC: 'Giảm đau',
  ANTI_INFLAMMATORY: 'Chống viêm',
  VITAMIN: 'Vitamin',
  CARDIOVASCULAR: 'Tim mạch',
  RESPIRATORY: 'Hô hấp',
  GASTROINTESTINAL: 'Tiêu hóa',
  NEUROLOGICAL: 'Thần kinh',
  OTHER: 'Khác'
};

const categoryColors: Record<MedicationCategory, string> = {
  ANTIBIOTIC: 'bg-red-100 text-red-800',
  ANALGESIC: 'bg-blue-100 text-blue-800',
  ANTI_INFLAMMATORY: 'bg-green-100 text-green-800',
  VITAMIN: 'bg-yellow-100 text-yellow-800',
  CARDIOVASCULAR: 'bg-purple-100 text-purple-800',
  RESPIRATORY: 'bg-cyan-100 text-cyan-800',
  GASTROINTESTINAL: 'bg-orange-100 text-orange-800',
  NEUROLOGICAL: 'bg-pink-100 text-pink-800',
  OTHER: 'bg-gray-100 text-gray-800'
};

export function DrugPicker({ onSelect, selectedMedications = [], className }: DrugPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  // Tìm kiếm thuốc
  const searchMedications = async (query: string) => {
    if (query.length < 2) return;
    
    setLoading(true);
    try {
      const results = await medicationService.searchMedications(query, 20);
      setMedications(results);
    } catch (error) {
      console.error('Lỗi tìm kiếm thuốc:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchMedications(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelect = (medication: Medication) => {
    setSelectedMedication(medication);
    onSelect(medication);
    setOpen(false);
    setSearchQuery('');
  };

  const isSelected = (medication: Medication) => {
    return selectedMedications.includes(medication.id);
  };

  return (
    <div className={cn('w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedMedication ? (
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4" />
                <span className="truncate">{selectedMedication.name}</span>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    'text-xs',
                    categoryColors[selectedMedication.category]
                  )}
                >
                  {categoryLabels[selectedMedication.category]}
                </Badge>
              </div>
            ) : (
              <span className="text-muted-foreground">Tìm kiếm thuốc...</span>
            )}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Nhập tên thuốc để tìm kiếm..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {loading && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Đang tìm kiếm...
                </div>
              )}
              {!loading && medications.length === 0 && searchQuery && (
                <CommandEmpty>Không tìm thấy thuốc nào.</CommandEmpty>
              )}
              {!loading && medications.length > 0 && (
                <CommandGroup>
                  {medications.map((medication) => (
                    <CommandItem
                      key={medication.id}
                      value={medication.name}
                      onSelect={() => handleSelect(medication)}
                      disabled={isSelected(medication)}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Pill className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{medication.name}</div>
                          {medication.genericName && (
                            <div className="text-sm text-muted-foreground truncate">
                              {medication.genericName}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                'text-xs',
                                categoryColors[medication.category]
                              )}
                            >
                              {categoryLabels[medication.category]}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {medication.price.toLocaleString('vi-VN')} VNĐ
                            </span>
                          </div>
                        </div>
                      </div>
                      {isSelected(medication) && (
                        <Badge variant="outline" className="text-xs">
                          Đã chọn
                        </Badge>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Hiển thị thông tin thuốc đã chọn */}
      {selectedMedication && (
        <Card className="mt-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Thông tin thuốc
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{selectedMedication.name}</span>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    'text-xs',
                    categoryColors[selectedMedication.category]
                  )}
                >
                  {categoryLabels[selectedMedication.category]}
                </Badge>
              </div>
              
              {selectedMedication.genericName && (
                <div className="text-sm text-muted-foreground">
                  Tên gốc: {selectedMedication.genericName}
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                Giá: {selectedMedication.price.toLocaleString('vi-VN')} VNĐ / {selectedMedication.unit}
              </div>

              {selectedMedication.contraindications && selectedMedication.contraindications.length > 0 && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-amber-700">Chống chỉ định:</div>
                    <ul className="text-xs text-amber-600 mt-1">
                      {selectedMedication.contraindications.map((contraindication, index) => (
                        <li key={index}>• {contraindication}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {selectedMedication.sideEffects && selectedMedication.sideEffects.length > 0 && (
                <div className="text-sm">
                  <div className="font-medium text-orange-700">Tác dụng phụ:</div>
                  <ul className="text-xs text-orange-600 mt-1">
                    {selectedMedication.sideEffects.map((sideEffect, index) => (
                      <li key={index}>• {sideEffect}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
