import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from './routes/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MathjaxModule } from 'mathjax-angular';
import { loaderInterceptor } from './interceptors/loader.interceptor';
import { authInterceptor } from './auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    })),
    provideAnimations(),
    provideHttpClient(withInterceptors([loaderInterceptor, authInterceptor])),
    importProvidersFrom(
      MatDialogModule,
      AngularSvgIconModule.forRoot(),
      MathjaxModule.forRoot({
        config: {
          loader: {
            load: ['output/svg', 'output/chtml', '[tex]/require', '[tex]/ams'],
          },
          tex: {
            inlineMath: [['$', '$']],
            packages: ['base', 'require', 'ams'],
            tags: 'ams',
          },
          svg: { fontCache: 'global' },
        },
        src: 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/startup.js',
      }),
    ),
  ]
};
