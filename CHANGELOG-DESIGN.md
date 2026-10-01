# Refonte design + pages ajoutées

## Fichiers ajoutés
- `frontend/src/app/core/content.ts` — contenu statique (équipe, galerie, blog, avis)
- `frontend/src/app/pages/about.component.ts` — /a-propos
- `frontend/src/app/pages/gallery.component.ts` — /galerie
- `frontend/src/app/pages/blog.component.ts` — /blog
- `frontend/src/app/pages/blog-post.component.ts` — /blog/:slug
- `frontend/src/app/pages/contact.component.ts` — /contact (formulaire + carte OpenStreetMap)
- `frontend/src/app/pages/signup.component.ts` — /inscription

## Fichiers modifiés
- `frontend/src/styles.scss` — nouvelle palette crème / vert profond, polices Cormorant Garamond + Jost
- `frontend/src/index.html` — nouvelles polices Google Fonts
- `frontend/src/app/app.component.ts` — nouveau header (nav complète) + footer 4 colonnes + bouton WhatsApp flottant
- `frontend/src/app/app.routes.ts` — nouvelles routes
- `frontend/src/app/core/auth.service.ts` — login/signup simulés (localStorage), en attendant Keycloak
- `frontend/src/app/pages/home.component.ts` — page d'accueil entièrement refaite (hero, réassurance, "Bienvenue", services phares, pourquoi nous choisir, galerie, témoignages, CTA)
- `frontend/src/app/pages/services.component.ts` — grille de cartes avec vignettes
- `frontend/src/app/pages/login.component.ts` — vrai formulaire email/mot de passe + lien vers l'inscription
- `frontend/src/app/pages/booking.component.ts` — ajustement de couleur des créneaux (variables CSS renommées)

## À savoir
- Les photos du salon sont des **vignettes de substitution** (dégradés + libellé), pas de vraies photos : je n'ai pas utilisé d'images trouvées sur le web pour éviter tout problème de droits sur un vrai site d'entreprise. Remplacez les blocs `<div class="photo photo--N" data-label="...">` par de vraies `<img>` de votre salon dès que vous les avez (la classe `.photo` peut rester pour le cadre/arrondi).
- Connexion et inscription restent **simulées** (stockées dans le `localStorage` du navigateur, sans back-end). Le formulaire de contact affiche juste un message de succès, sans envoyer réellement d'email — il faudra un petit endpoint côté back-end (ou brancher le Notification Service) pour l'envoi réel.
