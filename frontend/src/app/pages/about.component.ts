import { Component } from '@angular/core';
import { TEAM } from '../core/content';
import { PhotoDirective } from '../core/photo.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [PhotoDirective],
  template: `
    <div class="container page">
      <div class="intro">
        <div>
          <h1>À propos de Maison Noura</h1>
          <p>Maison Noura est née d'une passion pour la beauté et le bien-être. Notre mission est de sublimer votre beauté naturelle et de renforcer votre confiance, dans une expérience unique au cœur de Casablanca.</p>

          <div class="values">
            <div><span class="values__icon">✦</span><div><h3>Notre mission</h3><p class="muted">Sublimer votre beauté naturelle et renforcer votre confiance.</p></div></div>
            <div><span class="values__icon">✧</span><div><h3>Notre vision</h3><p class="muted">Devenir la référence des salons de beauté à Casablanca.</p></div></div>
            <div><span class="values__icon">✦</span><div><h3>Nos valeurs</h3><p class="muted">Qualité, écoute, respect et passion.</p></div></div>
          </div>
        </div>
        <div class="photo intro__photo"><img appPhoto="salon" alt="Notre salon" sizes="(max-width: 900px) 100vw, 560px"></div>
      </div>

      <section class="team">
        <div class="section-head">
          <h2>Notre équipe</h2>
          <hr class="rule">
        </div>
        <div class="team__grid">
          @for (m of team; track m.name) {
            <article class="team__card">
              <div class="photo cover" [attr.data-label]="m.name">
                 <img [appPhoto]="$any(m.photo)" [alt]="m.name" sizes="300px">
              </div>
              <h3>{{ m.name }}</h3>
              <p class="muted">{{ m.role }}</p>
            </article>
          }
        </div>
      </section>
    </div>
  `,
  styles: `
    .intro { display: grid; grid-template-columns: 1.1fr 1fr; gap: 3rem; align-items: start; }
    .intro__photo { aspect-ratio: 4/3; }
    .values { display: grid; gap: 1.5rem; margin-top: 2rem; }
    .values > div { display: flex; gap: 1rem; align-items: flex-start; }
    .values h3 { margin-bottom: .2rem; }
    .values p { margin: 0; }
    .values__icon { color: var(--gold); font-size: 1.3rem; line-height: 1.4; }

    .team { margin-top: 5rem; }
    .team__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.75rem; }
    .team__card { text-align: center; }
    .team__card .photo { aspect-ratio: 1; margin-bottom: 1rem; border-radius: 50%; }
    .team__card h3 { margin-bottom: 0; }
    .team__card p { margin: 0; }

    @media (max-width: 900px) {
      .intro { grid-template-columns: 1fr; }
      .team__grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .team__grid { grid-template-columns: 1fr; }
    }
  `,
})
export class AboutComponent {
  team = TEAM;
}
