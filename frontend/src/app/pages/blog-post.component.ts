import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BLOG_POSTS } from '../core/content';
import { PhotoDirective } from '../core/photo.directive';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [RouterLink, PhotoDirective],
  template: `
    @if (post) {
      <article class="container narrow page">
        <a class="back" routerLink="/blog">← Retour au blog</a>
        <p class="date">{{ post.date }}</p>
        <h1>{{ post.title }}</h1>
        <div class="photo cover"><img [appPhoto]="post.photo" [alt]="post.title" sizes="(max-width: 700px) 100vw, 640px" eager></div>
        @for (paragraph of post.content; track paragraph) {
          <p>{{ paragraph }}</p>
        }
      </article>
    } @else {
      <div class="container narrow page">
        <h1>Article introuvable</h1>
        <a routerLink="/blog">Retour au blog</a>
      </div>
    }
  `,
  styles: `
    .back { color: var(--green); text-decoration: none; display: inline-block; margin-bottom: 1.5rem; }
    .date { color: var(--gold); margin-bottom: .2rem; }
    .cover { aspect-ratio: 16/9; margin-block: 1.5rem; }
  `,
})
export class BlogPostComponent {
  private route = inject(ActivatedRoute);
  post = BLOG_POSTS.find(p => p.slug === this.route.snapshot.paramMap.get('slug'));
}
