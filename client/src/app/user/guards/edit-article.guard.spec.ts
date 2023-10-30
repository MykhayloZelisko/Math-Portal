import { TestBed } from '@angular/core/testing';

import { EditArticleGuard } from './edit-article.guard';
import { DialogService } from '../../shared/services/dialog.service';

describe('EditArticleGuard', () => {
  let guard: EditArticleGuard;
  let mockDialogService: jasmine.SpyObj<DialogService>;

  beforeEach(() => {
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);

    TestBed.configureTestingModule({
      providers: [{ provide: DialogService, useValue: mockDialogService }],
    });
    guard = TestBed.inject(EditArticleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
