import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <a class="skip-link" href="#contenu">Aller au contenu</a>

    <header class="site-header">
      <div class="container site-header__inner">
       <a routerLink="/" class="brand">
        <img src="/logo-header.svg" alt="Maison Noura - Salon de beauté" class="brand__logo">
      </a>

        <nav aria-label="Navigation principale">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Accueil</a>
          <a routerLink="/a-propos" routerLinkActive="active">À propos</a>
          <a routerLink="/services" routerLinkActive="active">Services</a>
          <a routerLink="/galerie" routerLinkActive="active">Galerie</a>
          <a routerLink="/blog" routerLinkActive="active">Blog</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
        </nav>

        <div class="site-header__actions">
          @if (isLoggedIn()) {
            <a routerLink="/admin" class="btn btn--outline btn--small">Espace équipe</a>
            <button type="button" class="btn btn--outline btn--small" (click)="logout()">Se déconnecter</button>
          } @else {
            <a routerLink="/connexion" class="btn btn--outline btn--small">Connexion</a>
          }
          <a routerLink="/reserver" class="btn btn--small">Prendre rendez-vous</a>
        </div>
      </div>
    </header>

    <main id="contenu"><router-outlet /></main>

    <footer class="site-footer">
      <div class="container footer__grid">
        <div>
          <a routerLink="/" class="brand">
            <img src="logo-footer.svg" alt="Maison Noura - Salon de beauté" class="brand__logo brand__logo--footer">
          </a>
          <p class="footer__tag">Salon de beauté à Casablanca dédié à votre beauté et votre bien-être.</p>
          <div class="footer__social" aria-label="Réseaux sociaux">
            <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">f</a>
            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">ig</a>
            <a href="https://wa.me/212612345678" target="_blank" rel="noopener" aria-label="WhatsApp">wa</a>
          </div>
        </div>

        <div>
          <h3>Liens rapides</h3>
          <a routerLink="/">Accueil</a>
          <a routerLink="/a-propos">À propos</a>
          <a routerLink="/services">Services</a>
          <a routerLink="/galerie">Galerie</a>
          <a routerLink="/blog">Blog</a>
          <a routerLink="/contact">Contact</a>
        </div>

        <div>
          <h3>Nos services</h3>
          <a routerLink="/services">Coiffure</a>
          <a routerLink="/services">Soin visage</a>
          <a routerLink="/services">Manucure</a>
          <a routerLink="/services">Hammam &amp; gommage</a>
        </div>

        <div>
          <h3>Contact</h3>
          <p>+212 6 12 34 56 78</p>
          <p>contact&#64;maisonnoura.ma</p>
          <p>123, Rue des Fleurs, Casablanca, Maroc</p>
          <p>Lun – Sam : 9h00 – 19h00</p>
        </div>
      </div>

      <div class="footer__bottom container">
        <span>&copy; {{ year }} Maison Noura. Tous droits réservés.</span>
      </div>
    </footer>

    <a class="whatsapp-fab" href="https://wa.me/212612345678" target="_blank" rel="noopener" aria-label="Nous contacter sur WhatsApp">
      <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M16 3C9.4 3 4 8.4 4 15c0 2.3.6 4.4 1.8 6.3L4 29l7.9-1.7c1.9 1 3.9 1.6 6.1 1.6 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-2 0-3.9-.5-5.5-1.5l-.4-.2-4.4 1 1-4.3-.3-.4C5.4 17.9 5 16.5 5 15c0-6.1 5-11 11-11s11 4.9 11 11-4.9 11-11 11zm6.1-8.2c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2s-.9 1.1-1.1 1.3-.4.2-.7 0c-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.5.2-.2.2-.3.3-.6.1-.2 0-.5 0-.6 0-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.3 2.4 3.7 5.9 5.1.8.3 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.4z"/>
      </svg>
    </a>
  `,
  styles: `
    .skip-link {
      position: absolute; left: -999px; top: 0; background: var(--green); color: #fff;
      padding: .6rem 1rem; z-index: 100;
      &:focus { left: 1rem; top: 1rem; }
    }

    .site-header { background: var(--cream-soft); border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 20; }
    .site-header__inner { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; padding-block: 1rem; }

    .brand { text-decoration: none; display: grid; line-height: 1.15; }
    .brand__name { font-family: var(--display); font-size: 1.55rem; color: var(--green); }
    .brand__name--light { font-family: var(--display); font-size: 1.4rem; color: #fff; }
    .brand__tag { font-size: .78rem; color: var(--muted); letter-spacing: .3px; }

    nav { display: flex; gap: 1.6rem; flex-wrap: wrap; }
    nav a { text-decoration: none; font-size: .96rem; padding-block: .25rem; border-bottom: 2px solid transparent; color: var(--ink); }
    nav a:hover, nav a.active { border-bottom-color: var(--gold); color: var(--green); }

    .site-header__actions { display: flex; gap: .6rem; align-items: center; }

    .site-footer { background: var(--green-deep); color: #d9d6c9; padding-block: 3.5rem 1.5rem; margin-top: 4rem; }
    .footer__grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1.2fr; gap: 2.5rem; }
    .footer__grid h3 { color: #fff; font-size: 1.1rem; margin-bottom: .9rem; }
    .footer__grid a, .footer__grid p { display: block; text-decoration: none; color: #cfccc0; margin-bottom: .5rem; font-size: .94rem; }
    .footer__grid a:hover { color: #fff; }
    .footer__tag { max-width: 32ch; }
    .footer__social { display: flex; gap: .6rem; margin-top: 1rem; }
    .footer__social a {
      width: 34px; height: 34px; display: grid; place-content: center; border-radius: 50%;
      background: rgba(255,255,255,.08); text-transform: uppercase; font-size: .7rem; margin: 0;
    }
    .footer__bottom { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,.12); font-size: .85rem; color: #b9b6aa; }

    .whatsapp-fab {
      position: fixed; right: 1.5rem; bottom: 1.5rem; width: 54px; height: 54px; border-radius: 50%;
      background: #2fae5b; color: #fff; display: grid; place-content: center; box-shadow: var(--shadow);
      text-decoration: none; z-index: 30;
    }

    @media (max-width: 900px) {
      .footer__grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 700px) {
      .site-header__inner { flex-direction: column; gap: 1rem; }
      nav { width: 100%; overflow-x: auto; justify-content: flex-start; padding-bottom: 0.5rem; flex-wrap: nowrap; -webkit-overflow-scrolling: touch; }
      nav a { white-space: nowrap; }
      .site-header__actions { width: 100%; justify-content: center; flex-wrap: wrap; }
      .footer__grid { grid-template-columns: 1fr; }
    }
  `,
})
export class AppComponent {
  private keycloak = inject(KeycloakService);
  year = new Date().getFullYear();
  isLoggedIn = signal(this.keycloak.isLoggedIn());

  constructor() {
    // Garde l'en-tête à jour après une connexion / déconnexion / expiration de session.
    this.keycloak.keycloakEvents$.subscribe(() => this.isLoggedIn.set(this.keycloak.isLoggedIn()));
  }

  logout() {
    this.keycloak.logout(window.location.origin);
  }
}
