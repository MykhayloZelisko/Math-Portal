import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../shared/services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  public constructor(private loaderService: LoaderService) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    this.loaderService.show();
    return next
      .handle(request)
      .pipe(finalize(() => this.loaderService.hide()));
  }
}
