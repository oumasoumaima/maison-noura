import { ApplicationConfig, APP_INITIALIZER, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { KeycloakAngularModule, KeycloakBearerInterceptor, KeycloakService } from 'keycloak-angular';

import { routes } from './app.routes';
import { KEYCLOAK_CONFIG } from './core/keycloak.config';

registerLocaleData(localeFr);

/**
 * "check-sso" : au chargement, on vérifie discrètement (iframe cachée) si une session Keycloak
 * existe déjà, sans forcer de redirection. La connexion réelle n'est demandée que lorsqu'on
 * essaie d'accéder à /admin (voir AdminGuard).
 */
function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: KEYCLOAK_CONFIG,
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
      },
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),   // nécessaire : KeycloakBearerInterceptor est un intercepteur "classique" (DI)
    { provide: LOCALE_ID, useValue: 'fr' },
    importProvidersFrom(KeycloakAngularModule),
    { provide: HTTP_INTERCEPTORS, useClass: KeycloakBearerInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: initializeKeycloak, multi: true, deps: [KeycloakService] },
  ],
};
