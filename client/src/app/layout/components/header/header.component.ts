import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { UsersService } from '../../../shared/services/users.service';
import { Subject, takeUntil } from 'rxjs';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { UserRouteNameEnum } from '../../../shared/models/enums/user-route-name.enum';
import { LayoutRouteNameEnum } from '../../../shared/models/enums/layout-route-name.enum';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { ArticlesRouteNameEnum } from '../../../shared/models/enums/articles-route-name.enum';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    AngularSvgIconModule,
    ClickOutsideDirective,
    RouterLinkActive,
    NgIf,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  public user: UserInterface | null = null;

  public isActiveDropDown: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  private usersService = inject(UsersService);

  private cdr = inject(ChangeDetectorRef);

  private router = inject(Router);

  public ngOnInit(): void {
    this.initUser();
  }

  public initUser(): void {
    this.usersService.user$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user: UserInterface | null) => {
        this.user = user;
        this.cdr.detectChanges();
      },
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public logout(): void {
    const id = this.router.url.split('/')[2];
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('exp');
    this.usersService.updateUserData(null);
    if (
      this.router.url.includes(UserRouteNameEnum.Profile) ||
      this.router.url.includes(LayoutRouteNameEnum.Admin) ||
      (this.router.url.includes(ArticlesRouteNameEnum.ArticlesList) && id)
    ) {
      this.router.navigateByUrl('');
    }
    this.isActiveDropDown = false;
  }

  public openDropDown(): void {
    this.isActiveDropDown = !this.isActiveDropDown;
  }

  public closeDropDown(): void {
    this.isActiveDropDown = false;
  }
}
