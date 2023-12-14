import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { UsersService } from '../../../shared/services/users.service';
import { BehaviorSubject } from 'rxjs';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { RouterTestingModule } from '@angular/router/testing';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
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
  let router: Router;

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj(
      'UsersService',
      ['updateUserData'],
      {
        user$: new BehaviorSubject<UserInterface | null>(mockUser),
      },
    );
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initUser', () => {
    it('should set user when user$ emits a value', () => {
      mockUsersService.user$.next(mockUser);
      component.initUser();
      expect(component.user).toEqual(mockUser);
    });
  });

  describe('openDropDown', () => {
    it('should open dropdown', () => {
      component.isActiveDropDown = false;
      component.openDropDown();
      expect(component.isActiveDropDown).toBe(true);
    });
  });

  describe('closeDropDown', () => {
    it('should close dropdown', () => {
      component.closeDropDown();
      expect(component.isActiveDropDown).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear sessionStorage and user data', () => {
      const sessionStorageSpy = spyOn(sessionStorage, 'removeItem');
      component.logout();
      expect(sessionStorageSpy).toHaveBeenCalledWith('token');
      expect(sessionStorageSpy).toHaveBeenCalledWith('exp');
      expect(mockUsersService.updateUserData).toHaveBeenCalledWith(null);
    });

    it('should redirect', () => {
      spyOn(router, 'navigateByUrl');
      spyOnProperty(router, 'url', 'get').and.returnValue('/profile');
      component.logout();

      expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('should not redirect', () => {
      spyOn(router, 'navigateByUrl');
      spyOnProperty(router, 'url', 'get').and.returnValue('/articles');
      component.logout();

      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });
});
