import { booleanAttribute, Directive, Input } from '@angular/core';
import { PHOTOS, PhotoKey, photoSrc } from './content';

/** Affiche une photo du catalogue PHOTOS : <img [appPhoto]="'salon'" sizes="50vw" alt="…"> */
@Directive({
  selector: 'img[appPhoto]',
  standalone: true,
  host: {
    '[attr.src]': 'src',
    '[attr.srcset]': 'srcset',
    '[attr.sizes]': 'sizes',
    '[attr.alt]': 'alt ?? defaultAlt',
    '[attr.loading]': 'eager ? "eager" : "lazy"',
    '[attr.fetchpriority]': 'eager ? "high" : null',
    decoding: 'async',
  },
})
export class PhotoDirective {
  @Input({ required: true }) appPhoto!: PhotoKey;
  @Input() alt?: string;
  @Input() sizes = '(max-width: 900px) 100vw, 400px';
  /** À activer pour l'image du haut de page (chargement immédiat). */
  @Input({ transform: booleanAttribute }) eager = false;

  get src() { return photoSrc(this.appPhoto, 800); }
  get srcset() { return [400, 800, 1200, 1600].map(w => `${photoSrc(this.appPhoto, w)} ${w}w`).join(', '); }
  get defaultAlt() { return PHOTOS[this.appPhoto].alt; }
}
