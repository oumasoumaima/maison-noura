# Maison Noura — plateforme de réservation (microservices)

```
Angular (4200) ──► API Gateway (8080) ──┬──► Catalog Service (8081) ── Postgres :5433
                                        └──► Booking Service (8082) ── Postgres :5434
                                                    │  appel HTTP : durée de la prestation
                                                    └──► Catalog Service
                                                    │  événement "booking.*"
                                                    ▼
                                                RabbitMQ (5672 / UI 15672)
                                                    ▼
                                          Notification Service ──► MailHog (UI 8025)
```

## Lancer le backend

Prérequis : Docker.

```bash
docker compose up --build
```

| Élément             | URL                              |
|---------------------|----------------------------------|
| API (via Gateway)   | http://localhost:8080/api        |
| RabbitMQ (guest/guest) | http://localhost:15672        |
| Emails de test (MailHog) | http://localhost:8025       |

Le catalogue est rempli automatiquement avec des soins de démonstration au premier démarrage.

## Lancer le frontend

```bash
cd frontend
npm install
npx ng serve            # http://localhost:4200
```

## Endpoints

| Méthode | Route                              | Rôle                                   |
|---------|------------------------------------|----------------------------------------|
| GET     | /api/categories                    | Liste des catégories                   |
| GET/POST/PUT/DELETE | /api/prestations[/{id}] | CRUD des soins (`?categoryId=` pour filtrer) |
| GET     | /api/slots?date=YYYY-MM-DD&prestationId=1 | Créneaux libres           |
| POST    | /api/appointments                  | Prendre rendez-vous                    |
| GET     | /api/appointments?date=&status=    | Liste (admin)                          |
| PATCH   | /api/appointments/{id}/status      | Confirmer / annuler / terminer (admin) |

## Tester à la main

```bash
curl "http://localhost:8080/api/slots?date=2026-10-05&prestationId=1"

curl -X POST http://localhost:8080/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"prestationId":1,"customerName":"Salma","customerEmail":"salma@example.com","startTime":"2026-10-05T10:00:00"}'

curl -X PATCH http://localhost:8080/api/appointments/1/status \
  -H "Content-Type: application/json" -d '{"status":"CONFIRME"}'
```
Chaque changement de statut envoie un email visible dans MailHog.

## Règles métier du Booking Service

- Horaires, pas des créneaux, jours fermés et **capacité** (nombre de RDV simultanés) : section `booking:` de `booking-service/src/main/resources/application.yml`.
- Un créneau est refusé (409) si la capacité est atteinte ; la vérification est protégée par un verrou PostgreSQL (`pg_advisory_xact_lock`) contre les réservations concurrentes.
- Statuts : `EN_ATTENTE → CONFIRME | ANNULE`, `CONFIRME → TERMINE | ANNULE`. Les autres transitions renvoient 409.
- Le Booking Service publie sur RabbitMQ sans connaître le Notification Service.

## Suite logique

1. **Keycloak** : ajouter un conteneur, valider les JWT dans la Gateway (`spring-boot-starter-oauth2-resource-server`), protéger `/api/appointments` (GET, PATCH) et les écritures sur `/api/prestations`, puis remplacer `AuthService` par `keycloak-angular`.
2. **Review Service** : avis liés à un RDV `TERMINE`.
3. **Flyway** à la place de `ddl-auto: update`, tests d'intégration avec Testcontainers (Postgres + RabbitMQ).
4. Pattern *transactional outbox* pour ne jamais perdre un événement si RabbitMQ est indisponible.
