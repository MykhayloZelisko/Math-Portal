import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { UsersService } from '../../../shared/services/users.service';
import { TokenInterface } from '../../../shared/models/interfaces/token.interface';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { DialogService } from '../../../shared/services/dialog.service';
import {
  requiredValidator,
  showErrorMessage,
} from '../../../shared/utils/validators';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
  private fb = inject(FormBuilder);

  public loginForm: FormGroup = this.fb.group({
    email: [null, [requiredValidator()]],
    password: [null, [requiredValidator()]],
  });

  private destroy$: Subject<void> = new Subject<void>();

  private authService = inject(AuthService);

  private router = inject(Router);

  private dialogService = inject(DialogService);

  private usersService = inject(UsersService);

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public login(): void {
    const data = this.loginForm.getRawValue();
    this.authService
      .login(data)
      .pipe(
        tap((token: TokenInterface) => {
          sessionStorage.setItem(
            'token',
            JSON.stringify(`Bearer ${token.token}`),
          );
          sessionStorage.setItem('exp', JSON.stringify(token.exp));
        }),
        switchMap(() => {
          return this.usersService
            .getCurrentUser()
            .pipe(takeUntil(this.destroy$));
        }),
      )
      .subscribe({
        next: (user: UserInterface) => {
          this.usersService.updateUserData(user);
          this.router.navigateByUrl('');
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === HttpStatusCode.Unauthorized) {
            this.dialogService.openDialog(DialogTypeEnum.Alert, {
              title: 'ПОВІДОМЛЕННЯ',
              text: 'Невірна електронна пошта або пароль. Перевірте введені дані та повторіть спробу.',
            });
          }
        },
      });
  }

  public registration(): void {
    this.router.navigateByUrl('registration');
  }

  public showMessage(controlName: string): string {
    const control = this.loginForm.controls[controlName];
    return showErrorMessage(control);
  }
}
