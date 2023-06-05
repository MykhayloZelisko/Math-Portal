import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app/routes/app.routes';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './app/auth/auth.module';

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
    ),
  ],
})
  .then((app) => app.bootstrap(AppComponent))
  .catch((err) => console.error(err));
