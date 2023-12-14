import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { DialogService } from '../../../shared/services/dialog.service';
import {
  emailPatternValidator,
  minMaxLengthValidator,
  namePatternValidator,
  passwordPatternValidator,
  requiredValidator,
  showErrorMessage,
} from '../../../shared/utils/validators';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent implements OnDestroy {
  public regPassword =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\\]).{8,32}$/;

  public regEmail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  public regName = /^([A-Z]{1}[a-z-]+|[А-Я]{1}[а-я-]+)$/;

  private fb = inject(FormBuilder);

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

  private authService = inject(AuthService);

  private router = inject(Router);

  private dialogService = inject(DialogService);

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
          if (err.status === HttpStatusCode.Conflict) {
            const email = this.registrationForm.controls['email'].value;
            this.dialogService.openDialog(DialogTypeEnum.ConflictRegistration, {
              title: 'ПОВІДОМЛЕННЯ',
              text: `${email}`,
            });
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
