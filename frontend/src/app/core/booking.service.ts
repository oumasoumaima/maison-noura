import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from './api';
import { Appointment, AppointmentStatus, CreateAppointment } from './models';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);

  /** Créneaux libres ("09:00:00", ...) pour une date (YYYY-MM-DD) et une prestation. */
  slots(date: string, prestationId: number) {
    const params = new HttpParams().set('date', date).set('prestationId', prestationId);
    return this.http.get<string[]>(`${API_URL}/slots`, { params });
  }

  create(body: CreateAppointment) {
    return this.http.post<Appointment>(`${API_URL}/appointments`, body);
  }

  list(date?: string, status?: string) {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    if (status) params = params.set('status', status);
    return this.http.get<Appointment[]>(`${API_URL}/appointments`, { params });
  }

  updateStatus(id: number, status: AppointmentStatus) {
    return this.http.patch<Appointment>(`${API_URL}/appointments/${id}/status`, { status });
  }
}
