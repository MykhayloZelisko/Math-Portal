import { TestBed } from '@angular/core/testing';

import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderService],
    });
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('should show loader', () => {
      service.isLoading$.subscribe((value: boolean) => {
        expect(value).toBe(true);
      });
      service.show();
    });
  });

  describe('hide', () => {
    it('should hide loader', () => {
      service.isLoading$.subscribe((value: boolean) => {
        expect(value).toBe(false);
      });
      service.hide();
    });
  });
});
