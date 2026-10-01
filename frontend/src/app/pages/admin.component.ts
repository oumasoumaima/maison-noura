import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { BookingService } from '../core/booking.service';
import { CatalogService } from '../core/catalog.service';
import { Appointment, AppointmentStatus, Category, Prestation, STATUS_LABELS } from '../core/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, DatePipe, DecimalPipe],
  template: `
    <div class="container page">
      <div class="head">
        <div>
          <h1>Espace équipe</h1>
          <p class="muted">Connectée en tant que {{ username() }}</p>
        </div>
        <button class="btn btn--ghost btn--small" (click)="logout()">Se déconnecter</button>
      </div>

      @if (error()) { <p class="notice notice--error" role="alert">{{ error() }}</p> }

      <section>
        <h2>Rendez-vous</h2>
        <div class="filters">
          <div class="field">
            <label for="fdate">Date</label>
            <input id="fdate" type="date" [(ngModel)]="filterDate" (ngModelChange)="loadAppointments()">
          </div>
          <div class="field">
            <label for="fstatus">Statut</label>
            <select id="fstatus" [(ngModel)]="filterStatus" (ngModelChange)="loadAppointments()">
              <option value="">Tous</option>
              @for (s of statuses; track s) { <option [value]="s">{{ labels[s] }}</option> }
            </select>
          </div>
        </div>

        @if (appointments().length === 0) {
          <p class="muted">Aucun rendez-vous pour ces filtres.</p>
        } @else {
          <div class="table-wrap">
            <table>
              <thead><tr><th>Quand</th><th>Cliente</th><th>Soin</th><th>Statut</th><th>Actions</th></tr></thead>
              <tbody>
                @for (a of appointments(); track a.id) {
                  <tr>
                    <td>{{ a.startTime | date: 'EEE d MMM, HH:mm' }}</td>
                    <td>{{ a.customerName }}<br><span class="muted">{{ a.customerEmail }}</span></td>
                    <td>{{ a.prestationName }}<br><span class="muted">{{ a.durationMinutes }} min</span></td>
                    <td><span class="badge" [class]="'badge badge--' + a.status">{{ labels[a.status] }}</span></td>
                    <td>
                      @for (action of actions[a.status]; track action.to) {
                        <button class="btn btn--ghost btn--small" (click)="changeStatus(a, action.to)">{{ action.label }}</button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <section class="block">
        <h2>Carte des soins</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Image</th><th>Soin</th><th>Catégorie</th><th>Durée</th><th>Prix</th><th></th></tr></thead>
            <tbody>
              @for (p of prestations(); track p.id) {
                <tr>
                  <td>@if (p.imageUrl) { <img [src]="p.imageUrl" alt="" style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px;"> }</td>
                  <td>{{ p.name }}</td>
                  <td>{{ p.category.name }}</td>
                  <td>{{ p.durationMinutes }} min</td>
                  <td>{{ p.price | number: '1.0-0' }} MAD</td>
                  <td><button class="btn btn--ghost btn--small" (click)="remove(p)">Supprimer</button></td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <h3 class="add-title">Ajouter un soin</h3>
        <form class="add" (ngSubmit)="add()" #f="ngForm">
          <div class="field"><label for="n">Nom</label><input id="n" name="n" [(ngModel)]="draft.name" required></div>
          <div class="field">
            <label for="c">Catégorie</label>
            <select id="c" name="c" [(ngModel)]="draft.categoryId" required>
              <option [ngValue]="null" disabled>Choisir</option>
              @for (c of categories(); track c.id) { <option [ngValue]="c.id">{{ c.name }}</option> }
            </select>
          </div>
          <div class="field"><label for="d">Durée (min)</label><input id="d" name="d" type="number" min="5" step="5" [(ngModel)]="draft.durationMinutes" required></div>
          <div class="field"><label for="p">Prix (MAD)</label><input id="p" name="p" type="number" min="1" [(ngModel)]="draft.price" required></div>
          <div class="field"><label for="img">URL Image</label><input id="img" name="img" [(ngModel)]="draft.imageUrl"></div>
          <div class="field field--wide"><label for="desc">Description</label><input id="desc" name="desc" [(ngModel)]="draft.description"></div>
          <button class="btn" type="submit" [disabled]="f.invalid">Ajouter le soin</button>
        </form>
      </section>
    </div>
  `,
  styles: `
    .head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
    .filters { display: flex; gap: 1rem; flex-wrap: wrap; max-width: 480px; }
    .filters .field { flex: 1 1 180px; }
    .block { margin-top: 4rem; }
    .add-title { margin-top: 2rem; }
    .add { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0 1rem; align-items: end; }
    .field--wide { grid-column: 1 / -1; }
    .add .btn { justify-self: start; margin-bottom: 1.1rem; }
  `,
})
export class AdminComponent {
  private booking = inject(BookingService);
  private catalog = inject(CatalogService);
  private keycloak = inject(KeycloakService);

  username = signal('équipe');

  readonly labels = STATUS_LABELS;
  readonly statuses = Object.keys(STATUS_LABELS) as AppointmentStatus[];
  /** Transitions proposées, alignées sur la machine à états du Booking Service. */
  readonly actions: Record<AppointmentStatus, { label: string; to: AppointmentStatus }[]> = {
    EN_ATTENTE: [{ label: 'Confirmer', to: 'CONFIRME' }, { label: 'Refuser', to: 'ANNULE' }],
    CONFIRME: [{ label: 'Terminer', to: 'TERMINE' }, { label: 'Annuler', to: 'ANNULE' }],
    ANNULE: [],
    TERMINE: [],
  };

  appointments = signal<Appointment[]>([]);
  prestations = signal<Prestation[]>([]);
  categories = signal<Category[]>([]);
  error = signal<string | null>(null);

  filterDate = '';
  filterStatus = '';
  draft = { name: '', description: '', price: 0, durationMinutes: 30, categoryId: null as number | null, imageUrl: '' };

  constructor() {
    try {
      if (this.keycloak.isLoggedIn()) {
        this.username.set(this.keycloak.getUsername());
      }
    } catch (e) {
      // ignore
    }
    this.loadAppointments();
    this.loadCatalog();
  }

  loadAppointments() {
    this.booking.list(this.filterDate, this.filterStatus).subscribe({
      next: list => this.appointments.set(list),
      error: () => this.error.set('Impossible de charger les rendez-vous.'),
    });
  }

  loadCatalog() {
    this.catalog.prestations().subscribe(list => this.prestations.set(list));
    this.catalog.categories().subscribe(list => this.categories.set(list));
  }

  changeStatus(a: Appointment, status: AppointmentStatus) {
    this.error.set(null);
    this.booking.updateStatus(a.id, status).subscribe({
      next: () => this.loadAppointments(),
      error: err => this.error.set(err.error?.message ?? 'Changement de statut impossible.'),
    });
  }

  add() {
    if (this.draft.categoryId == null) return;
    this.catalog
      .createPrestation({
        name: this.draft.name,
        description: this.draft.description || undefined,
        price: this.draft.price,
        durationMinutes: this.draft.durationMinutes,
        categoryId: this.draft.categoryId,
        imageUrl: this.draft.imageUrl || undefined,
      })
      .subscribe({
        next: () => {
          this.draft = { name: '', description: '', price: 0, durationMinutes: 30, categoryId: null, imageUrl: '' };
          this.loadCatalog();
        },
        error: err => this.error.set(err.error?.message ?? "Ajout impossible."),
      });
  }

  remove(p: Prestation) {
    if (!confirm(`Supprimer « ${p.name} » de la carte ?`)) return;
    this.catalog.deletePrestation(p.id).subscribe({
      next: () => this.loadCatalog(),
      error: err => this.error.set(err.error?.message ?? 'Suppression impossible.'),
    });
  }

  logout() {
    this.keycloak.logout(window.location.origin);
  }
}
