import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { DialogService } from '../../shared/services/dialog.service';
import { DialogTypeEnum } from '../../shared/models/enums/dialog-type.enum';
import { UsersService } from '../../shared/services/users.service';
import { UserRouteNameEnum } from '../../shared/models/enums/user-route-name.enum';
import { LayoutRouteNameEnum } from '../../shared/models/enums/layout-route-name.enum';
import { ArticlesRouteNameEnum } from '../../shared/models/enums/articles-route-name.enum';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const dialogService = inject(DialogService);
  const usersService = inject(UsersService);
  const router = inject(Router);
  if (
    sessionStorage.getItem('exp') &&
    +JSON.parse(sessionStorage.getItem('exp') as string) * 1000 < Date.now()
  ) {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        dialogService
          .openDialog(DialogTypeEnum.JWTAlert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Закінчився термін дії токена. Ви будете вилогінені з системи.',
          })
          .afterClosed()
          .subscribe(() => {
            const id = router.url.split('/')[2];
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('exp');
            usersService.updateUserData(null);
            if (
              router.url.includes(UserRouteNameEnum.Profile) ||
              router.url.includes(LayoutRouteNameEnum.Admin) ||
              (router.url.includes(ArticlesRouteNameEnum.ArticlesList) && id)
            ) {
              router.navigateByUrl('');
            }
          });
        return throwError(() => error);
      }),
    );
  } else if (
    req.url.includes('auth') ||
    (req.url.includes('tags') && req.method === 'GET') ||
    (req.url.includes('articles') && req.method === 'GET') ||
    (req.url.includes('comments') && req.method === 'GET')
  ) {
    return next(req);
  } else {
    if (sessionStorage.getItem('token')) {
      const token = JSON.parse(sessionStorage.getItem('token') as string);
      const authRequest = req.clone({
        headers: req.headers.append('Authorization', token),
      });
      return next(authRequest);
    } else {
      return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
    }
  }
};
