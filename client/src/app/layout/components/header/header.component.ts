import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { UsersService } from '../../../shared/services/users.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  public user: UserInterface | null = null;

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(private usersService: UsersService, private cdr: ChangeDetectorRef,) {}

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
  }
}
