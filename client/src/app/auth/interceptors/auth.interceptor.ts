import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (
      request.url.includes('auth') ||
      (request.url.includes('tag') && request.method === 'GET')
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
