import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';
import { editArticleGuard } from './edit-article.guard';

describe('editArticleGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => editArticleGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
