import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';
import { profileGuard } from './profile.guard';
import { ProfileComponent } from '../pages/profile/profile.component';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { of } from 'rxjs';
import { DialogTypeEnum } from '../../shared/models/enums/dialog-type.enum';
import { DialogService } from '../../shared/services/dialog.service';

describe('profileGuard', () => {
  const guard: CanDeactivateFn<ProfileComponent> = (
    component: ProfileComponent,
  ) =>
    // eslint-disable-next-line
    // @ts-ignore
    TestBed.runInInjectionContext(() => profileGuard(component));
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
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canDeactivate', () => {
    it('should return true if profileForm is invalid or session is not active', (done) => {
      const component = { profileForm: { valid: false } } as ProfileComponent;
      spyOn(sessionStorage, 'getItem').and.returnValue('someToken');
      spyOn(JSON, 'parse').and.returnValue(1);

      // eslint-disable-next-line
      // @ts-ignore
      guard(component).subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should open dialog and return false after closing it', (done) => {
      const component = { profileForm: { valid: true } } as ProfileComponent;
      spyOn(sessionStorage, 'getItem').and.returnValue('someToken');
      spyOn(JSON, 'parse').and.returnValue(Date.now());
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(false));

      // eslint-disable-next-line
      // @ts-ignore
      guard(component).subscribe((result) => {
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
