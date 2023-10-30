import { TestBed } from '@angular/core/testing';

import { NewArticleGuard } from './new-article.guard';
import { DialogService } from '../../shared/services/dialog.service';

describe('NewArticleGuard', () => {
  let guard: NewArticleGuard;
  let mockDialogService: jasmine.SpyObj<DialogService>;

  beforeEach(() => {
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);

    TestBed.configureTestingModule({
      providers: [{ provide: DialogService, useValue: mockDialogService }],
    });
    guard = TestBed.inject(NewArticleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
