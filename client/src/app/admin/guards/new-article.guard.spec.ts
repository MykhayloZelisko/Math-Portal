import { TestBed } from '@angular/core/testing';

import { NewArticleGuard } from './new-article.guard';

describe('NewArticleGuard', () => {
  let guard: NewArticleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NewArticleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
