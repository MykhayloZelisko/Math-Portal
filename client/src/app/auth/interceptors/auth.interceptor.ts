import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { DialogService } from '../../shared/services/dialog.service';
import { DialogTypeEnum } from '../../shared/models/enums/dialog-type.enum';
import { UsersService } from '../../shared/services/users.service';
import { UserRouteNameEnum } from '../../shared/models/enums/user-route-name.enum';
import { LayoutRouteNameEnum } from '../../shared/models/enums/layout-route-name.enum';
import { ArticlesRouteNameEnum } from '../../shared/models/enums/articles-route-name.enum';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public constructor(
    private dialogService: DialogService,
    private usersService: UsersService,
    private router: Router,
  ) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (
      sessionStorage.getItem('exp') &&
      +JSON.parse(sessionStorage.getItem('exp') as string) * 1000 < Date.now()
    ) {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          this.dialogService
            .openDialog(DialogTypeEnum.JWTAlert, {
              title: 'ПОВІДОМЛЕННЯ',
              text: 'Закінчився термін дії токена. Ви будете вилогінені з системи.',
            })
            .afterClosed()
            .subscribe(() => {
              const id = +this.router.url.split('/')[2];
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('exp');
              this.usersService.updateUserData(null);
              if (
                this.router.url.includes(UserRouteNameEnum.Profile) ||
                this.router.url.includes(LayoutRouteNameEnum.Admin) ||
                (this.router.url.includes(ArticlesRouteNameEnum.ArticlesList) &&
                  id)
              ) {
                this.router.navigateByUrl('');
              }
            });
          return throwError(() => error);
        }),
      );
    } else if (
      request.url.includes('auth') ||
      (request.url.includes('tags') && request.method === 'GET') ||
      (request.url.includes('articles') && request.method === 'GET') ||
      (request.url.includes('comments') && request.method === 'GET')
    ) {
      return next.handle(request);
    } else {
      if (sessionStorage.getItem('token')) {
        const token = JSON.parse(sessionStorage.getItem('token') as string);
        const authRequest = request.clone({
          headers: request.headers.append('Authorization', token),
        });
        return next.handle(authRequest);
      } else {
        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            return throwError(() => error);
          }),
        );
      }
    }
  }
}
