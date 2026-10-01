import { Routes } from '@angular/router';
import { AdminGuard } from './core/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent) },
  { path: 'a-propos', loadComponent: () => import('./pages/about.component').then(m => m.AboutComponent) },
  { path: 'services', loadComponent: () => import('./pages/services.component').then(m => m.ServicesComponent) },
  { path: 'galerie', loadComponent: () => import('./pages/gallery.component').then(m => m.GalleryComponent) },
  { path: 'blog', loadComponent: () => import('./pages/blog.component').then(m => m.BlogComponent) },
  { path: 'blog/:slug', loadComponent: () => import('./pages/blog-post.component').then(m => m.BlogPostComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact.component').then(m => m.ContactComponent) },
  { path: 'reserver', loadComponent: () => import('./pages/booking.component').then(m => m.BookingComponent) },
  { path: 'connexion', loadComponent: () => import('./pages/login.component').then(m => m.LoginComponent) },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadComponent: () => import('./pages/admin.component').then(m => m.AdminComponent),
  },
  { path: '**', redirectTo: '' },
];
