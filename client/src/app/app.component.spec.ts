import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { UsersService } from './shared/services/users.service';
import { UserInterface } from './shared/models/interfaces/user.interface';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
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
    mockUsersService = jasmine.createSpyObj('UsersService', [
      'getCurrentUser',
      'updateUserData',
    ]);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getCurrentUser', () => {
      const getCurrentUserSpy = spyOn(app, 'getCurrentUser');
      app.ngOnInit();

      expect(getCurrentUserSpy).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should call updateUserData if token exists', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue('fakeToken');
      mockUsersService.getCurrentUser.and.returnValue(of(mockUser));
      app.getCurrentUser();

      expect(mockUsersService.updateUserData).toHaveBeenCalledWith(mockUser);
    });

    it('should not call usersService.getCurrentUser if token does not exist', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue(null);
      app.getCurrentUser();

      expect(mockUsersService.getCurrentUser).not.toHaveBeenCalled();
    });
  });
});
