import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./layout.routes').then((m) => m.LayoutRoutes),
      },
    ],
  },
];
