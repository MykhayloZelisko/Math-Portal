import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { UsersService } from '../../../shared/services/users.service';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { BehaviorSubject, of } from 'rxjs';
import { DialogService } from '../../../shared/services/dialog.service';
import { UsersTableInterface } from '../../../shared/models/interfaces/users-table.interface';
import { SvgIconRegistryService } from 'angular-svg-icon';
import {
  UsersTableParamsInterface,
} from '../../../shared/models/interfaces/users-table-params.interface';
import {
  PaginatorConfigInterface,
} from '../../../shared/models/interfaces/paginator-config.interface';
import { SortColumnInterface } from '../../../shared/models/interfaces/sort-column.interface';
import {
  UsersTableColumnNameEnum,
} from '../../../shared/models/enums/users-table-column-name.enum';
import { Router } from '@angular/router';
import {
  UserWithNullTokenInterface
} from '../../../shared/models/interfaces/user-with-null-token.interface';
import {
  UpdateUserRoleInterface
} from '../../../shared/models/interfaces/update-user-role.interface';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DialogComponent>>;
  let mockRouter: jasmine.SpyObj<Router>;
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
  const mockUser2: UserInterface = {
    id: '35c90c0b-ba58-46f3-a091-bcdf66f514a1',
    email: 'mail@mail1.mail',
    password: 'Pa$$word094',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    isAdmin: false,
    photo: null,
  };
  const mockNoAdminWithToken: UserWithNullTokenInterface = {
    user: {
      ...mockUser,
      isAdmin: false,
    },
    token: {
      token: 'token',
      exp: Date.now(),
    }
  };
  const mockUserWithNullToken: UserWithNullTokenInterface = {
    user: {
      ...mockUser,
    },
    token: null,
  };
  const mockUsersList: UsersTableInterface = {
    total: 2,
    users: [mockUser, mockUser2],
  };
  const mockFilterParams: UsersTableParamsInterface = {
    sortByName: 'default',
    sortByRole: 'default',
    page: 2,
    size: 10,
    filter: '',
  };
  const mockFilterParams2: UsersTableParamsInterface = {
    sortByName: 'default',
    sortByRole: 'default',
    page: 2,
    size: 20,
    filter: '',
  };
  const mockFilterParams3: UsersTableParamsInterface = {
    sortByName: 'default',
    sortByRole: 'default',
    page: 1,
    size: 10,
    filter: '',
  };

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj(
      'UsersService',
      ['getUsersList', 'updateUserRole', 'updateUserData', 'deleteUser'],
      {
        user$: new BehaviorSubject<UserInterface | null>(mockUser),
      },
    );
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockDialogRef = jasmine.createSpyObj('DialogRef', ['afterClosed']);

    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: DialogService, useValue: mockDialogService },
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    mockUsersService.getUsersList.and.returnValue(of(mockUsersList));

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initUsersTable method', () => {
      spyOn(component, 'initUsersTable');
      component.filterParams = mockFilterParams;
      component.ngOnInit();

      expect(component.initUsersTable).toHaveBeenCalledWith(mockFilterParams);
    });
  });

  describe('initUsersTable', () => {
    it('should init table', () => {
      component.filterParams = mockFilterParams;
      component.initUsersTable(mockFilterParams);

      expect(component.usersTable).toEqual(mockUsersList);
    });
  });

  describe('onChangePaginatorConfig', () => {
    it('should change paginatorConfig and filterParams value', () => {
      spyOn(component, 'initUsersTable');
      component.filterParams =  mockFilterParams;
      const mockPaginatorConfig: PaginatorConfigInterface =  {
        itemsPerPage: 20,
        currentPage: 2,
        totalItems: 100,
      };
      component.onChangePaginatorConfig(mockPaginatorConfig);

      expect(component.paginatorConfig).toEqual(mockPaginatorConfig);
      expect(component.filterParams).toEqual(mockFilterParams2);
      expect(component.initUsersTable).toHaveBeenCalledWith(mockFilterParams2);
    });
  });

  describe('onSortColumn', () => {
    it('should sort user table by role column', () => {
      spyOn(component, 'initUsersTable');
      component.filterParams =  mockFilterParams;
      const mockSortEvent: SortColumnInterface = {
        columnName: UsersTableColumnNameEnum.Role,
        sorting: 'default',
      };
      component.onSortColumn(mockSortEvent);

      expect(component.filterParams).toEqual(mockFilterParams3);
      expect(component.initUsersTable).toHaveBeenCalledWith(mockFilterParams3);
    });

    it('should sort user table by userName column', () => {
      spyOn(component, 'initUsersTable');
      component.filterParams =  mockFilterParams;
      const mockSortEvent: SortColumnInterface = {
        columnName: UsersTableColumnNameEnum.UserName,
        sorting: 'default',
      };
      component.onSortColumn(mockSortEvent);

      expect(component.filterParams).toEqual(mockFilterParams3);
      expect(component.initUsersTable).toHaveBeenCalledWith(mockFilterParams3);
    });
  });

  describe('updateUserRole', () => {
    it('should update current user role and redirect', () => {
      mockUsersService.updateUserRole.and.returnValue(of(mockNoAdminWithToken));
      mockUsersService.updateUserData.and.returnValue(void 0);
      spyOn(sessionStorage, 'setItem');
      const mockRole: UpdateUserRoleInterface = {
        userId: '35c90c0b-ba58-46f3-a091-bcdf66f514a8',
        isAdmin: false,
      };
      component.updateUserRole(mockRole);

      expect(sessionStorage.setItem).toHaveBeenCalledWith('token', '"Bearer token"');
      expect(sessionStorage.setItem).toHaveBeenCalledWith('exp', `${mockNoAdminWithToken.token?.exp}`);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('');
    });

    it('should update another user role', () => {
      mockUsersService.updateUserRole.and.returnValue(of(mockUserWithNullToken));
      component.usersTable = {
        ...mockUsersList,
        users: [{ ...mockUser, isAdmin: false }, mockUser2],
      };
      const mockRole: UpdateUserRoleInterface = {
        userId: mockUser.id as string,
        isAdmin: true,
      };
      component.updateUserRole(mockRole);

      expect(component.usersTable).toEqual(mockUsersList);
    });
  });

  describe('confirmDelete' ,() => {
    it('should open confirm dialog and call deleteUser method with current user', () => {
      mockUsersService.user$.next(mockUser);
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(true));
      spyOn(component, 'deleteUser');
      component.confirmDelete(mockUser);

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.ConfirmDeleteProfile, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Ви впевнені, що хочете видалити свій профіль?',
      });
      expect(component.deleteUser).toHaveBeenCalledWith(mockUser.id as string);
    });

    it('should open confirm dialog but not call deleteUser method  with current user', () => {
      mockUsersService.user$.next(mockUser);
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(false));
      spyOn(component, 'deleteUser');
      component.confirmDelete(mockUser);

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.ConfirmDeleteProfile, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Ви впевнені, що хочете видалити свій профіль?',
      });
      expect(component.deleteUser).not.toHaveBeenCalled();
    });

    it('should open confirm dialog and call deleteUser method with another user', () => {
      mockUsersService.user$.next(mockUser);
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(mockUser2.id));
      spyOn(component, 'deleteUser');
      component.confirmDelete(mockUser2);

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.ConfirmDeleteOtherUser, {
        title: 'ПОВІДОМЛЕННЯ',
        text: '',
        user: mockUser2,
      });
      expect(component.deleteUser).toHaveBeenCalledWith(mockUser2.id as string);
    });

    it('should open confirm dialog but not call deleteUser method  with another user', () => {
      mockUsersService.user$.next(mockUser);
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(false));
      spyOn(component, 'deleteUser');
      component.confirmDelete(mockUser2);

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.ConfirmDeleteOtherUser, {
        title: 'ПОВІДОМЛЕННЯ',
        text: '',
        user: mockUser2,
      });
      expect(component.deleteUser).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should open success dialog, redirect and clear session storage', () => {
      mockUsersService.user$.next(mockUser);
      mockUsersService.deleteUser.and.returnValue(of(void 0));
      spyOn(sessionStorage, 'removeItem');
      component.deleteUser(mockUser.id as string);

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.Alert, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Профіль успішно видалено.',
      });
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('token');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('exp');
    });

    it('should call initUserTable method', () => {
      component.filterParams = mockFilterParams;
      mockUsersService.user$.next(mockUser);
      mockUsersService.deleteUser.and.returnValue(of(void 0));
      spyOn(component, 'initUsersTable');
      component.deleteUser(mockUser2.id as string);

      expect(component.initUsersTable).toHaveBeenCalledWith(mockFilterParams);
    });
  });

  describe('confirmUpdateUserRole', () => {
    it('should open confirm dialog and call updateUserRole method', () => {
      mockUsersService.user$.next(mockUser);
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(true));
      const mockRole: UpdateUserRoleInterface = {
        userId: mockUser.id as string,
        isAdmin: false,
      };
      spyOn(component, 'updateUserRole');
      component.confirmUpdateUserRole(mockRole);

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.ConfirmUpdateCurrentUserRole, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Ви понижуєте себе до звичайного користувача. Бажаєте продовжити?',
      });
      expect(component.updateUserRole).toHaveBeenCalledWith(mockRole);
    });

    it('should open confirm dialog and not call updateUserRole method', () => {
      mockUsersService.user$.next(mockUser);
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(false));
      const mockRole: UpdateUserRoleInterface = {
        userId: mockUser.id as string,
        isAdmin: false,
      };
      spyOn(component, 'updateUserRole');
      component.confirmUpdateUserRole(mockRole);

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.ConfirmUpdateCurrentUserRole, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Ви понижуєте себе до звичайного користувача. Бажаєте продовжити?',
      });
      expect(component.updateUserRole).not.toHaveBeenCalled();
    });

    it('should call updateUserRole method for another user', () => {
      mockUsersService.user$.next(mockUser);
      const mockRole: UpdateUserRoleInterface = {
        userId: mockUser2.id as string,
        isAdmin: false,
      };
      spyOn(component, 'updateUserRole');
      component.confirmUpdateUserRole(mockRole);

      expect(component.updateUserRole).toHaveBeenCalledWith(mockRole);
    });
  });

  describe('searchUser', () => {
    it('should call initUsersTable method', () => {
      spyOn(component, 'initUsersTable');
      const newParams: UsersTableParamsInterface = {
        sortByName: 'default',
        sortByRole: 'default',
        page: 1,
        size: 10,
        filter: 'user',
      };
      component.searchUser('user');

      expect(component.filterParams).toEqual(newParams);
      expect(component.clearCurrentPageField).toBe(true);
      expect(component.initUsersTable).toHaveBeenCalledWith(newParams);
    });
  });

  describe('onClearPageControl', () => {
    it('should set true into clearCurrentPageField property', () => {
      component.onClearPageControl(true);

      expect(component.clearCurrentPageField).toBe(true);
    });
  });
});
