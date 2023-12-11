import {
  ChangeDetectionStrategy,
  Component, inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersService } from './shared/services/users.service';
import { Subject, takeUntil } from 'rxjs';
import { UserInterface } from './shared/models/interfaces/user.interface';
import { LoaderComponent } from './components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  private usersService = inject(UsersService);

  public ngOnInit(): void {
    this.getCurrentUser();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getCurrentUser(): void {
    if (sessionStorage.getItem('token')) {
      this.usersService
        .getCurrentUser()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (user: UserInterface) => this.usersService.updateUserData(user),
        });
    }
  }
}
