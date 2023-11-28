import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { DialogService } from '../../shared/services/dialog.service';
import { UsersService } from '../../shared/services/users.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DialogTypeEnum } from '../../shared/models/enums/dialog-type.enum';

describe('AuthInterceptor', () => {
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DialogComponent>>;
  let httpController: HttpTestingController;
  let http: HttpClient;
  let router: Router;

  beforeEach(() => {
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['updateUserData']);
    mockDialogRef = jasmine.createSpyObj('DialogRef', ['afterClosed']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: DialogService, useValue: mockDialogService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });

    httpController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should open dialog but not redirect after closing it', () => {
    const requestUrl = '/articles';
    spyOn(sessionStorage, 'getItem').and.returnValue('1');
    // eslint-disable-next-line
    // @ts-ignore: force this private property value for testing.
    router.currentUrlTree = router.parseUrl('/articles');
    spyOn(router, 'navigateByUrl');
    mockDialogService.openDialog.and.returnValue(mockDialogRef);
    mockDialogRef.afterClosed.and.returnValue(of(true));

    http.get(requestUrl).subscribe({
      error: () => {
        expect(mockDialogService.openDialog).toHaveBeenCalledWith(
          DialogTypeEnum.JWTAlert,
          {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Закінчився термін дії токена. Ви будете вилогінені з системи.',
          },
        );
        expect(router.navigateByUrl).not.toHaveBeenCalled();
      },
    });

    const req = httpController.expectOne(requestUrl);
    req.error(new ProgressEvent('error'));
  });

  it('should redirect after closing dialog', () => {
    const requestUrl = '/articles';
    spyOn(sessionStorage, 'getItem').and.returnValue('1');
    // eslint-disable-next-line
    // @ts-ignore: force this private property value for testing.
    router.currentUrlTree = router.parseUrl('/profile');
    spyOn(router, 'navigateByUrl');
    mockDialogService.openDialog.and.returnValue(mockDialogRef);
    mockDialogRef.afterClosed.and.returnValue(of(true));

    http.get(requestUrl).subscribe({
      error: () => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('');
      },
    });
    const req = httpController.expectOne(requestUrl);
    req.error(new ProgressEvent('error'));
  });

  it('should not modify a request', () => {
    const requestUrls = ['auth/login', 'articles', 'comments', 'tags'];
    spyOn(sessionStorage, 'getItem').and.returnValue('token');
    spyOn(JSON, 'parse').and.returnValue(Date.now());
    requestUrls.forEach((requestUrl) => {
      http.get(requestUrl).subscribe();
      const req = httpController.expectOne(requestUrl);
      req.flush({});

      expect(req.request.headers.has('Authorization')).toBe(false);
    });
  });

  it('should add authorization header to a request', () => {
    const requestUrl = 'users';
    spyOn(sessionStorage, 'getItem').and.returnValue('"token"');
    http.get(requestUrl).subscribe();
    const req = httpController.expectOne(requestUrl);
    req.flush({});

    expect(req.request.headers.has('Authorization')).toBe(true);
  });

  it('should not have Authorization header', () => {
    const requestUrl = 'users';
    spyOn(router, 'navigateByUrl');
    spyOn(sessionStorage, 'getItem').and.returnValue('');

    http.get(requestUrl).subscribe({
      error: () => {
        expect(router.navigateByUrl).not.toHaveBeenCalled();
      },
    });
    const req = httpController.expectOne(requestUrl);
    req.error(new ProgressEvent('error'));
  });
});
