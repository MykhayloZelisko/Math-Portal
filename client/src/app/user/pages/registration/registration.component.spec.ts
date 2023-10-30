import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import { AuthService } from '../../../auth/services/auth.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpStatusCode } from '@angular/common/http';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockRouter: jasmine.SpyObj<Router>

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['registration']);
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [RegistrationComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('registration', () => {
    it('should call navigateByUrl', () => {
      mockAuthService.registration.and.returnValue(of(void 0));
      component.registration();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('login');
    });

    it('should open dialog', () => {
      mockAuthService.registration.and.returnValue(throwError(() => ({status: HttpStatusCode.Conflict})));
      component.registration();

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.ConflictRegistration, {
        title: 'ПОВІДОМЛЕННЯ',
        text: `${component.registrationForm.controls['email'].value}`,
      });
    });
  });

  describe('showMessage', () => {
    it('should return null', () => {
      component.registrationForm.controls['firstName'].setValue('John');
      component.showMessage('firstName');

      expect(component.showMessage('firstName')).toEqual(null as unknown as string);
    });

    it('should return string', () => {
      component.registrationForm.controls['firstName'].setValue('John1');
      component.showMessage('firstName');

      expect(component.showMessage('firstName')).toBe(`Не валідне ім'я/прізвище`);
    });
  });

  describe('matchPasswords', () => {
    it('should return false when password field is empty', () => {
      component.registrationForm.controls['password'].setValue('');
      component.matchPasswords();

      expect(component.matchPasswords()).toBe(false)
    });

    it('should return false when confirmPassword field is empty', () => {
      component.registrationForm.controls['password'].setValue('Pa$$word094');
      component.registrationForm.controls['confirmPassword'].setValue('');
      component.matchPasswords();

      expect(component.matchPasswords()).toBe(false);
    });

    it('should return false when confirmPassword and password fields are different', () => {
      component.registrationForm.controls['password'].setValue('Pa$$word094');
      component.registrationForm.controls['confirmPassword'].setValue('Pa$$word091');
      component.matchPasswords();

      expect(component.matchPasswords()).toBe(false);
    });

    it('should return true when confirmPassword and password fields are the same', () => {
      component.registrationForm.controls['password'].setValue('Pa$$word094');
      component.registrationForm.controls['confirmPassword'].setValue('Pa$$word094');
      component.matchPasswords();

      expect(component.matchPasswords()).toBe(true);
    });
  });
});
