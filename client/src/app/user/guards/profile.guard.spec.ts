import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';
import { profileGuard } from './profile.guard';

describe('profileGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => profileGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
