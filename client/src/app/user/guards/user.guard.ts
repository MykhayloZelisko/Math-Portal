import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsersService } from '../../shared/services/users.service';


@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  public constructor(private usersService: UsersService, private router: Router) {}

  public canActivate(): Observable<boolean> | Observable<UrlTree> {
    if (this.usersService.user$.getValue()) {
      return of(true);
    } else {
      return of(this.router.parseUrl('/'));
    }
  }
}
