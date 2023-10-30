import { TestBed } from '@angular/core/testing';

import { ProfileGuard } from './profile.guard';
import { DialogService } from '../../shared/services/dialog.service';

describe('ProfileGuard', () => {
  let guard: ProfileGuard;
  let mockDialogService: jasmine.SpyObj<DialogService>;

  beforeEach(() => {
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);

    TestBed.configureTestingModule({
      providers: [{ provide: DialogService, useValue: mockDialogService }],
    });
    guard = TestBed.inject(ProfileGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
