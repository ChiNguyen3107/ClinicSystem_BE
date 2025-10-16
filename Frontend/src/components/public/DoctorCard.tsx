import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Clock } from 'lucide-react';
import { PublicDoctor } from '@/types/public';
import { formatCurrency } from '@/utils/currency';

interface DoctorCardProps {
  doctor: PublicDoctor;
  onBookAppointment: (doctorId: string) => void;
  onViewProfile: (doctorId: string) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onBookAppointment,
  onViewProfile
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvailabilityStatus = () => {
    if (!doctor.isAvailable) {
      return { text: 'Không khả dụng', variant: 'destructive' as const };
    }
    return { text: 'Có thể đặt lịch', variant: 'default' as const };
  };

  const availability = getAvailabilityStatus();

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={doctor.avatar} alt={doctor.fullName} />
            <AvatarFallback>{getInitials(doctor.fullName)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{doctor.fullName}</h3>
            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{doctor.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({doctor.totalReviews})</span>
              </div>
              <Badge variant={availability.variant} className="text-xs">
                {availability.text}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {doctor.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {doctor.bio}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{doctor.experience} năm kinh nghiệm</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Phí khám:</span>
            <span className="text-primary font-semibold">
              {formatCurrency(doctor.consultationFee)}
            </span>
          </div>
        </div>

        {doctor.languages && doctor.languages.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {doctor.languages.map((language, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {language}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProfile(doctor.id)}
            className="flex-1"
          >
            Xem hồ sơ
          </Button>
          <Button
            size="sm"
            onClick={() => onBookAppointment(doctor.id)}
            disabled={!doctor.isAvailable}
            className="flex-1"
          >
            Đặt lịch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
