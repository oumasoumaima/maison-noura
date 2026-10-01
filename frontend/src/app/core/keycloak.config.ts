import { environment } from '../../environments/environment';

/** Realm et client Keycloak, tels que définis dans keycloak/realm-export.json. */
export const KEYCLOAK_CONFIG = {
  url: environment.keycloakUrl,
  realm: 'maison-noura',
  clientId: 'frontend',
};
