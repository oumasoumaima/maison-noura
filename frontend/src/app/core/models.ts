export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Prestation {
  id: number;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  imageUrl?: string;
  category: Category;
}

export interface PrestationInput {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  categoryId: number;
  imageUrl?: string;
}

export type AppointmentStatus = 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE' | 'TERMINE';

export interface Appointment {
  id: number;
  prestationId: number;
  prestationName: string;
  durationMinutes: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface CreateAppointment {
  prestationId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  startTime: string;
}

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  EN_ATTENTE: 'En attente',
  CONFIRME: 'Confirmé',
  ANNULE: 'Annulé',
  TERMINE: 'Terminé',
};
