import { Component, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="container narrow page">
      <h1>Espace équipe</h1>
      <p class="lead">
        Cette section est réservée à l'équipe Maison Noura : gestion des rendez-vous et de la carte des soins.
      </p>
      <p>La connexion se fait via notre système d'authentification sécurisé (Keycloak).</p>
      <button class="btn" type="button" (click)="login()">Se connecter</button>

      <p class="notice">
        Les comptes de l'équipe sont créés par la gérante depuis la console Keycloak — il n'y a pas d'inscription
        libre. Pour la démonstration : identifiant <strong>equipe&#64;maisonnoura.ma</strong>, mot de passe
        <strong>equipe123</strong>.
      </p>
    </div>
  `,
})
export class LoginComponent {
  private keycloak = inject(KeycloakService);

  login() {
    this.keycloak.login({ redirectUri: window.location.origin + '/admin' });
  }
}
