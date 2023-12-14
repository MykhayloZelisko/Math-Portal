import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { userGuard } from './user.guard';
import { UsersService } from '../../shared/services/users.service';
import { UserInterface } from '../../shared/models/interfaces/user.interface';
import { BehaviorSubject } from 'rxjs';

describe('userGuard', () => {
  const guard: CanActivateFn = () =>
    // eslint-disable-next-line
    // @ts-ignore
    TestBed.runInInjectionContext(() => userGuard());
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
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should not redirect', (done) => {
      mockUsersService.user$.next(mockUser);
      // eslint-disable-next-line
      // @ts-ignore
      guard().subscribe((result: boolean | UrlTree) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should redirect', (done) => {
      mockUsersService.user$.next(null);
      const urlTree: UrlTree = {} as UrlTree;
      mockRouter.parseUrl.and.returnValue(urlTree);
      // eslint-disable-next-line
      // @ts-ignore
      guard().subscribe((result: boolean | UrlTree) => {
        expect(result).toBe(urlTree);
        expect(mockRouter.parseUrl).toHaveBeenCalledWith('/');
        done();
      });
    });
  });
});
