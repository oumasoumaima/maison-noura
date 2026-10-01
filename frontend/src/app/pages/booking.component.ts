import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService } from '../core/booking.service';
import { CatalogService } from '../core/catalog.service';
import { Appointment, Prestation } from '../core/models';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule, DatePipe, RouterLink],
  template: `
    <div class="container narrow page">
      @if (confirmed(); as a) {
        <h1>Demande envoyée</h1>
        <p class="lead">
          {{ a.prestationName }}, le {{ a.startTime | date: 'EEEE d MMMM à HH\\'h\\'mm' }}.
        </p>
        <p>Un email de confirmation est envoyé à {{ a.customerEmail }}. Nous validons votre rendez-vous très vite.</p>
        <div class="actions">
          <a class="btn" routerLink="/services">Retour aux soins</a>
        </div>
      } @else {
        <h1>Réserver un soin</h1>

        <form (ngSubmit)="submit()" #f="ngForm">
          <fieldset>
            <legend>Votre soin</legend>
            <div class="field">
              <label for="prestation">Soin</label>
              <select id="prestation" name="prestation" [ngModel]="prestationId()" (ngModelChange)="onPrestation($event)" required>
                <option [ngValue]="null" disabled>Choisir un soin</option>
                @for (p of prestations(); track p.id) {
                  <option [ngValue]="p.id">{{ p.name }} ({{ p.durationMinutes }} min)</option>
                }
              </select>
            </div>
          </fieldset>

          <fieldset>
            <legend>Date et heure</legend>
            <div class="field">
              <label for="date">Date</label>
              <input id="date" name="date" type="date" [min]="minDate" [ngModel]="date()" (ngModelChange)="onDate($event)" required>
            </div>

            @if (!prestationId()) {
              <p class="muted">Choisissez un soin pour voir les créneaux libres.</p>
            } @else if (loadingSlots()) {
              <p class="muted">Recherche des créneaux…</p>
            } @else if (slots().length === 0) {
              <p class="notice">Aucun créneau libre ce jour-là. Essayez une autre date (le salon est fermé le dimanche).</p>
            } @else {
              <div class="slots" role="group" aria-label="Créneaux disponibles">
                @for (s of slots(); track s) {
                  <button type="button" class="slot" [attr.aria-pressed]="slot() === s" (click)="slot.set(s)">{{ s }}</button>
                }
              </div>
            }
          </fieldset>

          <fieldset>
            <legend>Vos coordonnées</legend>
            <div class="field">
              <label for="name">Nom complet</label>
              <input id="name" name="name" autocomplete="name" [(ngModel)]="customer.name" required>
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" [(ngModel)]="customer.email" required email>
            </div>
            <div class="field">
              <label for="phone">Téléphone (facultatif)</label>
              <input id="phone" name="phone" type="tel" autocomplete="tel" [(ngModel)]="customer.phone">
            </div>
          </fieldset>

          @if (error()) { <p class="notice notice--error" role="alert">{{ error() }}</p> }

          <button class="btn" type="submit" [disabled]="f.invalid || !slot() || submitting()">
            {{ submitting() ? 'Envoi en cours…' : 'Envoyer ma demande' }}
          </button>
        </form>
      }
    </div>
  `,
  styles: `
    .slots { display: flex; flex-wrap: wrap; gap: .5rem; }
    .slot { font: 500 1rem var(--body); padding: .55rem 1.1rem; border: 1px solid var(--green); border-radius: 999px; background: transparent; color: var(--green); cursor: pointer; }
    .slot:hover { background: var(--cream-soft); }
    .slot[aria-pressed='true'] { background: var(--green); color: #fff; }
  `,
})
export class BookingComponent {
  private catalog = inject(CatalogService);
  private booking = inject(BookingService);
  private route = inject(ActivatedRoute);

  prestations = signal<Prestation[]>([]);
  prestationId = signal<number | null>(null);
  date = signal(this.today());
  slots = signal<string[]>([]);
  slot = signal<string | null>(null);
  loadingSlots = signal(false);
  submitting = signal(false);
  error = signal<string | null>(null);
  confirmed = signal<Appointment | null>(null);

  minDate = this.today();
  customer = { name: '', email: '', phone: '' };

  constructor() {
    this.catalog.prestations().subscribe({
      next: list => {
        this.prestations.set(list);
        const preset = Number(this.route.snapshot.queryParamMap.get('prestation'));
        if (preset && list.some(p => p.id === preset)) {
          this.prestationId.set(preset);
          this.loadSlots();
        }
      },
      error: () => this.error.set("Impossible de charger les soins. Vérifiez que l'API est démarrée."),
    });
  }

  onPrestation(id: number | null) {
    this.prestationId.set(id);
    this.loadSlots();
  }

  onDate(date: string) {
    this.date.set(date);
    this.loadSlots();
  }

  loadSlots() {
    const id = this.prestationId();
    const date = this.date();
    this.slot.set(null);
    this.slots.set([]);
    if (!id || !date) return;

    this.loadingSlots.set(true);
    this.booking.slots(date, id).subscribe({
      next: list => {
        this.slots.set(list.map(t => t.slice(0, 5)));   // "09:00:00" -> "09:00"
        this.loadingSlots.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les créneaux. Réessayez dans un instant.');
        this.loadingSlots.set(false);
      },
    });
  }

  submit() {
    const id = this.prestationId();
    const slot = this.slot();
    if (!id || !slot) return;

    this.submitting.set(true);
    this.error.set(null);
    this.booking
      .create({
        prestationId: id,
        customerName: this.customer.name,
        customerEmail: this.customer.email,
        customerPhone: this.customer.phone || undefined,
        startTime: `${this.date()}T${slot}`,
      })
      .subscribe({
        next: appointment => {
          this.confirmed.set(appointment);
          this.submitting.set(false);
        },
        error: err => {
          this.submitting.set(false);
          this.error.set(err.error?.message ?? 'Une erreur est survenue. Réessayez.');
          this.loadSlots();   // le créneau a peut-être été pris entre-temps
        },
      });
  }

  private today(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
}
