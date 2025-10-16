export interface Visit {
  id: number;
  patient: {
    id: number;
    code: string;
    fullName: string;
    phone: string;
  };
  primaryAppointment: {
    id: number;
    scheduledAt: string;
    doctor: {
      id: number;
      specialty: string;
      account: {
        id: number;
        fullName: string;
      };
    };
  };
  provisionalDiagnosis?: string;
  clinicalNote?: string;
  status: VisitStatus;
  createdAt: string;
  updatedAt: string;
}

export enum VisitStatus {
  OPEN = 'OPEN',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface VisitFilter {
  doctorId?: string;
  status?: VisitStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface CreateVisitRequest {
  patientId: number;
  primaryAppointmentId: number;
  provisionalDiagnosis?: string;
  clinicalNote?: string;
}

export interface UpdateVisitRequest {
  provisionalDiagnosis?: string;
  clinicalNote?: string;
  status?: VisitStatus;
}
