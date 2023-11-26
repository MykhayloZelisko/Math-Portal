import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTableComponent } from './users-table.component';
import { DropdownModule } from 'primeng/dropdown';
import { UserInterface } from '../../../../../shared/models/interfaces/user.interface';
import { UsersTableInterface } from '../../../../../shared/models/interfaces/users-table.interface';
import { UsersTableColumnNameEnum } from '../../../../../shared/models/enums/users-table-column-name.enum';
import { USERS_TABLE_HEADER } from '../../../../../shared/models/constants/user-table-header';
import { TableHeaderInterface } from '../../../../../shared/models/interfaces/table-header.interface';
import { PaginatorConfigInterface } from '../../../../../shared/models/interfaces/paginator-config.interface';
import { SvgIconRegistryService } from 'angular-svg-icon';

describe('UsersTableComponent', () => {
  let component: UsersTableComponent;
  let fixture: ComponentFixture<UsersTableComponent>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
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
  const mockUsersList: UsersTableInterface = {
    total: 1234,
    users: [mockUser, mockUser2],
  };
  const mockPaginatorConfig: PaginatorConfigInterface = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 1234,
  };

  beforeEach(async () => {
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [UsersTableComponent, DropdownModule],
      providers: [
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initSortParams method', () => {
      spyOn(component, 'initSortParams');
      component.ngOnInit();

      expect(component.initSortParams).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('should not call initPaginator method', () => {
      component.tableContent = mockUsersList;
      component.isPaginatorInit = true;
      spyOn(component, 'initPaginator');
      component.ngOnChanges();

      expect(component.initPaginator).not.toHaveBeenCalled();
    });

    it('should call initPaginator method', () => {
      component.tableContent = mockUsersList;
      component.isPaginatorInit = false;
      spyOn(component, 'initPaginator');
      component.ngOnChanges();

      expect(component.initPaginator).toHaveBeenCalled();
    });

    it('should not call initSortParams method', () => {
      component.clearCurrentPageField = false;
      spyOn(component, 'initSortParams');
      component.ngOnChanges();

      expect(component.initSortParams).not.toHaveBeenCalled();
    });

    it('should call initSortParams method', () => {
      component.clearCurrentPageField = true;
      spyOn(component, 'initSortParams');
      spyOn(component.clearPageControl, 'emit');
      component.ngOnChanges();

      expect(component.initSortParams).toHaveBeenCalled();
      expect(component.paginationForm.controls['currentPage'].value).toBe(1);
      expect(component.clearPageControl.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('onSortColumn', () => {
    it('should set currentPage control value for all cases', () => {
      const mockColumnName: UsersTableColumnNameEnum =
        UsersTableColumnNameEnum.UserName;
      component.sortParams[mockColumnName] = 'none';
      component.onSortColumn(mockColumnName);

      expect(component.paginationForm.controls['currentPage'].value).toBe(1);
    });

    it('should change and emit sortParams value in case "default"', () => {
      const mockColumnName: UsersTableColumnNameEnum =
        UsersTableColumnNameEnum.UserName;
      component.sortParams[mockColumnName] = 'default';
      spyOn(component.sortColumn, 'emit');
      component.onSortColumn(mockColumnName);

      expect(component.sortColumn.emit).toHaveBeenCalledWith({
        columnName: mockColumnName,
        sorting: 'asc',
      });
      expect(component.sortParams[mockColumnName]).toBe('asc');
    });

    it('should change and emit sortParams value in case "asc"', () => {
      const mockColumnName: UsersTableColumnNameEnum =
        UsersTableColumnNameEnum.UserName;
      component.sortParams[mockColumnName] = 'asc';
      spyOn(component.sortColumn, 'emit');
      component.onSortColumn(mockColumnName);

      expect(component.sortColumn.emit).toHaveBeenCalledWith({
        columnName: mockColumnName,
        sorting: 'desc',
      });
      expect(component.sortParams[mockColumnName]).toBe('desc');
    });

    it('should change and emit sortParams value in case "desc"', () => {
      const mockColumnName: UsersTableColumnNameEnum =
        UsersTableColumnNameEnum.UserName;
      component.sortParams[mockColumnName] = 'desc';
      spyOn(component.sortColumn, 'emit');
      component.onSortColumn(mockColumnName);

      expect(component.sortColumn.emit).toHaveBeenCalledWith({
        columnName: mockColumnName,
        sorting: 'default',
      });
      expect(component.sortParams[mockColumnName]).toBe('default');
    });
  });

  describe('initSortParams', () => {
    it('should init sortParams', () => {
      component.usersTableHeader = USERS_TABLE_HEADER;
      component.initSortParams();

      expect(component.sortParams).toEqual({
        userName: 'default',
        email: 'none',
        role: 'default',
        buttons: 'none',
      });
    });
  });

  describe('getHeaderStyle', () => {
    it('should return "flex-start"', () => {
      const mockHeaderItem: TableHeaderInterface = {
        title: `Ім'я користувача`,
        columnName: UsersTableColumnNameEnum.UserName,
        headerContentPosition: 'flex-start',
        tableContentPosition: 'start',
        isSortable: true,
        sorting: 'default',
      };
      const headerStyle = component.getHeaderStyle(mockHeaderItem);

      expect(headerStyle).toEqual({
        'justify-content': mockHeaderItem.headerContentPosition,
      });
    });
  });

  describe('getContentPosition', () => {
    it('should return "center"', () => {
      component.usersTableHeader = USERS_TABLE_HEADER;
      const contentPosition = component.getContentPosition(2);

      expect(contentPosition).toEqual({
        'text-align': 'center',
      });
    });
  });

  describe('onPageChange', () => {
    it('should set 1 into paginatorConfig and into currentPage control', () => {
      component.paginatorConfig = {
        ...mockPaginatorConfig,
        currentPage: 2,
      };
      spyOn(component.changePaginatorConfig, 'emit');
      component.onPageChange(1);

      expect(component.paginatorConfig).toEqual(mockPaginatorConfig);
      expect(component.paginationForm.controls['currentPage'].value).toBe(1);
      expect(component.changePaginatorConfig.emit).toHaveBeenCalledWith(
        mockPaginatorConfig,
      );
    });
  });

  describe('initPaginator', () => {
    it('should init paginatorConfig, isPaginatorInit, pageArray values', () => {
      component.tableContent = mockUsersList;
      component.initPaginator();

      expect(component.paginatorConfig).toEqual(mockPaginatorConfig);
      expect(component.pageArray.length).toBe(124);
      expect(component.isPaginatorInit).toBe(true);
    });
  });

  describe('updatePageSize', () => {
    it('should init new values for currentPage control, paginatorConfig, pageArray', () => {
      component.paginatorConfig = {
        itemsPerPage: 100,
        currentPage: 11,
        totalItems: 1234,
      };
      component.paginationForm.controls['pageSize'].setValue(10);
      spyOn(component.changePaginatorConfig, 'emit');
      component.updatePageSize();

      expect(component.paginatorConfig).toEqual(mockPaginatorConfig);
      expect(component.pageArray.length).toBe(124);
      expect(component.paginationForm.controls['currentPage'].value).toBe(1);
      expect(component.changePaginatorConfig.emit).toHaveBeenCalledWith(
        mockPaginatorConfig,
      );
    });
  });

  describe('updateCurrentPage', () => {
    it('should init new value for paginatorConfig', () => {
      component.paginatorConfig = {
        itemsPerPage: 10,
        currentPage: 2,
        totalItems: 1234,
      };
      component.paginationForm.controls['currentPage'].setValue(1);
      spyOn(component.changePaginatorConfig, 'emit');
      component.updateCurrentPage();

      expect(component.paginatorConfig).toEqual(mockPaginatorConfig);
      expect(component.changePaginatorConfig.emit).toHaveBeenCalledWith(
        mockPaginatorConfig,
      );
    });
  });

  describe('updateUserRole', () => {
    it('should emit user id and user role', () => {
      spyOn(component.updateRole, 'emit');
      component.updateUserRole(mockUser);

      expect(component.updateRole.emit).toHaveBeenCalledWith({
        userId: mockUser.id as string,
        isAdmin: !mockUser.isAdmin,
      });
    });
  });

  describe('deleteUser', () => {
    it('should emit user', () => {
      spyOn(component.removeUser, 'emit');
      component.deleteUser(mockUser);

      expect(component.removeUser.emit).toHaveBeenCalledWith(mockUser);
    });
  });
});
