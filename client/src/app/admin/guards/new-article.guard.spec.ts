import { TestBed } from '@angular/core/testing';

import { NewArticleGuard } from './new-article.guard';
import { DialogService } from '../../shared/services/dialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { NewArticleComponent } from '../pages/new-article/new-article.component';
import { CreateArticleInterface } from '../../shared/models/interfaces/create-article.interface';
import { of } from 'rxjs';
import { DialogTypeEnum } from '../../shared/models/enums/dialog-type.enum';

describe('NewArticleGuard', () => {
  let guard: NewArticleGuard;
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
    guard = TestBed.inject(NewArticleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canDeactivate', () => {
    it('should return true if newArticle is empty is invalid or session is not active', (done) => {
      const component = {
        newArticle: {
          title: '',
          content: '',
          tagsIds: [],
        } as CreateArticleInterface,
      } as NewArticleComponent;
      spyOn(sessionStorage, 'getItem').and.returnValue('someToken');
      spyOn(JSON, 'parse').and.returnValue(1);

      guard.canDeactivate(component).subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should open dialog and return true after closing it', (done) => {
      const component = {
        newArticle: {
          title: '',
          content: '',
          tagsIds: ['66165442-5cd2-40ef-a901-74e40dd9daa4'],
        },
      } as NewArticleComponent;
      spyOn(sessionStorage, 'getItem').and.returnValue('token');
      spyOn(JSON, 'parse').and.returnValue(Date.now() + 20000);
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(true));

      guard.canDeactivate(component).subscribe((result) => {
        expect(mockDialogService.openDialog).toHaveBeenCalledWith(
          DialogTypeEnum.ConfirmRedirect,
          {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Ви покидаєте сторінку. Всі незбережені дані будуть втрачені.',
          },
        );
        expect(result).toBe(true);
        done();
      });
    });
  });
});
