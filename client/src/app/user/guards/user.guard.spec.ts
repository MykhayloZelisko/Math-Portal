import { TestBed } from '@angular/core/testing';

import { UserGuard } from './user.guard';
import { UsersService } from '../../shared/services/users.service';
import { BehaviorSubject } from 'rxjs';
import { UserInterface } from '../../shared/models/interfaces/user.interface';

describe('UserGuard', () => {
  let guard: UserGuard;
  let mockUsersService: jasmine.SpyObj<UsersService>;

  beforeEach(() => {
    mockUsersService = jasmine.createSpyObj('UsersService', [], {
      user$: new BehaviorSubject<UserInterface | null>(null),
    });

    TestBed.configureTestingModule({
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    });
    guard = TestBed.inject(UserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
