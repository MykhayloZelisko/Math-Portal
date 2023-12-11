import { Routes } from '@angular/router';
import { ArticlesRouteNameEnum } from '../shared/models/enums/articles-route-name.enum';
import { editArticleGuard } from '../user/guards/edit-article.guard';

export const ArticlesRoutes: Routes = [
  {
    path: ArticlesRouteNameEnum.ArticlesPanel,
    loadComponent: () =>
      import('../user/pages/articles/articles.component').then(
        (m) => m.ArticlesComponent,
      ),
    children: [
      {
        path: ArticlesRouteNameEnum.ArticlesList,
        loadComponent: () =>
          import(
            '../user/pages/articles/pages/articles-list/articles-list.component'
          ).then((m) => m.ArticlesListComponent),
      },
      {
        path: ArticlesRouteNameEnum.Article,
        loadComponent: () =>
          import('../user/pages/articles/pages/article/article.component').then(
            (m) => m.ArticleComponent,
          ),
        canDeactivate: [editArticleGuard],
      },
    ],
  },
];
