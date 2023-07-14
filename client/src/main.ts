import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app/routes/app.routes';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './app/auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MathjaxModule } from 'mathjax-angular';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(appRoutes, {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      HttpClientModule,
      AuthModule,
      BrowserAnimationsModule,
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
          },
          svg: { fontCache: 'global' },
        },
        src: 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/startup.js',
      }),
    ),
  ],
})
  .then((app) => app.bootstrap(AppComponent))
  .catch((err) => console.error(err));
