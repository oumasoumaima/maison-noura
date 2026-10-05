import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CatalogService } from '../core/catalog.service';
import { PhotoKey, STATIC_CATEGORIES, STATIC_PRESTATIONS } from '../core/content';
import { Category, Prestation } from '../core/models';
import { PhotoDirective } from '../core/photo.directive';

interface Group { category: Category; items: Prestation[]; }

/** Photos par catégorie (utilisées en alternance) ; toute nouvelle catégorie retombe sur les photos du salon. */
const CATEGORY_PHOTOS: Record<string, PhotoKey[]> = {
  'Coiffure': ['coiffure', 'coloration'],
  'Soins du visage': ['visage', 'produits'],
  'Ongles': ['manucure', 'vernis'],
  'Hammam & gommage': ['spa'],
  'Maquillage': ['maquillage'],
  'Épilation': ['epilation'],
};
const DEFAULT_PHOTOS: PhotoKey[] = ['salon', 'salon2'];
/** Photo dédiée à un soin précis (prioritaire sur la photo de la catégorie). */
const PRESTATION_PHOTOS: Record<string, PhotoKey> = {
  'Soin à la kératine': 'Soinkeratine',
};

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, DecimalPipe, PhotoDirective],
  template: `
    <div class="container page">
      <div class="section-head">
        <h1>Nos services</h1>
        <hr class="rule">
        <p>Découvrez l'ensemble de nos prestations beauté. <span class="price-note">Les prix sont en dirhams.</span></p>
      </div>

      @for (g of groups(); track g.category.id) {
        <section class="group">
          <h2>{{ g.category.name }}</h2>
          @if (g.category.description) { <p class="muted">{{ g.category.description }}</p> }

          <div class="grid">
            @for (p of g.items; track p.id; let i = $index) {
              <article class="card">
                <div class="photo"><img [appPhoto]="photo(g.category.name, i, p.name)" [alt]="p.name" sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 360px"></div>
                <h3>{{ p.name }}</h3>
                <p class="price">À partir de {{ p.price | number: '1.0-0' }} MAD</p>
                @if (p.description) { <p class="muted">{{ p.description }}</p> }
                <a class="btn btn--outline btn--small" routerLink="/reserver" [queryParams]="{ prestation: p.id }">Réserver</a>
              </article>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: `
    .group { margin-top: 3.5rem; }
    .group:first-of-type { margin-top: 1rem; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem; margin-top: 1.5rem; }
    .card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 1.25rem; }
    .card .photo { aspect-ratio: 4/3; margin-bottom: 1rem; }
    .card h3 { margin-bottom: .15rem; }
    .price { color: var(--green); font-weight: 600; margin-bottom: .4rem; }
    .price-note { color: var(--muted); }
    @media (max-width: 900px) { .grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class ServicesComponent {
  private catalog = inject(CatalogService);
  groups = signal<Group[]>([]);

  photo(categoryName: string, index: number, prestationName?: string): PhotoKey {
    if (prestationName && PRESTATION_PHOTOS[prestationName]) return PRESTATION_PHOTOS[prestationName];
    const list = CATEGORY_PHOTOS[categoryName] ?? DEFAULT_PHOTOS;
    return list[index % list.length];
  }

  constructor() {
    // Tente de charger depuis l'API ; si elle n'est pas disponible, utilise les données statiques
    forkJoin({ categories: this.catalog.categories(), prestations: this.catalog.prestations() }).subscribe({
      next: ({ categories, prestations }) =>
        this.groups.set(
          categories
            .map(category => ({ category, items: prestations.filter(p => p.category.id === category.id) }))
            .filter(g => g.items.length > 0),
        ),
      error: () => {
        // API non disponible → fallback sur les données statiques embarquées
        console.warn('API non disponible, utilisation des données statiques.');
        this.groups.set(
          STATIC_CATEGORIES
            .map(category => ({ category, items: STATIC_PRESTATIONS.filter(p => p.category.id === category.id) }))
            .filter(g => g.items.length > 0),
        );
      },
    });
  }
}
