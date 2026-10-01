# Intégration Keycloak (option A : un seul rôle "admin")

## Ce qui a changé

### Nouveau
- `keycloak/realm-export.json` — realm "maison-noura" préconfiguré : client public `frontend` (Authorization Code + PKCE),
  rôle réaliste `admin`, un compte de démo `equipe@maisonnoura.ma` / `equipe123`.
- `docker-compose.yml` — service `keycloak` (console admin sur http://localhost:8090, admin/admin), realm importé
  automatiquement au démarrage. Variables `KEYCLOAK_ISSUER_URI` / `KEYCLOAK_JWK_SET_URI` transmises à la Gateway,
  au Catalog Service et au Booking Service.
- `api-gateway/.../SecurityConfig.java`, `catalog-service/.../SecurityConfig.java`, `booking-service/.../SecurityConfig.java`
  — validation du token JWT Keycloak sur chaque service (pas seulement la Gateway : *defense in depth*).
- `frontend/src/app/core/keycloak.config.ts`, `frontend/public/silent-check-sso.html`

### Modifié
- `frontend/src/app/app.config.ts` — initialisation de `keycloak-angular` (mode `check-sso`, silencieux au chargement).
- `frontend/src/app/core/admin.guard.ts` — remplacé par `AdminGuard extends KeycloakAuthGuard` : force une connexion
  Keycloak à l'accès à `/admin`, puis vérifie le rôle réaliste `admin`.
- `frontend/src/app/app.component.ts` — le bouton "Connexion" / "Espace équipe" reflète l'état réel de la session Keycloak.
- `frontend/src/app/pages/login.component.ts` — déclenche une vraie redirection vers l'écran de connexion Keycloak.
- `frontend/src/app/pages/admin.component.ts` — affiche le nom d'utilisateur Keycloak connecté, déconnexion réelle.

### Supprimé
- `frontend/src/app/core/auth.service.ts` (simulation `localStorage`) et `frontend/src/app/pages/signup.component.ts` :
  dans ce modèle, les comptes de l'équipe sont créés par la gérante dans la console d'administration Keycloak,
  pas via une inscription libre sur le site.

## Qui peut faire quoi

| Action | Accès |
|---|---|
| Consulter le catalogue, les créneaux, prendre rendez-vous | Public, sans compte |
| Lister tous les rendez-vous, changer leur statut | Rôle `admin` (token JWT requis) |
| Créer / modifier / supprimer une prestation ou une catégorie | Rôle `admin` (token JWT requis) |

La règle est appliquée **à trois niveaux** : côté Gateway (premier filtre), et à nouveau côté Catalog Service et
Booking Service — un appel qui contournerait la Gateway (port 8081/8082 direct) resterait bloqué.

## Lancer avec Keycloak

```bash
docker compose up --build
```

Au premier démarrage, Keycloak importe le realm automatiquement (`start-dev --import-realm`) : rien à configurer à la main.

- Console d'administration Keycloak : http://localhost:8090 (`admin` / `admin`)
- Compte de démonstration équipe : `equipe@maisonnoura.ma` / `equipe123`

Sur le site (`npx ng serve` dans `frontend/`), clique sur **Connexion** dans l'en-tête : tu es redirigé vers l'écran
de connexion Keycloak (hébergé par Keycloak, pas par Angular), tu te connectes avec le compte de démo, et tu es
ramené automatiquement sur `/admin`.

## Ajouter une vraie employée

Console Keycloak (http://localhost:8090) → realm `maison-noura` → **Users** → **Add user** → renseigner l'email,
onglet **Credentials** pour définir un mot de passe, onglet **Role mapping** → **Assign role** → cocher `admin`.

## Limites de cette démo (à corriger avant une mise en production)

- `KC_HOSTNAME_STRICT: false` et `sslRequired: none` sont pratiques en local mais à durcir en production (HTTPS obligatoire).
- Le compte de démo (`equipe123`) est un mot de passe faible, uniquement pour tester : à supprimer avant toute mise en ligne réelle.
- Pas de validation de l'`audience` du token (simplifié pour la démo) : à ajouter si plusieurs clients Keycloak coexistent un jour.
