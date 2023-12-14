import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { UsersService } from '../shared/services/users.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { UserInterface } from '../shared/models/interfaces/user.interface';
import { SvgIconRegistryService } from 'angular-svg-icon';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj(
      'UsersService',
      ['updateUserData'],
      {
        user$: new BehaviorSubject<UserInterface | null>(null),
      },
    );
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [LayoutComponent, RouterTestingModule],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
