import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';
import { newArticleGuard } from './new-article.guard';

describe('newArticleGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => newArticleGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
