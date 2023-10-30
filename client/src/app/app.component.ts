import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from './shared/services/users.service';
import { Subject, takeUntil } from 'rxjs';
import { UserInterface } from './shared/models/interfaces/user.interface';
import { LoaderComponent } from './components/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, CommonModule, LoaderComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  public constructor(private usersService: UsersService) {}

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
