import { TestBed } from '@angular/core/testing';

import { UserGuard } from './user.guard';
import { UsersService } from '../../shared/services/users.service';
import { BehaviorSubject } from 'rxjs';
import { UserInterface } from '../../shared/models/interfaces/user.interface';
import { Router, UrlTree } from '@angular/router';

describe('UserGuard', () => {
  let guard: UserGuard;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockRouter: jasmine.SpyObj<Router>;
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

  beforeEach(() => {
    mockUsersService = jasmine.createSpyObj('UsersService', [], {
      user$: new BehaviorSubject<UserInterface | null>(null),
    });
    mockRouter = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: Router, useValue: mockRouter },
      ],
    });
    guard = TestBed.inject(UserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should not redirect', (done) => {
      mockUsersService.user$.next(mockUser);
      guard.canActivate().subscribe((result: boolean | UrlTree) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should redirect', (done) => {
      mockUsersService.user$.next(null);
      const urlTree: UrlTree = {} as UrlTree;
      mockRouter.parseUrl.and.returnValue(urlTree);
      guard.canActivate().subscribe((result: boolean | UrlTree) => {
        expect(result).toBe(urlTree);
        expect(mockRouter.parseUrl).toHaveBeenCalledWith('/');
        done();
      });
    });
  });
});
