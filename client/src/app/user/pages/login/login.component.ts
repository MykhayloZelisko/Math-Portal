import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { UsersService } from '../../../shared/services/users.service';
import { TokenInterface } from '../../../shared/models/interfaces/token.interface';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { HttpErrorResponse } from '@angular/common/http';
import {
  DialogService,
  DialogTypeEnum,
} from '../../../shared/services/dialog.service';
import { StatusCodeEnum } from '../../../shared/models/enums/status-code.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
  public regPassword: RegExp =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\\]).{8,}$/;

  public regEmail: RegExp =
    /^\w+[\w.+-]*@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/;

  public loginForm: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.pattern(this.regEmail)]],
    password: [
      null,
      [Validators.required, Validators.pattern(this.regPassword)],
    ],
  });

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService,
    private dialogService: DialogService,
  ) {}

  public ngOnDestroy() {
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
        }),
        switchMap(() => {
          return this.usersService
            .getCurrentUser()
            .pipe(takeUntil(this.destroy$));
        }),
      )
      .subscribe({
        next: (user: UserInterface) => {
          this.usersService.user$.next(user);
          this.router.navigateByUrl('');
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === StatusCodeEnum.Unauthorized) {
            this.dialogService
              .openDialog(DialogTypeEnum.ConflictRegistration, {
                title: 'ПОВІДОМЛЕННЯ',
                text: 'Невірна електронна пошта або пароль. Перевірте введені дані та повторіть спробу.',
              })
              .afterClosed()
              .subscribe();
          }
        },
      });
  }

  public registration(): void {
    this.router.navigateByUrl('registration');
  }
}
