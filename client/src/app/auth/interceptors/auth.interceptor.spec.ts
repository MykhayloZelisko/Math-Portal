import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { DialogService } from '../../shared/services/dialog.service';
import { UsersService } from '../../shared/services/users.service';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;

  beforeEach(() => {
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['updateUserData']);

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: DialogService, useValue: mockDialogService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    });

    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
