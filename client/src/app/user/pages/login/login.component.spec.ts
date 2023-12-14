import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../auth/services/auth.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { UsersService } from '../../../shared/services/users.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TokenInterface } from '../../../shared/models/interfaces/token.interface';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { HttpStatusCode } from '@angular/common/http';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockRouter: jasmine.SpyObj<Router>;
  const mockToken: TokenInterface = {
    token: 'token',
    exp: 120,
  };
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

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);
    mockUsersService = jasmine.createSpyObj('UsersService', [
      'updateUserData',
      'getCurrentUser',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('registration', () => {
    it('should redirect', () => {
      component.registration();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('registration');
    });
  });

  describe('showMessage', () => {
    it('should return null', () => {
      component.loginForm.controls['email'].setValue('login@mail.mail');
      const message = component.showMessage('email');

      expect(message).toEqual(null as unknown as string);
    });

    it('should return string', () => {
      component.loginForm.controls['email'].setValue('');
      const message = component.showMessage('email');

      expect(message).toBe(`Поле обов'язкове для заповнення`);
    });
  });

  describe('login', () => {
    it('should update user data and redirect', () => {
      mockAuthService.login.and.returnValue(of(mockToken));
      spyOn(sessionStorage, 'setItem');
      mockUsersService.getCurrentUser.and.returnValue(of(mockUser));
      component.login();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('');
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'token',
        '"Bearer token"',
      );
      expect(sessionStorage.setItem).toHaveBeenCalledWith('exp', '120');
      expect(mockUsersService.updateUserData).toHaveBeenCalledWith(mockUser);
    });

    it('should open dialog', () => {
      mockAuthService.login.and.returnValue(
        throwError(() => ({ status: HttpStatusCode.Unauthorized })),
      );
      component.login();

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(
        DialogTypeEnum.Alert,
        {
          title: 'ПОВІДОМЛЕННЯ',
          text: 'Невірна електронна пошта або пароль. Перевірте введені дані та повторіть спробу.',
        },
      );
    });
  });
});
