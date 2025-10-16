import React from 'react';
import { AlertTriangle, X, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/utils/cn';
import type { MedicationInteraction } from '@/types';

interface InteractionAlertProps {
  interactions: MedicationInteraction[];
  onDismiss?: () => void;
  className?: string;
}

const severityLabels = {
  LOW: 'Thấp',
  MODERATE: 'Trung bình',
  HIGH: 'Cao',
  SEVERE: 'Nghiêm trọng'
};

const severityColors = {
  LOW: 'bg-green-100 text-green-800 border-green-200',
  MODERATE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  SEVERE: 'bg-red-100 text-red-800 border-red-200'
};

const severityIcons = {
  LOW: '🟢',
  MODERATE: '🟡',
  HIGH: '🟠',
  SEVERE: '🔴'
};

export function InteractionAlert({ interactions, onDismiss, className }: InteractionAlertProps) {
  if (interactions.length === 0) {
    return null;
  }

  const sortedInteractions = [...interactions].sort((a, b) => {
    const severityOrder = { SEVERE: 4, HIGH: 3, MODERATE: 2, LOW: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });

  const hasSevereInteractions = interactions.some(i => i.severity === 'SEVERE' || i.severity === 'HIGH');

  return (
    <div className={cn('space-y-3', className)}>
      {sortedInteractions.map((interaction, index) => (
        <Alert
          key={interaction.id}
          className={cn(
            'border-l-4',
            severityColors[interaction.severity],
            hasSevereInteractions && 'animate-pulse'
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {severityIcons[interaction.severity]}
            </div>
            <div className="flex-1 min-w-0">
              <AlertTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Tương tác thuốc - Mức độ {severityLabels[interaction.severity]}
                <Badge 
                  variant="outline" 
                  className={cn(
                    'text-xs',
                    severityColors[interaction.severity]
                  )}
                >
                  {severityLabels[interaction.severity]}
                </Badge>
              </AlertTitle>
              
              <AlertDescription className="mt-2">
                <div className="space-y-2">
                  <div className="font-medium">
                    {interaction.medication1.name} ↔ {interaction.medication2.name}
                  </div>
                  
                  <div className="text-sm">
                    <strong>Mô tả:</strong> {interaction.description}
                  </div>
                  
                  <div className="text-sm">
                    <strong>Khuyến nghị:</strong> {interaction.recommendation}
                  </div>
                </div>
              </AlertDescription>
            </div>
            
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="flex-shrink-0 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Alert>
      ))}

      {/* Tổng kết */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            Tổng kết tương tác
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-600">🟢</span>
              <span>Thấp: {interactions.filter(i => i.severity === 'LOW').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">🟡</span>
              <span>Trung bình: {interactions.filter(i => i.severity === 'MODERATE').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-600">🟠</span>
              <span>Cao: {interactions.filter(i => i.severity === 'HIGH').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-600">🔴</span>
              <span>Nghiêm trọng: {interactions.filter(i => i.severity === 'SEVERE').length}</span>
            </div>
          </div>
          
          {hasSevereInteractions && (
            <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded-md">
              <div className="text-sm text-red-800 font-medium">
                ⚠️ Cảnh báo: Có tương tác nghiêm trọng! Vui lòng xem xét lại đơn thuốc.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface InteractionSummaryProps {
  interactions: MedicationInteraction[];
  className?: string;
}

export function InteractionSummary({ interactions, className }: InteractionSummaryProps) {
  if (interactions.length === 0) {
    return (
      <div className={cn('text-sm text-green-600 flex items-center gap-2', className)}>
        <span>✅</span>
        <span>Không có tương tác thuốc</span>
      </div>
    );
  }

  const severeCount = interactions.filter(i => i.severity === 'SEVERE' || i.severity === 'HIGH').length;
  const totalCount = interactions.length;

  return (
    <div className={cn('text-sm flex items-center gap-2', className)}>
      {severeCount > 0 ? (
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <span>{severeCount} tương tác nghiêm trọng</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-amber-600">
          <AlertTriangle className="h-4 w-4" />
          <span>{totalCount} tương tác</span>
        </div>
      )}
    </div>
  );
}
