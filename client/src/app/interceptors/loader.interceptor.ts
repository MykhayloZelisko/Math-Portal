import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../shared/services/loader.service';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const loaderService = inject(LoaderService);
  loaderService.show();
  return next(req).pipe(finalize(() => loaderService.hide()));
};
