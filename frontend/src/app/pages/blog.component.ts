import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_POSTS } from '../core/content';
import { PhotoDirective } from '../core/photo.directive';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterLink, PhotoDirective],
  template: `
    <div class="container page">
      <div class="section-head">
        <h1>Blog &amp; conseils</h1>
        <hr class="rule">
        <p>Nos conseils beauté, coiffure et bien-être.</p>
      </div>

      <div class="grid">
        @for (post of posts; track post.slug) {
          <article class="card">
            <div class="photo"><img [appPhoto]="post.photo" [alt]="post.title" sizes="(max-width: 900px) 100vw, 380px"></div>
            <p class="date">{{ post.date }}</p>
            <h3><a [routerLink]="['/blog', post.slug]">{{ post.title }}</a></h3>
            <p class="muted">{{ post.excerpt }}</p>
            <a class="link" [routerLink]="['/blog', post.slug]">Lire la suite →</a>
          </article>
        }
      </div>
    </div>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
    .card .photo { aspect-ratio: 4/3; margin-bottom: 1rem; }
    .card h3 { margin-bottom: .3rem; }
    .card h3 a { text-decoration: none; }
    .date { color: var(--gold); font-size: .88rem; margin-bottom: .3rem; }
    .link { color: var(--green); font-weight: 500; text-decoration: none; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class BlogComponent {
  posts = BLOG_POSTS;
}
