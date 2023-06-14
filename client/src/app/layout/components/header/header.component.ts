import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { UsersService } from '../../../shared/services/users.service';
import { Subject, takeUntil } from 'rxjs';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { UserRouteNameEnum } from '../../../shared/models/enums/user-route-name.enum';
import { LayoutRouteNameEnum } from '../../../shared/models/enums/layout-route-name.enum';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AngularSvgIconModule,
    ClickOutsideDirective,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  public user: UserInterface | null = null;

  public isActiveDropDown: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  public ngOnInit(): void {
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
    sessionStorage.removeItem('token');
    this.usersService.user$.next(null);
    if (
      this.router.url.includes(UserRouteNameEnum.Profile) ||
      this.router.url.includes(LayoutRouteNameEnum.Admin)
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
