import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { loaderInterceptor } from './loader.interceptor';
import { LoaderService } from '../shared/services/loader.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('loaderInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => loaderInterceptor(req, next));
  let mockLoaderService: jasmine.SpyObj<LoaderService>;
  let httpController: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    mockLoaderService = jasmine.createSpyObj('LoaderService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        { provide: LoaderService, useValue: mockLoaderService },
        provideHttpClient(withInterceptors([loaderInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should hide loader when request completes', () => {
    const requestUrl = '/api/some-endpoint';
    const requestData = { test: 'data' };
    http.post(requestUrl, requestData).subscribe();
    const req = httpController.expectOne(requestUrl);

    expect(mockLoaderService.show).toHaveBeenCalled();

    req.flush({});

    expect(mockLoaderService.hide).toHaveBeenCalled();
  });
});
