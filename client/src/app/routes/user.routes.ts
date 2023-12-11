import { Routes } from '@angular/router';
import { UserRouteNameEnum } from '../shared/models/enums/user-route-name.enum';
import { userGuard } from '../user/guards/user.guard';
import { profileGuard } from '../user/guards/profile.guard';

export const UserRoutes: Routes = [
  {
    path: UserRouteNameEnum.Home,
    loadComponent: () =>
      import('../user/pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: UserRouteNameEnum.Login,
    loadComponent: () =>
      import('../user/pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: UserRouteNameEnum.Registration,
    loadComponent: () =>
      import('../user/pages/registration/registration.component').then(
        (m) => m.RegistrationComponent,
      ),
  },
  {
    path: UserRouteNameEnum.Articles,
    loadChildren: () =>
      import('./articles.routes').then((m) => m.ArticlesRoutes),
  },
  {
    path: UserRouteNameEnum.Applications,
    loadChildren: () =>
      import('./applications.routes').then((m) => m.ApplicationsRoutes),
  },
  {
    path: UserRouteNameEnum.Contacts,
    loadComponent: () =>
      import('../user/pages/contacts/contacts.component').then(
        (m) => m.ContactsComponent,
      ),
  },
  {
    path: UserRouteNameEnum.Profile,
    loadComponent: () =>
      import('../user/pages/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
    canActivate: [userGuard],
    canDeactivate: [profileGuard],
  },
];
