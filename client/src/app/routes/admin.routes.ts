import { Routes } from '@angular/router';
import { AdminRouteNameEnum } from '../shared/models/enums/admin-route-name.enum';
import { newArticleGuard } from '../admin/guards/new-article.guard';

export const AdminRoutes: Routes = [
  {
    path: AdminRouteNameEnum.AdminPanel,
    loadComponent: () =>
      import('../admin/admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: AdminRouteNameEnum.Users,
        loadComponent: () =>
          import('../admin/pages/users/users.component').then(
            (m) => m.UsersComponent,
          ),
        data: { path: AdminRouteNameEnum.Users },
      },
      {
        path: AdminRouteNameEnum.Tags,
        loadComponent: () =>
          import('../admin/pages/tags/tags.component').then(
            (m) => m.TagsComponent,
          ),
        data: { path: AdminRouteNameEnum.Tags },
      },
      {
        path: AdminRouteNameEnum.NewArticle,
        loadComponent: () =>
          import('../admin/pages/new-article/new-article.component').then(
            (m) => m.NewArticleComponent,
          ),
        data: { path: AdminRouteNameEnum.NewArticle },
        canDeactivate: [newArticleGuard],
      },
      {
        path: '',
        redirectTo: AdminRouteNameEnum.Users,
      },
    ],
  },
];
