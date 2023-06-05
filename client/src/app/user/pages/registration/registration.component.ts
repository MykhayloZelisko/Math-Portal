import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent implements OnInit, OnDestroy {
  public regPassword: RegExp =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\\]).{8,}$/;

  public regEmail: RegExp =
    /^\w+[\w.+-]*@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/;

  public regName: RegExp = /^([A-Z]{1}[a-z-]+|[А-Я]{1}[а-я-]+)$/;

  public isInvalid: boolean = true;

  public registrationForm: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.pattern(this.regEmail)]],
    firstName: [null, [Validators.required, Validators.pattern(this.regName)]],
    lastName: [null, [Validators.required, Validators.pattern(this.regName)]],
    password: [
      null,
      [Validators.required, Validators.pattern(this.regPassword)],
    ],
    confirmPassword: [
      null,
      [Validators.required, Validators.pattern(this.regPassword)],
    ],
  });

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.isFormInvalid();
  }

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
      });
  }

  private isFormInvalid(): void {
    this.registrationForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.isInvalid =
            !data.email ||
            !data.firstName ||
            !data.lastName ||
            !data.password ||
            !data.confirmPassword ||
            data.password !== data.confirmPassword;
        },
      });
  }
}
