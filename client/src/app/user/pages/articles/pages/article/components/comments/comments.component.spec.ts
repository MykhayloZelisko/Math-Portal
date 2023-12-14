import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentsComponent } from './comments.component';
import { CommentsService } from '../../../../../../../shared/services/comments.service';
import { UsersService } from '../../../../../../../shared/services/users.service';
import { BehaviorSubject, of } from 'rxjs';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { RouterTestingModule } from '@angular/router/testing';
import { CommentWithDescendantsInterface } from '../../../../../../../shared/models/interfaces/comment-with-descendants.interface';
import { CommentsTreeInterface } from '../../../../../../../shared/models/interfaces/comments-tree.interface';

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let mockCommentsService: jasmine.SpyObj<CommentsService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
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
    id: '35c90c0b-ba58-46f3-a091-bcdf66f51111',
    email: 'mail2@mail.mail',
    password: 'Pa$$word094',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    isAdmin: true,
    photo: 'photo',
  };
  const mockCommentsList: CommentWithDescendantsInterface[] = [
    {
      id: 'ae01ab89-a342-4c8f-9b0c-23d26a8d0834',
      content: 'comment',
      createdAt: '',
      updatedAt: '',
      likesUsersIds: [],
      dislikesUsersIds: [],
      descendantsList: [
        {
          descendantId: 'ae01ab89-a342-4c8f-9b0c-23d26a8d0834',
          nearestAncestorId: null,
          level: 1,
        },
        {
          descendantId: 'ae01ab89-a342-4c8f-9b0c-23d26a8d0111',
          nearestAncestorId: 'ae01ab89-a342-4c8f-9b0c-23d26a8d0834',
          level: 2,
        },
      ],
      user: mockUser,
    },
    {
      id: 'ae01ab89-a342-4c8f-9b0c-23d26a8d0111',
      content: 'comment',
      createdAt: '',
      updatedAt: '',
      likesUsersIds: [],
      dislikesUsersIds: [],
      descendantsList: [
        {
          descendantId: 'ae01ab89-a342-4c8f-9b0c-23d26a8d0111',
          nearestAncestorId: 'ae01ab89-a342-4c8f-9b0c-23d26a8d0834',
          level: 2,
        },
      ],
      user: mockUser2,
    },
  ];
  const mockCommentsTree: CommentsTreeInterface[] = [
    {
      id: 'ae01ab89-a342-4c8f-9b0c-23d26a8d0834',
      content: 'comment',
      createdAt: '',
      updatedAt: '',
      nearestAncestorId: null,
      level: 1,
      likesUsersIds: [],
      dislikesUsersIds: [],
      user: mockUser,
      children: [
        {
          id: 'ae01ab89-a342-4c8f-9b0c-23d26a8d0111',
          content: 'comment',
          createdAt: '',
          updatedAt: '',
          nearestAncestorId: 'ae01ab89-a342-4c8f-9b0c-23d26a8d0834',
          level: 2,
          likesUsersIds: [],
          dislikesUsersIds: [],
          user: { ...mockUser2, photo: 'http://localhost:3000/photo' },
          children: [],
        },
      ],
    },
  ];

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

    mockCommentsService.getCommentsList.and.returnValue(of(mockCommentsList));

    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initComments and getUser methods', () => {
      spyOn(component, 'initComments');
      spyOn(component, 'getUser');
      component.ngOnInit();

      expect(component.initComments).toHaveBeenCalled();
      expect(component.getUser).toHaveBeenCalled();
    });
  });

  describe('initComments', () => {
    it('should init comments list', () => {
      component.initComments();

      expect(component.commentsTree).toEqual(mockCommentsTree);
    });
  });

  describe('getUser', () => {
    it('should get user', () => {
      mockUsersService.user$.next(mockUser);
      component.getUser();

      expect(component.user).toEqual(mockUser);
    });
  });

  describe('addComment', () => {
    it('should add comment to list', () => {
      component.commentsTree = [];
      component.addComment(mockCommentsTree[0]);

      expect(component.commentsTree).toEqual([mockCommentsTree[0]]);
    });
  });

  describe('deleteComment', () => {
    it('should delete comment from list', () => {
      component.commentsTree = mockCommentsTree;
      mockCommentsService.deleteComment.and.returnValue(of(void 0));
      const id = 'ae01ab89-a342-4c8f-9b0c-23d26a8d0834';
      component.deleteComment(id);

      expect(component.commentsTree).toEqual([]);
    });
  });
});
