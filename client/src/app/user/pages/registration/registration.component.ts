import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  DialogService,
  DialogTypeEnum,
} from '../../../shared/services/dialog.service';
import { StatusCodeEnum } from '../../../shared/models/enums/status-code.enum';
import {
  emailPatternValidator,
  minMaxLengthValidator,
  namePatternValidator,
  passwordPatternValidator,
  requiredValidator,
  showErrorMessage,
} from '../../../shared/utils/validators';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent implements OnDestroy {
  public regPassword: RegExp =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\\]).{8,32}$/;

  public regEmail: RegExp =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  public regName: RegExp = /^([A-Z]{1}[a-z-]+|[А-Я]{1}[а-я-]+)$/;

  public registrationForm: FormGroup = this.fb.group({
    email: [null, [requiredValidator(), emailPatternValidator(this.regEmail)]],
    firstName: [
      null,
      [
        requiredValidator(),
        minMaxLengthValidator(3, null),
        namePatternValidator(this.regName),
      ],
    ],
    lastName: [
      null,
      [
        requiredValidator(),
        minMaxLengthValidator(3, null),
        namePatternValidator(this.regName),
      ],
    ],
    password: [
      null,
      [
        requiredValidator(),
        minMaxLengthValidator(8, 32),
        passwordPatternValidator(this.regPassword),
      ],
    ],
    confirmPassword: [
      null,
      [
        requiredValidator(),
        minMaxLengthValidator(8, 32),
        passwordPatternValidator(this.regPassword),
      ],
    ],
  });

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialogService: DialogService,
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public registration(): void {
    const data = this.registrationForm.getRawValue();
    this.authService
      .registration(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.router.navigateByUrl('login'),
        error: (err: HttpErrorResponse) => {
          if (err.status === StatusCodeEnum.Conflict) {
            const email = this.registrationForm.controls['email'].value;
            this.dialogService
              .openDialog(DialogTypeEnum.ConflictRegistration, {
                title: 'ПОВІДОМЛЕННЯ',
                text: `${email}`,
              })
              .afterClosed()
              .subscribe();
          }
        },
      });
  }

  public showMessage(controlName: string): string {
    const control = this.registrationForm.controls[controlName];
    return showErrorMessage(control);
  }

  public matchPasswords(): boolean {
    const password = this.registrationForm.controls['password'].value;
    const confirmPassword =
      this.registrationForm.controls['confirmPassword'].value;
    return !!password && !!confirmPassword && password === confirmPassword;
  }
}
