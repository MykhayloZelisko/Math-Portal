import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsersService } from '../../shared/services/users.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  public constructor(
    private usersService: UsersService,
    private router: Router,
  ) {}

  public canActivate(): Observable<boolean | UrlTree> {
    const user = this.usersService.user$.getValue();
    if (user) {
      return of(true);
    } else {
      return of(this.router.parseUrl('/'));
    }
  }
}
