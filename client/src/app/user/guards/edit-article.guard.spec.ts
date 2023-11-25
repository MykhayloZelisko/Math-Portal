import { TestBed } from '@angular/core/testing';

import { EditArticleGuard } from './edit-article.guard';
import { DialogService } from '../../shared/services/dialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ArticleComponent } from '../pages/articles/pages/article/article.component';
import { TagInterface } from '../../shared/models/interfaces/tag.interface';
import { ArticleInterface } from '../../shared/models/interfaces/article.interface';
import { of } from 'rxjs';
import { DialogTypeEnum } from '../../shared/models/enums/dialog-type.enum';

describe('EditArticleGuard', () => {
  let guard: EditArticleGuard;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DialogComponent>>;
  const mockTag: TagInterface = {
    id: '34bacf2d-5c59-4897-a2f7-7a546e0c5d1a',
    value: 'Tag',
  };
  const mockTag2: TagInterface = {
    id: '34bacf2d-5c59-4897-a2f7-7a546fff5d1a',
    value: 'Tag 2',
  };
  const mockArticle: ArticleInterface = {
    id: 'a41230b5-4566-4db5-bb0d-5cdbf7e318f3',
    title: 'Title',
    content: 'Content',
    rating: 3.7,
    votes: 5,
    tags: [mockTag, mockTag2],
  };

  beforeEach(() => {
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);
    mockDialogRef = jasmine.createSpyObj('DialogRef', ['afterClosed']);

    TestBed.configureTestingModule({
      providers: [
        { provide: DialogService, useValue: mockDialogService },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    });
    guard = TestBed.inject(EditArticleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canDeactivate', () => {
    it('should return true when isEditable is equal false', (done) => {
      const component = { isEditable: false } as ArticleComponent;
      guard.canDeactivate(component).subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should return true when article is equal newArticle and isEditable is equal true', (done) => {
      const mockTagsIds = mockArticle.tags.map((tag) => tag.id);
      const component = {
        isEditable: true,
        article: mockArticle,
        newArticle: {
          title: mockArticle.title,
          content: mockArticle.content,
          tagsIds: mockTagsIds,
        },
      } as ArticleComponent;
      guard.canDeactivate(component).subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should open dialog and return false when article is not equal newArticle', (done) => {
      const mockTagsIds = [mockTag.id];
      const component = {
        isEditable: true,
        article: mockArticle,
        newArticle: {
          title: mockArticle.title,
          content: mockArticle.content,
          tagsIds: mockTagsIds,
        },
      } as ArticleComponent;
      spyOn(sessionStorage, 'getItem').and.returnValue(String(Date.now()));
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(false));
      guard.canDeactivate(component).subscribe((result) => {
        expect(result).toBe(false);
        expect(mockDialogService.openDialog).toHaveBeenCalledWith(
          DialogTypeEnum.ConfirmRedirect,
          {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Ви покидаєте сторінку. Всі незбережені дані будуть втрачені.',
          },
        );
        done();
      });
    });
  });
});
