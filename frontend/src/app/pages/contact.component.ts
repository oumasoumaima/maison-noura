import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container page">
      <div class="section-head">
        <h1>Contactez-nous</h1>
        <hr class="rule">
        <p>Nous sommes là pour répondre à toutes vos questions. N'hésitez pas à nous contacter.</p>
      </div>

      <div class="grid">
        <div class="info">
          <div class="info__row"><strong>Téléphone</strong><span>+212 6 12 34 56 78</span></div>
          <div class="info__row"><strong>Email</strong><span>contact&#64;maisonnoura.ma</span></div>
          <div class="info__row"><strong>Adresse</strong><span>123, Rue des Fleurs, Casablanca, Maroc</span></div>
          <div class="info__row"><strong>Horaires</strong><span>Lun – Sam : 9h00 – 19h00</span></div>
        </div>

        <form class="card" (ngSubmit)="submit()" #f="ngForm">
          <h2>Envoyez-nous un message</h2>
          @if (sent()) {
            <p class="notice notice--success">Votre message a bien été envoyé. Nous vous répondrons rapidement.</p>
          } @else {
            <div class="field"><label for="name">Nom complet</label><input id="name" name="name" [(ngModel)]="form.name" required></div>
            <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" [(ngModel)]="form.email" required email></div>
            <div class="field"><label for="subject">Sujet</label><input id="subject" name="subject" [(ngModel)]="form.subject" required></div>
            <div class="field"><label for="message">Votre message</label><textarea id="message" name="message" [(ngModel)]="form.message" required></textarea></div>
            <button class="btn" type="submit" [disabled]="f.invalid">Envoyer ma demande</button>
          }
        </form>
      </div>

      <div class="map">
        <iframe title="Localisation de Maison Noura à Casablanca"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-7.6298%2C33.5731%2C-7.5898%2C33.6031&layer=mapnik&marker=33.5881%2C-7.6098"
                loading="lazy"></iframe>
      </div>
    </div>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 3rem; margin-top: 1rem; }
    .info__row { padding-block: 1rem; border-bottom: 1px solid var(--line); }
    .info__row strong { display: block; color: var(--green); margin-bottom: .2rem; }
    .card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 2rem; }
    .card h2 { margin-bottom: 1.2rem; }
    .map { margin-top: 3rem; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--line); }
    .map iframe { width: 100%; height: 340px; border: 0; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class ContactComponent {
  form = { name: '', email: '', subject: '', message: '' };
  sent = signal(false);

  submit() {
    // Démonstration : aucun back-end de messagerie n'existe encore pour ce formulaire.
    // À brancher plus tard sur un petit endpoint (ex. Notification Service) qui enverrait l'email.
    this.sent.set(true);
  }
}
