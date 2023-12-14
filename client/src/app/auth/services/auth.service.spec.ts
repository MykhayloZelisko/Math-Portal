import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RegistrationInterface } from '../../shared/models/interfaces/registration.interface';
import { TokenInterface } from '../../shared/models/interfaces/token.interface';
import { LoginInterface } from '../../shared/models/interfaces/login.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registration', () => {
    it('should send request', () => {
      const mockRegData: RegistrationInterface = {
        email: 'mail@mail.mail',
        firstName: 'John',
        lastName: 'Doe',
        password: 'Pa$$word094',
      };
      service.registration(mockRegData).subscribe();

      const req = httpController.expectOne(`${service.baseUrl}/registration`);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('login', () => {
    it('should send request', () => {
      const mockLoginData: LoginInterface = {
        login: 'login',
        password: 'password',
      };
      const expectedResult: TokenInterface = {
        token: 'mock token',
        exp: 60,
      };
      service.login(mockLoginData).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}/login`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedResult);
    });
  });
});
