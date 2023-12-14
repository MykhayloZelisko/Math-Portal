import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { UsersService } from '../../shared/services/users.service';
import { Observable, of } from 'rxjs';

export const userGuard: CanActivateFn = () => {
  const usersService = inject(UsersService);
  const router = inject(Router);
  const user = usersService.user$.getValue();
  if (user) {
    return of(true);
  } else {
    return of(router.parseUrl('/'));
  }
};
