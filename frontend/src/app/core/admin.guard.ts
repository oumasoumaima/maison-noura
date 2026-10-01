import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

/**
 * Protège /admin : force une connexion Keycloak si nécessaire, puis exige le rôle réaliste "admin".
 * Si la personne est connectée mais n'a pas ce rôle, elle est renvoyée vers l'accueil.
 */
@Injectable({ providedIn: 'root' })
export class AdminGuard extends KeycloakAuthGuard {
  constructor(protected override readonly router: Router, protected readonly keycloak: KeycloakService) {
    super(router, keycloak);
  }

  public async isAccessAllowed(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!this.authenticated) {
      await this.keycloak.login({ redirectUri: window.location.origin + state.url });
      return false;
    }
    if (this.roles.includes('admin')) {
      return true;
    }
    this.router.navigateByUrl('/');
    return false;
  }
}
