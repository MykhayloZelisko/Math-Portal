import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UsersService } from '../../../shared/services/users.service';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { DialogService } from '../../../shared/services/dialog.service';
import { UserWithTokenInterface } from '../../../shared/models/interfaces/user-with-token.interface';
import { HttpStatusCode } from '@angular/common/http';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DialogComponent>>;
  const mockUser: UserInterface = {
    id: '35c90c0b-ba58-46f3-a091-bcdf66f514a8',
    email: 'mail@mail.mail',
    password: 'Pa$$word094',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    isAdmin: true,
    photo: null,
  };
  const mockUserWithToken: UserWithTokenInterface = {
    user: mockUser,
    token: {
      token: 'token',
      exp: 60,
    },
  };

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj(
      'UsersService',
      [
        'updateCurrentUser',
        'updateUserData',
        'deleteCurrentUser',
        'deleteCurrentUserPhoto',
        'updateCurrentUserPhoto',
      ],
      {
        user$: new BehaviorSubject<UserInterface | null>(mockUser),
      },
    );

    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockDialogRef = jasmine.createSpyObj('DialogRef', ['afterClosed']);

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showMessage', () => {
    it('should return null', () => {
      component.profileForm.controls['firstName'].setValue('John');
      const message = component.showMessage('firstName');

      expect(message).toEqual(null as unknown as string);
    });

    it(`should return string "Не валідне ім'я/прізвище"`, () => {
      component.profileForm.controls['firstName'].setValue('John1');
      const message = component.showMessage('firstName');

      expect(message).toBe(`Не валідне ім'я/прізвище`);
    });

    it(`should return string 'Кількість символів повинна бути не менша за 3'`, () => {
      component.profileForm.controls['firstName'].setValue('Jo');
      const message = component.showMessage('firstName');

      expect(message).toBe('Кількість символів повинна бути не менша за 3');
    });

    it(`should return string "Поле обов'язкове для заповнення"`, () => {
      component.profileForm.controls['firstName'].setValue('');
      const message = component.showMessage('firstName');

      expect(message).toBe(`Поле обов'язкове для заповнення`);
    });

    it(`should return string 'Кількість символів повинна бути від 8 до 32'`, () => {
      component.profileForm.controls['password'].setValue('pass...');
      const message = component.showMessage('password');

      expect(message).toBe('Кількість символів повинна бути від 8 до 32');
    });

    it(`should return string 'Пароль повинен містити хоча б одну велику латинську літеру'`, () => {
      component.profileForm.controls['password'].setValue('password1');
      const message = component.showMessage('password');

      expect(message).toBe(
        'Пароль повинен містити хоча б одну велику латинську літеру',
      );
    });

    it(`should return string 'Пароль повинен містити хоча б одну малу латинську літеру'`, () => {
      component.profileForm.controls['password'].setValue('PASSWORD1');
      const message = component.showMessage('password');

      expect(message).toBe(
        'Пароль повинен містити хоча б одну малу латинську літеру',
      );
    });

    it(`should return string 'Пароль повинен містити хоча б один спецсимвол'`, () => {
      component.profileForm.controls['password'].setValue('Password1');
      const message = component.showMessage('password');

      expect(message).toBe('Пароль повинен містити хоча б один спецсимвол');
    });
  });

  describe('matchPasswords', () => {
    it('should return false when confirmPassword and password fields are different', () => {
      component.profileForm.controls['newPassword'].setValue('Pa$$word094');
      component.profileForm.controls['confirmPassword'].setValue('Pa$$word091');
      const matchPass = component.matchPasswords();

      expect(matchPass).toBe(false);
    });

    it('should return true when confirmPassword and password fields are the same', () => {
      component.profileForm.controls['newPassword'].setValue('Pa$$word094');
      component.profileForm.controls['confirmPassword'].setValue('Pa$$word094');
      const matchPass = component.matchPasswords();

      expect(matchPass).toBe(true);
    });
  });

  describe('updateProfile', () => {
    it('should update user data', () => {
      mockUsersService.updateCurrentUser.and.returnValue(of(mockUserWithToken));
      spyOn(sessionStorage, 'setItem');
      component.updateProfile();

      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'token',
        '"Bearer token"',
      );
      expect(sessionStorage.setItem).toHaveBeenCalledWith('exp', '60');
      expect(mockUsersService.user$.value).toEqual(mockUserWithToken.user);
    });

    it('should update user data with new password', () => {
      component.profileForm.controls['newPassword'].setValue('Pa$$word094');
      mockUsersService.updateCurrentUser.and.returnValue(of(mockUserWithToken));
      spyOn(sessionStorage, 'setItem');
      component.updateProfile();

      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'token',
        '"Bearer token"',
      );
      expect(mockUsersService.user$.value).toEqual(mockUserWithToken.user);
      expect(sessionStorage.setItem).toHaveBeenCalledWith('exp', '60');
    });

    it('should open dialog', () => {
      mockUsersService.updateCurrentUser.and.returnValue(
        throwError(() => ({
          status: HttpStatusCode.BadRequest,
          error: {
            error: 'Password Error',
          },
        })),
      );
      component.updateProfile();

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(
        DialogTypeEnum.Alert,
        {
          title: 'ПОВІДОМЛЕННЯ',
          text: 'Ви ввели неправильний пароль. Перевірте пароль та повторіть спробу.',
        },
      );
    });
  });

  describe('deleteProfile', () => {
    it('should clear session storage, open success dialog and redirect', () => {
      mockUsersService.deleteCurrentUser.and.returnValue(of(void 0));
      spyOn(sessionStorage, 'removeItem');
      component.deleteProfile();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('token');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('exp');
      expect(mockDialogService.openDialog).toHaveBeenCalledWith(
        DialogTypeEnum.Alert,
        {
          title: 'ПОВІДОМЛЕННЯ',
          text: 'Профіль успішно видалено.',
        },
      );
    });

    it('should open error dialog', () => {
      mockUsersService.deleteCurrentUser.and.returnValue(
        throwError(() => void 0),
      );
      component.deleteProfile();

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(
        DialogTypeEnum.Alert,
        {
          title: 'ПОВІДОМЛЕННЯ',
          text: 'Щось пішло не так. Повторіть спробу пізніше.',
        },
      );
    });
  });

  describe('confirmDelete', () => {
    it('should delete profile', () => {
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(true));
      spyOn(component, 'deleteProfile');
      component.confirmDelete();

      expect(component.deleteProfile).toHaveBeenCalled();
    });

    it('should not delete profile', () => {
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(false));
      spyOn(component, 'deleteProfile');
      component.confirmDelete();

      expect(component.deleteProfile).not.toHaveBeenCalled();
    });
  });

  describe('initUser', () => {
    it('should init user', () => {
      mockUsersService.user$.next(mockUser);
      spyOn(component, 'initProfileForm');
      component.initUser();

      expect(component.user).toEqual(mockUser);
      expect(component.initProfileForm).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('initProfileForm', () => {
    it('should set fields in profile form', () => {
      component.initProfileForm(mockUser);

      expect(component.profileForm.controls['email'].value).toBe(
        mockUser.email,
      );
      expect(component.profileForm.controls['firstName'].value).toBe(
        mockUser.firstName,
      );
      expect(component.profileForm.controls['lastName'].value).toBe(
        mockUser.lastName,
      );
    });
  });

  describe('clearPasswordFields', () => {
    it('should set fields in profile form', () => {
      component.clearPasswordFields();

      expect(component.profileForm.controls['password'].value).toBe('');
      expect(component.profileForm.controls['newPassword'].value).toBe('');
      expect(component.profileForm.controls['confirmPassword'].value).toBe('');
    });
  });

  describe('confirmDeletePhoto', () => {
    it('should delete photo', () => {
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(true));
      spyOn(component, 'deletePhoto');
      component.confirmDeletePhoto();

      expect(component.deletePhoto).toHaveBeenCalled();
    });

    it('should not delete photo', () => {
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(false));
      spyOn(component, 'deletePhoto');
      component.confirmDeletePhoto();

      expect(component.deletePhoto).not.toHaveBeenCalled();
    });
  });

  describe('deletePhoto', () => {
    it('should update session storage and open success dialog', () => {
      mockUsersService.deleteCurrentUserPhoto.and.returnValue(
        of(mockUserWithToken),
      );
      spyOn(sessionStorage, 'setItem');
      component.deletePhoto();

      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'token',
        '"Bearer token"',
      );
      expect(sessionStorage.setItem).toHaveBeenCalledWith('exp', '60');
      expect(mockUsersService.user$.value).toEqual(mockUserWithToken.user);
    });

    it('should open dialog', () => {
      mockUsersService.deleteCurrentUserPhoto.and.returnValue(
        throwError(() => void 0),
      );
      component.deletePhoto();

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(
        DialogTypeEnum.Alert,
        {
          title: 'ПОВІДОМЛЕННЯ',
          text: 'Щось пішло не так. Повторіть спробу пізніше.',
        },
      );
    });
  });

  describe('updatePhoto', () => {
    const mockEvent = {
      target: {
        files: new File([], 'file'),
      },
    };

    it('should update session storage and open success dialog', () => {
      mockUsersService.updateCurrentUserPhoto.and.returnValue(
        of(mockUserWithToken),
      );
      spyOn(sessionStorage, 'setItem');
      component.updatePhoto(mockEvent as unknown as Event);

      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'token',
        '"Bearer token"',
      );
      expect(sessionStorage.setItem).toHaveBeenCalledWith('exp', '60');
      expect(mockUsersService.user$.value).toEqual(mockUserWithToken.user);
    });

    it('should open dialog', () => {
      mockUsersService.updateCurrentUserPhoto.and.returnValue(
        throwError(() => void 0),
      );
      component.updatePhoto(mockEvent as unknown as Event);

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(
        DialogTypeEnum.Alert,
        {
          title: 'ПОВІДОМЛЕННЯ',
          text: 'Щось пішло не так. Повторіть спробу пізніше.',
        },
      );
    });
  });
});
