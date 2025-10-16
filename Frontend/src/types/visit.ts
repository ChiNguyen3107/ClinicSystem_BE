export interface Visit {
  id: string;
  visitCode: string;
  patientId: string;
  patient: {
    id: string;
    fullName: string;
    dateOfBirth: string;
    phoneNumber: string;
    address: string;
  };
  doctorId: string;
  doctor: {
    id: string;
    fullName: string;
    specialization: string;
    phoneNumber: string;
  };
  appointmentId?: string;
  visitDate: string;
  preliminaryDx: string; // Chẩn đoán sơ bộ
  symptoms: string;
  clinicalNotes: string;
  status: VisitStatus;
  createdAt: string;
  updatedAt: string;
}

export type VisitStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface VisitFilter {
  doctorId?: string;
  status?: VisitStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface CreateVisitRequest {
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  preliminaryDx: string;
  symptoms: string;
  clinicalNotes: string;
}

export interface UpdateVisitRequest {
  preliminaryDx?: string;
  symptoms?: string;
  clinicalNotes?: string;
  status?: VisitStatus;
}
