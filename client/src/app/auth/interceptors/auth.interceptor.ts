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
    const authRequest = request.clone({
      headers: request.headers.append('Access-Control-Allow-Origin', '*')
    });
    request.headers.append('Access-Control-Allow-Origin', '*');
    if (request.url.includes('auth')) {
      return next.handle(request);
    } else {
      const token = sessionStorage.getItem('token');
      if (token) {
        const authRequest = request.clone({
          headers: request.headers
            .append('Authorization', token)
            .append('Access-Control-Allow-Origin', '*'),
        });
        return next.handle(authRequest);
      } else {
        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            // TODO: add dialog when email already exists (error #409)
            return throwError(() => error);
          }),
        );
      }
    }
  }
}
