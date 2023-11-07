import { TestBed } from '@angular/core/testing';

import { LoaderInterceptor } from './loader.interceptor';
import { LoaderService } from '../shared/services/loader.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

describe('LoaderInterceptor', () => {
  let mockLoaderService: jasmine.SpyObj<LoaderService>;
  let httpController: HttpTestingController;
  let interceptor: LoaderInterceptor;
  let http: HttpClient;

  beforeEach(() => {
    mockLoaderService = jasmine.createSpyObj('LoaderService', ['show', 'hide']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoaderInterceptor,
        { provide: LoaderService, useValue: mockLoaderService },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoaderInterceptor,
          multi: true,
        },
      ],
    });
    interceptor = TestBed.inject(LoaderInterceptor);
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
