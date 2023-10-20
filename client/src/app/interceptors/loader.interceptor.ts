import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../shared/services/loader.service';

const EXCEPTION_ROUTES: string[] = ['/users'];

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  public constructor(private loaderService: LoaderService) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (EXCEPTION_ROUTES.some((i) => request.url.includes(i))) {
      return next.handle(request);
    } else {
      this.loaderService.show();
      return next
        .handle(request)
        .pipe(finalize(() => this.loaderService.hide()));
    }
  }
}
