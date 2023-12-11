import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { UsersService } from '../../shared/services/users.service';

export const adminGuard: CanActivateFn = () => {
  const usersService = inject(UsersService);
  const router = inject(Router);
  const user = usersService.user$.getValue();

  if (user && user.isAdmin) {
    return of(true);
  } else {
    return of(router.parseUrl('/'));
  }
};
