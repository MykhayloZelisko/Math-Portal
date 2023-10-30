import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserInterface } from '../models/interfaces/user.interface';
import { UserWithTokenInterface } from '../models/interfaces/user-with-token.interface';
import { UserWithNullTokenInterface } from '../models/interfaces/user-with-null-token.interface';
import { UpdateUserRoleInterface } from '../models/interfaces/update-user-role.interface';
import { UsersTableInterface } from '../models/interfaces/users-table.interface';
import { UsersTableParamsInterface } from '../models/interfaces/users-table-params.interface';

describe('UsersService', () => {
  let service: UsersService;
  let httpController: HttpTestingController;
  const mockUser: UserInterface = {
    id: '35c90c0b-ba58-46f3-a091-bcdf66f514a8',
    email: 'mail@mail.mail',
    password: 'Pa$$word094',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    isAdmin: true,
    photo: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService],
    });
    service = TestBed.inject(UsersService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrentUser', () => {
    it('should send request', () => {
      const expectedResult: UserInterface = mockUser;
      service.getCurrentUser().subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}/current`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedResult);
      httpController.verify();
    });
  });

  describe('updateCurrentUser', () => {
    it('should send request', () => {
      const expectedResult: UserWithTokenInterface = {
        user: mockUser,
        token: {
          token: 'token',
          exp: 60,
        },
      };
      service.updateCurrentUser(mockUser).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}/current`);
      expect(req.request.method).toBe('PUT');
      req.flush(expectedResult);
      httpController.verify();
    });
  });

  describe('deleteCurrentUser', () => {
    it('should send request', () => {
      service.deleteCurrentUser().subscribe();

      const req = httpController.expectOne(`${service.baseUrl}/current`);
      expect(req.request.method).toBe('DELETE');
      httpController.verify();
    });
  });

  describe('deleteCurrentUserPhoto', () => {
    it('should send request', () => {
      const expectedResult: UserWithTokenInterface = {
        user: {
          ...mockUser,
          photo: null,
        },
        token: {
          token: 'token',
          exp: 60,
        },
      };
      service.deleteCurrentUserPhoto().subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}/current/photo`);
      expect(req.request.method).toBe('DELETE');
      req.flush(expectedResult);
      httpController.verify();
    });
  });

  describe('deleteUser', () => {
    it('should send request', () => {
      const id = '35c90c0b-ba58-46f3-a091-bcdf66f514a8';
      service.deleteUser(id).subscribe();

      const req = httpController.expectOne(`${service.baseUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
      httpController.verify();
    });
  });

  describe('updateUserRole', () => {
    it('should send request', () => {
      const mockData: UpdateUserRoleInterface = {
        userId: '35c90c0b-ba58-46f3-a091-bcdf66f514a8',
        isAdmin: false,
      };
      const expectedResult: UserWithNullTokenInterface = {
        user: {
          ...mockUser,
          isAdmin: mockData.isAdmin,
        },
        token: null,
      };
      service.updateUserRole(mockData).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}/role`);
      expect(req.request.method).toBe('PUT');
      req.flush(expectedResult);
      httpController.verify();
    });
  });

  describe('updateUserData', () => {
    it('should update user with photo', () => {
      const user = {
        ...mockUser,
        photo: 'photo',
      };
      const expectedUser = {
        ...user,
        photo: `http://localhost:3000/${user.photo}`,
      };
      service.updateUserData(user);

      expect(service.user$.value).toEqual(expectedUser);
    });

    it('should update user without photo', () => {
      const user = {
        ...mockUser,
        photo: null,
      };
      service.updateUserData(user);

      expect(service.user$.value).toEqual(user);
    });

    it('should delete user from subject', () => {
      service.updateUserData(null);

      expect(service.user$.value).toBe(null);
    });
  });

  describe('updateCurrentUserPhoto', () => {
    it('should send request', () => {
      const mockFile = new File([], 'fileName');
      const expectedResult: UserWithTokenInterface = {
        user: {
          ...mockUser,
          photo: 'photo',
        },
        token: {
          token: 'token',
          exp: 60,
        },
      };
      service.updateCurrentUserPhoto(mockFile).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}/current/photo`);
      expect(req.request.method).toBe('PUT');
      req.flush(expectedResult);
      httpController.verify();
    });
  });

  describe('getUsersList', () => {
    it('should send request', () => {
      const mockUser2: UserInterface = {
        ...mockUser,
        id: '35c90c0b-ba58-46f3-a091-bcdf66f524a8',
      };
      const expectedResult: UsersTableInterface = {
        total: 2,
        users: [mockUser, mockUser2],
      };
      const params: UsersTableParamsInterface = {
        filter: '',
        sortByName: 'default',
        sortByRole: 'default',
        page: 1,
        size: 10,
      };
      const reqUrl = `${service.baseUrl}?page=${params.page}&size=${params.size}&sortByName=${params.sortByName}&sortByRole=${params.sortByRole}&filter=${params.filter}`;
      service.getUsersList(params).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(reqUrl);
      expect(req.request.method).toBe('GET');
      req.flush(expectedResult);
      httpController.verify();
    });
  });
});
