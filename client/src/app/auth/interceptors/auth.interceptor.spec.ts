import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { DialogService } from '../../shared/services/dialog.service';
import { UsersService } from '../../shared/services/users.service';

describe('AuthInterceptor', () => {
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
  });

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
