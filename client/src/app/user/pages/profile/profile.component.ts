import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { Subject, takeUntil } from 'rxjs';
import { UsersService } from '../../../shared/services/users.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  emailPatternValidator,
  minMaxLengthValidator,
  namePatternValidator,
  passwordPatternValidator,
  requiredValidator,
  showErrorMessage,
} from '../../../shared/utils/validators';
import { UserWithTokenInterface } from '../../../shared/models/interfaces/user-with-token.interface';
import { DialogService } from '../../../shared/services/dialog.service';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, OnDestroy {
  public user: UserInterface | null = null;

  public regPassword: RegExp =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\\]).{8,32}$/;

  public regEmail: RegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  public regName: RegExp = /^([A-Z]{1}[a-z-]+|[А-Я]{1}[а-я-]+)$/;

  private fb = inject(FormBuilder);

  public profileForm: FormGroup = this.fb.group({
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
    newPassword: [
      '',
      [
        minMaxLengthValidator(8, 32),
        passwordPatternValidator(this.regPassword),
      ],
    ],
    confirmPassword: [
      '',
      [
        minMaxLengthValidator(8, 32),
        passwordPatternValidator(this.regPassword),
      ],
    ],
  });

  private destroy$: Subject<void> = new Subject<void>();

  private usersService = inject(UsersService);

  private dialogService = inject(DialogService);

  private router = inject(Router);

  private cdr = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.initUser();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public showMessage(controlName: string): string {
    const control = this.profileForm.controls[controlName];
    return showErrorMessage(control);
  }

  public matchPasswords(): boolean {
    const password = this.profileForm.controls['newPassword'].value;
    const confirmPassword = this.profileForm.controls['confirmPassword'].value;
    return password === confirmPassword;
  }

  public updateProfile(): void {
    const data = this.profileForm.getRawValue();
    data.newPassword = data.newPassword === '' ? null : data.newPassword;
    this.usersService
      .updateCurrentUser(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userWithToken: UserWithTokenInterface) => {
          sessionStorage.setItem(
            'token',
            JSON.stringify(`Bearer ${userWithToken.token.token}`),
          );
          sessionStorage.setItem(
            'exp',
            JSON.stringify(userWithToken.token.exp),
          );
          this.usersService.updateUserData(userWithToken.user);
          this.clearPasswordFields();
          this.initProfileForm(userWithToken.user);
          this.dialogService.openDialog(DialogTypeEnum.Alert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Дані користувача успішно оновлені.',
          });
        },
        error: (err: HttpErrorResponse) => {
          if (
            err.status === HttpStatusCode.BadRequest &&
            err.error.error === 'Password Error'
          ) {
            this.clearPasswordFields();
            this.dialogService.openDialog(DialogTypeEnum.Alert, {
              title: 'ПОВІДОМЛЕННЯ',
              text: 'Ви ввели неправильний пароль. Перевірте пароль та повторіть спробу.',
            });
          }
        },
      });
  }

  public deleteProfile(): void {
    this.usersService
      .deleteCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.dialogService.openDialog(DialogTypeEnum.Alert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Профіль успішно видалено.',
          });
          this.router.navigateByUrl('');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('exp');
          this.usersService.updateUserData(null);
        },
        error: () => {
          this.dialogService.openDialog(DialogTypeEnum.Alert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Щось пішло не так. Повторіть спробу пізніше.',
          });
        },
      });
  }

  public confirmDelete(): void {
    this.dialogService
      .openDialog(DialogTypeEnum.ConfirmDeleteProfile, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Ви впевнені, що хочете видалити свій профіль?',
      })
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (value) {
            this.deleteProfile();
          }
        },
      });
  }

  public initUser(): void {
    this.usersService.user$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        this.user = value;
        this.initProfileForm(value);
      },
    });
  }

  public initProfileForm(user: UserInterface | null): void {
    if (user) {
      this.profileForm.controls['email'].setValue(user.email);
      this.profileForm.controls['firstName'].setValue(user.firstName);
      this.profileForm.controls['lastName'].setValue(user.lastName);
    }
  }

  public clearPasswordFields(): void {
    this.profileForm.controls['password'].setValue('');
    this.profileForm.controls['newPassword'].setValue('');
    this.profileForm.controls['confirmPassword'].setValue('');
    this.cdr.detectChanges();
  }

  public confirmDeletePhoto(): void {
    this.dialogService
      .openDialog(DialogTypeEnum.ConfirmDeleteProfile, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Ви впевнені, що хочете видалити фото?',
      })
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (value) {
            this.deletePhoto();
          }
        },
      });
  }

  public deletePhoto(): void {
    this.usersService
      .deleteCurrentUserPhoto()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userWithToken: UserWithTokenInterface) => {
          sessionStorage.setItem(
            'token',
            JSON.stringify(`Bearer ${userWithToken.token.token}`),
          );
          sessionStorage.setItem(
            'exp',
            JSON.stringify(userWithToken.token.exp),
          );
          this.usersService.updateUserData(userWithToken.user);
          this.cdr.detectChanges();
          this.dialogService.openDialog(DialogTypeEnum.Alert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Фото успішно видалено.',
          });
        },
        error: () => {
          this.dialogService.openDialog(DialogTypeEnum.Alert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Щось пішло не так. Повторіть спробу пізніше.',
          });
        },
      });
  }

  public updatePhoto(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const file = target.files[0];
      this.usersService
        .updateCurrentUserPhoto(file)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (userWithToken: UserWithTokenInterface) => {
            sessionStorage.setItem(
              'token',
              JSON.stringify(`Bearer ${userWithToken.token.token}`),
            );
            sessionStorage.setItem(
              'exp',
              JSON.stringify(userWithToken.token.exp),
            );
            this.usersService.updateUserData(userWithToken.user);
            this.cdr.detectChanges();
            this.dialogService.openDialog(DialogTypeEnum.Alert, {
              title: 'ПОВІДОМЛЕННЯ',
              text: 'Фото успішно оновлено.',
            });
          },
          error: () => {
            this.dialogService.openDialog(DialogTypeEnum.Alert, {
              title: 'ПОВІДОМЛЕННЯ',
              text: 'Щось пішло не так. Повторіть спробу пізніше.',
            });
          },
        });
    }
  }
}
