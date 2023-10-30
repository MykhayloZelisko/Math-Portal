import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsComponent } from './comments.component';
import { CommentsService } from '../../../../../../../shared/services/comments.service';
import { UsersService } from '../../../../../../../shared/services/users.service';
import { BehaviorSubject, of } from 'rxjs';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { RouterTestingModule } from '@angular/router/testing';

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let mockCommentsService: jasmine.SpyObj<CommentsService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;

  beforeEach(async () => {
    mockCommentsService = jasmine.createSpyObj('CommentsService', [
      'getCommentsList',
      'deleteComment',
    ]);
    mockUsersService = jasmine.createSpyObj('UsersService', [], {
      user$: new BehaviorSubject<UserInterface | null>(null),
    });
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [CommentsComponent, RouterTestingModule],
      providers: [
        { provide: CommentsService, useValue: mockCommentsService },
        { provide: UsersService, useValue: mockUsersService },
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    mockCommentsService.getCommentsList.and.returnValue(of([]));

    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
