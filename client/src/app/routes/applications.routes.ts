import { Routes } from '@angular/router';
import { ApplicationsRouteNameEnum } from '../shared/models/enums/applications-route-name.enum';

export const ApplicationsRoutes: Routes = [
  {
    path: ApplicationsRouteNameEnum.ApplicationsPanel,
    loadComponent: () =>
      import('../user/pages/applications/applications.component').then(
        (m) => m.ApplicationsComponent,
      ),
    children: [
      {
        path: ApplicationsRouteNameEnum.Empty,
        loadComponent: () =>
          import('../user/pages/applications/pages/empty/empty.component').then(
            (m) => m.EmptyComponent,
          ),
      },
      {
        path: ApplicationsRouteNameEnum.SolvingTriangle,
        loadComponent: () =>
          import(
            '../user/pages/applications/pages/solving-triangle/solving-triangle.component'
          ).then((m) => m.SolvingTriangleComponent),
      },
      {
        path: ApplicationsRouteNameEnum.SystemLinearEquations,
        loadComponent: () =>
          import(
            '../user/pages/applications/pages/system-linear-equations/system-linear-equations.component'
          ).then((m) => m.SystemLinearEquationsComponent),
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
