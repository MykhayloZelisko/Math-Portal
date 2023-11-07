import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { UsersService } from '../../../shared/services/users.service';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { BehaviorSubject, of } from 'rxjs';
import { DialogService } from '../../../shared/services/dialog.service';
import { UsersTableInterface } from '../../../shared/models/interfaces/users-table.interface';
import { SvgIconRegistryService } from 'angular-svg-icon';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
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
  const mockUsersList: UsersTableInterface = {
    total: 1,
    users: [mockUser],
  };

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj(
      'UsersService',
      ['getUsersList', 'updateUserRole', 'updateUserData'],
      {
        user$: new BehaviorSubject<UserInterface | null>(mockUser),
      },
    );
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: DialogService, useValue: mockDialogService },
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
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
});
