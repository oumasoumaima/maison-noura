import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from './api';
import { Category, Prestation, PrestationInput } from './models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);

  categories() {
    return this.http.get<Category[]>(`${API_URL}/categories`);
  }

  prestations() {
    return this.http.get<Prestation[]>(`${API_URL}/prestations`);
  }

  createPrestation(body: PrestationInput) {
    return this.http.post<Prestation>(`${API_URL}/prestations`, body);
  }

  deletePrestation(id: number) {
    return this.http.delete<void>(`${API_URL}/prestations/${id}`);
  }
}
