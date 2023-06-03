import { Routes } from '@angular/router';
import { UserRouteNameEnum } from '../shared/models/enums/user-route-name.enum';

export const UserRoutes: Routes = [
  {
    path: UserRouteNameEnum.Home,
    loadComponent: () =>
      import('../user/pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: UserRouteNameEnum.Login,
    loadComponent: () =>
      import('../user/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: UserRouteNameEnum.Registration,
    loadComponent: () =>
      import('../user/pages/registration/registration.component').then((m) => m.RegistrationComponent),
  },
  {
    path: UserRouteNameEnum.Articles,
    loadComponent: () =>
      import('../user/pages/articles/articles.component').then((m) => m.ArticlesComponent),
  },
  {
    path: UserRouteNameEnum.Applications,
    loadComponent: () =>
      import('../user/pages/applications/applications.component').then((m) => m.ApplicationsComponent),
  },
  {
    path: UserRouteNameEnum.Contacts,
    loadComponent: () =>
      import('../user/pages/contacts/contacts.component').then((m) => m.ContactsComponent),
  },
];
