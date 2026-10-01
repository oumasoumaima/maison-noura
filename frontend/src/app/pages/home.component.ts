import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GALLERY, PhotoKey, TESTIMONIALS } from '../core/content';
import { PhotoDirective } from '../core/photo.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, PhotoDirective],
  template: `
    <!-- Hero -->
    <section class="hero container">
      <div class="hero__text">
        <h1>Révélez votre <span class="accent">beauté</span> naturellement</h1>
        <p class="lead">Un espace dédié à votre bien-être et à votre beauté, au cœur de Casablanca.</p>
        <div class="actions">
          <a class="btn" routerLink="/reserver">Prendre rendez-vous</a>
          <a class="btn btn--outline" routerLink="/services">Découvrir nos services</a>
        </div>
      </div>
      <div class="photo hero__photo"><img appPhoto="salon" alt="Salon Maison Noura" sizes="(max-width: 900px) 100vw, 560px" eager></div>
    </section>

    <!-- Bandeau de réassurance -->
    <section class="container">
      <div class="trust">
        <article><span class="trust__icon">✧</span><h3>Produits de qualité</h3><p class="muted">Nous utilisons des produits sélectionnés avec soin.</p></article>
        <article><span class="trust__icon">✦</span><h3>Experts passionnés</h3><p class="muted">Une équipe professionnelle et à votre écoute.</p></article>
        <article><span class="trust__icon">✧</span><h3>Hygiène &amp; sécurité</h3><p class="muted">Votre santé et votre sécurité sont notre priorité.</p></article>
      </div>
    </section>

    <!-- Bienvenue -->
    <section class="container welcome">
      <div>
        <h2>Bienvenue chez Maison Noura</h2>
        <p>Nous croyons que chaque femme est unique et mérite de se sentir belle et confiante. Notre salon vous offre des soins personnalisés dans un cadre chaleureux et élégant.</p>
        <a class="btn btn--outline" routerLink="/a-propos">En savoir plus</a>
      </div>
      <div class="photo"><img appPhoto="salon2" alt="Notre salon" sizes="(max-width: 900px) 100vw, 560px"></div>
    </section>

    <!-- Services phares -->
    <section class="container page-section">
      <div class="section-head">
        <h2>Nos services phares</h2>
        <hr class="rule">
      </div>
      <div class="grid-6">
        @for (s of featured; track s.name) {
          <a class="mini-card" routerLink="/services">
            <div class="photo"><img [appPhoto]="s.photo" [alt]="s.name" sizes="(max-width: 900px) 50vw, 380px"></div>
            <h3>{{ s.name }}</h3>
            <p class="muted">{{ s.desc }}</p>
            <span class="mini-card__link">Voir les détails →</span>
          </a>
        }
      </div>
    </section>

    <!-- Pourquoi nous choisir -->
    <section class="container page-section">
      <div class="section-head">
        <h2>Pourquoi nous choisir ?</h2>
        <hr class="rule">
      </div>
      <div class="grid-4">
        @for (r of reasons; track r.title) {
          <article class="reason-card">
            <span class="trust__icon">✦</span>
            <h3>{{ r.title }}</h3>
            <p class="muted">{{ r.text }}</p>
          </article>
        }
      </div>
    </section>

    <!-- Galerie (aperçu) -->
    <section class="container page-section">
      <div class="section-head">
        <h2>Galerie</h2>
        <hr class="rule">
      </div>
      <div class="grid-5">
        @for (g of preview; track g.label) {
          <div class="photo"><img [appPhoto]="g.photo" [alt]="g.label" sizes="(max-width: 900px) 33vw, 230px"></div>
        }
      </div>
      <div class="actions actions--center">
        <a class="btn" routerLink="/galerie">Voir toute la galerie</a>
      </div>
    </section>

    <!-- Témoignages -->
    <section class="container page-section">
      <div class="section-head">
        <h2>Témoignages</h2>
        <hr class="rule">
      </div>
      <div class="grid-3">
        @for (t of testimonials; track t.name) {
          <article class="testimonial">
            <p class="stars" aria-hidden="true">★★★★★</p>
            <p>{{ t.text }}</p>
            <p class="testimonial__name">{{ t.name }}</p>
          </article>
        }
      </div>
    </section>

    <!-- CTA finale -->
    <section class="cta">
      <div class="container cta__inner">
        <div>
          <h2 class="cta__title">Prête à prendre soin de vous ?</h2>
          <p class="cta__text">Prenez rendez-vous dès maintenant et offrez-vous une expérience beauté inoubliable.</p>
          <a class="btn btn--light" routerLink="/reserver">Réserver maintenant</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .accent { color: var(--gold); }

    .hero { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; padding-block: 3.5rem 1rem; }
    .hero__photo { aspect-ratio: 4/5; }

    .trust { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; background: var(--cream-soft); border: 1px solid var(--line); border-radius: var(--radius); padding: 2rem; margin-top: 1rem; }
    .trust article { text-align: center; }
    .trust__icon { font-size: 1.6rem; color: var(--gold); }

    .welcome { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; padding-block: 4.5rem; }
    .welcome .photo { aspect-ratio: 4/3; }

    .page-section { padding-block: 1.5rem 4rem; }

    .grid-6 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem; }
    .mini-card { text-decoration: none; color: inherit; display: block; }
    .mini-card .photo { aspect-ratio: 4/3; margin-bottom: 1rem; }
    .mini-card h3 { margin-bottom: .2rem; }
    .mini-card__link { color: var(--green); font-weight: 500; }

    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    .reason-card { text-align: center; background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 1.75rem 1.25rem; }

    .grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; }
    .grid-5 .photo { aspect-ratio: 1; }
    .actions--center { justify-content: center; }

    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .testimonial { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 1.6rem; }
    .testimonial__name { font-weight: 600; color: var(--green); margin: 0; }

    .cta { background: var(--green); color: #fff; padding-block: 4rem; margin-top: 1rem; }
    .cta__inner { max-width: 620px; }
    .cta__title { color: #fff; }
    .cta__text { color: #e2e5da; }

    @media (max-width: 900px) {
      .hero, .welcome { grid-template-columns: 1fr; }
      .grid-6, .grid-4, .grid-3 { grid-template-columns: repeat(2, 1fr); }
      .grid-5 { grid-template-columns: repeat(3, 1fr); }
      .trust { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .grid-6, .grid-4, .grid-3, .grid-5 { grid-template-columns: 1fr; }
    }
  `,
})
export class HomeComponent {
  featured: { name: string; desc: string; photo: PhotoKey }[] = [
    { name: 'Coiffure', desc: 'Coupe, brushing, coloration et soins capillaires.', photo: 'coiffure' },
    { name: 'Soin visage', desc: 'Soins hydratants, anti-âge et éclat du teint.', photo: 'visage' },
    { name: 'Manucure', desc: 'Beauté des mains et pose de vernis.', photo: 'manucure' },
    { name: 'Pédicure', desc: 'Soin des pieds et beauté des ongles.', photo: 'pedicure' },
    { name: 'Maquillage', desc: 'Maquillage jour, soir et mariage.', photo: 'maquillage' },
    { name: 'Épilation', desc: 'Épilation à la cire pour une peau douce.', photo: 'epilation' },
  ];

  reasons = [
    { title: 'Expertise', text: 'Une équipe qualifiée et expérimentée à votre service.' },
    { title: 'Produits premium', text: 'Nous utilisons des produits de haute qualité.' },
    { title: 'Accueil personnalisé', text: 'Chaque cliente est unique, nous prenons le temps de vous écouter.' },
    { title: 'Hygiène & confort', text: "Un salon propre, moderne et respectant les normes." },
  ];

  preview = GALLERY.slice(0, 5);
  testimonials = TESTIMONIALS;
}
