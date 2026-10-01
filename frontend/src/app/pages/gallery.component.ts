import { Component, computed, signal } from '@angular/core';
import { GALLERY, GalleryItem } from '../core/content';
import { PhotoDirective } from '../core/photo.directive';

type Filter = GalleryItem['category'] | 'Toutes';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [PhotoDirective],
  template: `
    <div class="container page">
      <div class="section-head">
        <h1>Galerie</h1>
        <hr class="rule">
        <p>Un aperçu de nos réalisations et de notre salon.</p>
      </div>

      <div class="filters" role="group" aria-label="Filtrer la galerie">
        @for (f of filters; track f) {
          <button type="button" class="chip" [class.chip--active]="filter() === f" (click)="filter.set(f)">{{ f }}</button>
        }
      </div>

      <div class="grid">
        @for (g of visible(); track g.label) {
          <div class="photo"><img [appPhoto]="g.photo" [alt]="g.label" sizes="(max-width: 900px) 50vw, 285px"></div>
        }
      </div>
    </div>
  `,
  styles: `
    .filters { display: flex; flex-wrap: wrap; gap: .6rem; justify-content: center; margin-bottom: 2.5rem; }
    .chip { border: 1px solid var(--line); background: #fff; border-radius: 999px; padding: .45rem 1.1rem; cursor: pointer; font: 500 .92rem var(--body); color: var(--ink); }
    .chip--active { background: var(--green); border-color: var(--green); color: #fff; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
    .grid .photo { aspect-ratio: 1; }
    @media (max-width: 900px) { .grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class GalleryComponent {
  all = GALLERY;
  filters: Filter[] = ['Toutes', 'Coiffure', 'Soin visage', 'Manucure', 'Maquillage', 'Salon'];
  filter = signal<Filter>('Toutes');
  visible = computed(() => (this.filter() === 'Toutes' ? this.all : this.all.filter(g => g.category === this.filter())));
}
