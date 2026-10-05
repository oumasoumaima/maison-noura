/** Contenu éditorial statique (équipe, galerie, blog, avis). À terme, ceci pourrait venir d'un service dédié. */

/**
 * Photos Unsplash (Unsplash License : usage commercial libre, attribution non obligatoire).
 * Chaque entrée garde la page d'origine et le photographe pour pouvoir la remplacer ou la créditer.
 */
export type PhotoKey = 'salon' | 'salon2' | 'coiffure' | 'coloration' | 'visage' | 'produits' | 'manucure' | 'vernis' | 'maquillage' | 'spa' | 'team-1' | 'team-2' | 'team-3' | 'team-4' | 'epilation' | 'pedicure'  | 'Soinkeratine';
export interface PhotoDef { id: string; alt: string; credit: string; page: string; }
export const PHOTOS: Record<PhotoKey, PhotoDef> = {
  salon:      { id: 'salon', alt: 'Fauteuils de salon face à un grand miroir', credit: 'Guilherme Petri', page: '' },
  salon2:     { id: 'salon2', alt: 'Salon de coiffure moderne aux miroirs ronds', credit: 'Benyamin Bohlouli', page: '' },
  coiffure:   { id: 'coiffure', alt: 'Brushing avec sèche-cheveux et brosse ronde', credit: 'Adam Winger', page: '' },
  coloration: { id: 'coloration', alt: 'Cliente en cours de coiffure au salon', credit: 'Vinicius Amano', page: '' },
  visage:     { id: 'visage', alt: 'Soin du visage avec masque en institut', credit: 'Rosa Rafael', page: '' },
  produits:   { id: 'produits', alt: 'Flacons de soin et bougie sur un plateau en marbre', credit: 'Johanne Pold Jacobsen', page: '' },
  manucure:   { id: 'manucure', alt: 'Manucure en cours dans un institut', credit: 'Giorgio Trovato', page: '' },
  vernis:     { id: 'vernis', alt: 'Ongles roses manucurés', credit: 'Chelson Tamares', page: '' },
  maquillage: { id: 'maquillage', alt: 'Séance de maquillage au pinceau', credit: 'LOLA AZIZADA', page: '' },
  spa:        { id: 'spa', alt: 'Massage aux pierres chaudes et fleurs blanches', credit: 'engin akyurt', page: '' },
  'team-1':   { id: 'team-1', alt: 'Noura - Fondatrice', credit: '', page: '' },
  'team-2':   { id: 'team-2', alt: 'Sara - Coiffure', credit: '', page: '' },
  'team-3':   { id: 'team-3', alt: 'Meryem - Esthéticienne', credit: '', page: '' },
  'team-4':   { id: 'team-4', alt: 'Laila - Make-up', credit: '', page: '' },
  epilation:  { id: 'epilation', alt: 'Épilation', credit: '', page: '' },
  pedicure:   { id: 'pedicure', alt: 'Pédicure', credit: '', page: '' },
  Soinkeratine: { id: 'Soinkeratine', alt: 'Soin Kératine', credit: '', page: '' },
};
export const photoSrc = (key: PhotoKey, w = 800) => `/images/${key}.jpg`;

export interface TeamMember { name: string; role: string; photo: string; }
export const TEAM: TeamMember[] = [
  { name: 'Noura', role: 'Fondatrice & gérante', photo: 'team-1' },
  { name: 'Sara', role: 'Spécialiste coiffure', photo: 'team-2' },
  { name: 'Meryem', role: 'Esthéticienne', photo: 'team-3' },
  { name: 'Laila', role: 'Make-up artist', photo: 'team-4' },
];

export interface GalleryItem { label: string; category: 'Coiffure' | 'Soin visage' | 'Manucure' | 'Maquillage' | 'Salon'; photo: PhotoKey; }
export const GALLERY: GalleryItem[] = [
  { label: 'Brushing soigné', category: 'Coiffure', photo: 'coiffure' },
  { label: 'Soin du visage', category: 'Soin visage', photo: 'visage' },
  { label: 'Manucure fraîche', category: 'Manucure', photo: 'manucure' },
  { label: 'Séance maquillage', category: 'Maquillage', photo: 'maquillage' },
  { label: 'Coloration', category: 'Coiffure', photo: 'coloration' },
  { label: 'Rituel hammam', category: 'Salon', photo: 'spa' },
  { label: 'Notre salon', category: 'Salon', photo: 'salon' },
  { label: 'Pose de vernis', category: 'Manucure', photo: 'vernis' },
  { label: 'Soin éclat', category: 'Soin visage', photo: 'produits' },
];

export interface BlogPost {
  slug: string; title: string; date: string; excerpt: string; content: string[]; photo: PhotoKey;
}
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'conseils-pour-prendre-soin-de-vos-cheveux',
    title: '5 conseils pour prendre soin de vos cheveux',
    date: '12 janvier 2026',
    excerpt: 'Nos astuces simples et efficaces pour des cheveux brillants, au quotidien.',
    photo: 'coiffure',
    content: [
      "Un brushing tient plus longtemps sur cheveux propres et bien séchés à la racine : commencez toujours le séchage à l'envers.",
      "Espacez les shampoings autant que le cuir chevelu le permet : un shampoing trop fréquent stimule la production de sébum.",
      "Un soin profond une fois par semaine suffit à nourrir la fibre sans l'alourdir.",
      "Protégez vos cheveux de la chaleur du sèche-cheveux ou du fer avec un spray thermo-protecteur.",
      "Une coupe d'entretien toutes les six à huit semaines évite les pointes fourchues et garde la forme.",
    ],
  },
  {
    slug: 'choisir-son-soin-visage',
    title: 'Comment choisir le soin visage adapté à votre peau',
    date: '5 janvier 2026',
    excerpt: 'Nos experts vous expliquent comment choisir le soin adapté à votre type de peau.',
    photo: 'visage',
    content: [
      "Peau sèche, mixte, grasse ou sensible : chaque type de peau a ses propres besoins, et le bon soin commence par un diagnostic.",
      "Un nettoyage de peau en institut, une à deux fois par mois, complète utilement une routine à la maison.",
      "Après trente ans, un soin éclat au collagène redonne du tonus et atténue les premiers signes de fatigue.",
      "N'hésitez pas à demander conseil à votre esthéticienne lors de votre rendez-vous : elle adapte le soin à votre peau du jour.",
    ],
  },
  {
    slug: 'tendances-beaute-2026',
    title: 'Les tendances beauté 2026',
    date: '28 décembre 2025',
    excerpt: 'Couleurs, coiffures, maquillage : découvrez les tendances beauté de cette année.',
    photo: 'coloration',
    content: [
      "Les teintes chaudes et naturelles dominent cette année, aussi bien en coloration qu'en maquillage.",
      "Le brushing texturé, moins lisse, plus vivant, s'impose comme la nouvelle référence.",
      "Le maquillage \"peau nue\" reste la tendance phare : on sublime plutôt que l'on masque.",
      "Les manucures aux teintes terracotta et beige rosé accompagnent parfaitement cette saison.",
    ],
  },
];

export interface Testimonial { name: string; rating: number; text: string; }
export const TESTIMONIALS: Testimonial[] = [
  { name: 'Sara L.', rating: 5, text: "Un salon magnifique avec une équipe très professionnelle. Je suis toujours satisfaite du résultat !" },
  { name: 'Meryem A.', rating: 5, text: "Les soins sont exceptionnels, l'accueil chaleureux et les produits de grande qualité. Je recommande vivement." },
  { name: 'Imane B.', rating: 5, text: "J'ai trouvé mon salon de beauté préféré à Casablanca. Merci Maison Noura pour votre excellence !" },
];

// ─── Données statiques de secours (utilisées quand l'API backend n'est pas disponible) ───
import { Category, Prestation } from './models';

export const STATIC_CATEGORIES: Category[] = [
  { id: 1, name: 'Coiffure', description: 'Coupes, colorations et soins capillaires.' },
  { id: 2, name: 'Soins du visage', description: 'Soins hydratants, anti-âge et éclat.' },
  { id: 3, name: 'Ongles', description: 'Manucure, pédicure et pose de vernis.' },
  { id: 4, name: 'Hammam & gommage', description: 'Rituels détente et gommage corps.' },
  { id: 5, name: 'Maquillage', description: 'Maquillage jour, soirée et mariage.' },
  { id: 6, name: 'Épilation', description: 'Épilation à la cire douce.' },
];

export const STATIC_PRESTATIONS: Prestation[] = [
  // Coiffure
  { id: 1, name: 'Coupe femme', price: 150, durationMinutes: 45, category: STATIC_CATEGORIES[0] },
  { id: 2, name: 'Brushing', price: 100, durationMinutes: 30, category: STATIC_CATEGORIES[0] },
  { id: 3, name: 'Coloration complète', price: 350, durationMinutes: 90, category: STATIC_CATEGORIES[0] },
  { id: 4, name: 'Balayage / mèches', price: 450, durationMinutes: 120, category: STATIC_CATEGORIES[0] },
  { id: 5, name: 'Soin à la kératine', price: 600, durationMinutes: 150, category: STATIC_CATEGORIES[0] },
  // Soins du visage
  { id: 6, name: 'Soin hydratant', price: 200, durationMinutes: 60, category: STATIC_CATEGORIES[1] },
  { id: 7, name: 'Soin anti-âge', price: 280, durationMinutes: 75, category: STATIC_CATEGORIES[1] },
  { id: 8, name: 'Nettoyage de peau', price: 180, durationMinutes: 60, category: STATIC_CATEGORIES[1] },
  // Ongles
  { id: 9, name: 'Manucure classique', price: 80, durationMinutes: 30, category: STATIC_CATEGORIES[2] },
  { id: 10, name: 'Pose vernis semi-permanent', price: 130, durationMinutes: 45, category: STATIC_CATEGORIES[2] },
  { id: 11, name: 'Pédicure complète', price: 120, durationMinutes: 45, category: STATIC_CATEGORIES[2] },
  // Hammam
  { id: 12, name: 'Rituel hammam & gommage', price: 300, durationMinutes: 90, category: STATIC_CATEGORIES[3] },
  { id: 13, name: 'Gommage corps', price: 200, durationMinutes: 60, category: STATIC_CATEGORIES[3] },
  // Maquillage
  { id: 14, name: 'Maquillage naturel', price: 200, durationMinutes: 45, category: STATIC_CATEGORIES[4] },
  { id: 15, name: 'Maquillage soirée / mariage', price: 350, durationMinutes: 75, category: STATIC_CATEGORIES[4] },
  // Épilation
  { id: 16, name: 'Épilation visage', price: 60, durationMinutes: 20, category: STATIC_CATEGORIES[5] },
  { id: 17, name: 'Épilation jambes complètes', price: 150, durationMinutes: 45, category: STATIC_CATEGORIES[5] },
  { id: 18, name: 'Épilation corps complet', price: 280, durationMinutes: 90, category: STATIC_CATEGORIES[5] },
];
