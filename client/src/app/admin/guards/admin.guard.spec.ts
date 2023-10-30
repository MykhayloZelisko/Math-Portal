import { TestBed } from '@angular/core/testing';

import { AdminGuard } from './admin.guard';
import { UsersService } from '../../shared/services/users.service';
import { BehaviorSubject } from 'rxjs';
import { UserInterface } from '../../shared/models/interfaces/user.interface';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let mockUsersService: jasmine.SpyObj<UsersService>;

  beforeEach(() => {
    mockUsersService = jasmine.createSpyObj('UsersService', [], {
      user$: new BehaviorSubject<UserInterface | null>(null),
    });

    TestBed.configureTestingModule({
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    });
    guard = TestBed.inject(AdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
