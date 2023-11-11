import { TestBed } from '@angular/core/testing';

import { ProfileGuard } from './profile.guard';
import { DialogService } from '../../shared/services/dialog.service';
import { ProfileComponent } from '../pages/profile/profile.component';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { of } from 'rxjs';
import { DialogTypeEnum } from '../../shared/models/enums/dialog-type.enum';

describe('ProfileGuard', () => {
  let guard: ProfileGuard;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DialogComponent>>;

  beforeEach(() => {
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);
    mockDialogRef = jasmine.createSpyObj('DialogRef', ['afterClosed']);

    TestBed.configureTestingModule({
      providers: [
        { provide: DialogService, useValue: mockDialogService },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    });
    guard = TestBed.inject(ProfileGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canDeactivate', () => {
    it('should return true if profileForm is invalid or session is not active', (done) => {
      const component = { profileForm: { valid: false } } as ProfileComponent;
      spyOn(sessionStorage, 'getItem').and.returnValue('someToken');
      spyOn(JSON, 'parse').and.returnValue(1);

      guard.canDeactivate(component).subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should open dialog and return false after closing it', (done) => {
      const component = { profileForm: { valid: true } } as ProfileComponent;
      spyOn(sessionStorage, 'getItem').and.returnValue('someToken');
      spyOn(JSON, 'parse').and.returnValue(Date.now() + 10000);
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(false));

      guard.canDeactivate(component).subscribe((result) => {
        expect(mockDialogService.openDialog).toHaveBeenCalledWith(
          DialogTypeEnum.ConfirmRedirect,
          {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Ви покидаєте сторінку. Всі незбережені дані будуть втрачені.',
          },
        );
        expect(result).toBe(false);
        done();
      });
    });
  });
});
