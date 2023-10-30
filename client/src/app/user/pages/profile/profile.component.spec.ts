import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { UsersService } from '../../../shared/services/users.service';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { BehaviorSubject } from 'rxjs';
import { DialogService } from '../../../shared/services/dialog.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
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
    mockUsersService = jasmine.createSpyObj(
      'UsersService',
      ['updateCurrentUser', 'updateUserData', 'deleteCurrentUser'],
      {
        user$: new BehaviorSubject<UserInterface | null>(mockUser),
      },
    );
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: DialogService, useValue: mockDialogService },
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
      component.showMessage('firstName');

      expect(component.showMessage('firstName')).toEqual(null as unknown as string);
    });

    it('should return string', () => {
      component.profileForm.controls['firstName'].setValue('John1');
      component.showMessage('firstName');

      expect(component.showMessage('firstName')).toBe(`Не валідне ім'я/прізвище`);
    });
  });

  describe('matchPasswords', () => {
    it('should return false when confirmPassword and password fields are different', () => {
      component.profileForm.controls['newPassword'].setValue('Pa$$word094');
      component.profileForm.controls['confirmPassword'].setValue('Pa$$word091');
      component.matchPasswords();

      expect(component.matchPasswords()).toBe(false);
    });

    it('should return true when confirmPassword and password fields are the same', () => {
      component.profileForm.controls['newPassword'].setValue('Pa$$word094');
      component.profileForm.controls['confirmPassword'].setValue('Pa$$word094');
      component.matchPasswords();

      expect(component.matchPasswords()).toBe(true);
    });
  });
});
