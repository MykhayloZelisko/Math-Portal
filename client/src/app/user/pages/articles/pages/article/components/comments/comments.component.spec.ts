import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsComponent } from './comments.component';
import { CommentsService } from '../../../../../../../shared/services/comments.service';
import { UsersService } from '../../../../../../../shared/services/users.service';
import { BehaviorSubject, of } from 'rxjs';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { RouterTestingModule } from '@angular/router/testing';
import { CommentWithLevelInterface } from '../../../../../../../shared/models/interfaces/comment-with-level.interface';
import { CommentsListInterface } from '../../../../../../../shared/models/interfaces/comments-list.interface';
import { CommentsListParamsInterface } from '../../../../../../../shared/models/interfaces/comments-list-params.interface';

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
  const mockCommentOne: CommentWithLevelInterface = {
    id: 'ae01ab89-a342-4c8f-9b0c-23d26a8d0834',
    content: 'comment',
    createdAt: '',
    updatedAt: '',
    level: 1,
    likesUsersIds: [],
    dislikesUsersIds: [],
    user: mockUser,
  };
  const mockCommentTwo: CommentWithLevelInterface = {
    id: 'ae01ab89-a342-4c8f-9b0c-23d26a8d0111',
    content: 'comment',
    createdAt: '',
    updatedAt: '',
    level: 1,
    likesUsersIds: [],
    dislikesUsersIds: [],
    user: mockUser2,
  };
  const mockCommentsList: CommentsListInterface = {
    total: 20,
    comments: [mockCommentOne, mockCommentTwo],
  };
  const mockEmptyList: CommentsListInterface = {
    total: 0,
    comments: [],
  };
  const mockComments: CommentWithLevelInterface[] = [
    {
      ...mockCommentTwo,
      user: { ...mockUser2, photo: 'http://localhost:3000/photo' },
    },
    mockCommentOne,
  ];
  const mockParams: CommentsListParamsInterface = { page: 1, size: 10 };

  beforeEach(async () => {
    mockCommentsService = jasmine.createSpyObj('CommentsService', [
      'getCommentsListByArticleId',
      'getCommentsListByCommentId',
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

    mockCommentsService.getCommentsListByArticleId.and.returnValue(
      of(mockCommentsList),
    );
    mockCommentsService.getCommentsListByCommentId.and.returnValue(
      of(mockEmptyList),
    );

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
      component.commentsList = [];
      component.initComments({ page: 1, size: 10 });

      expect(component.commentsList).toEqual(mockComments);
    });
  });

  describe('loadMoreComments', () => {
    it('should call initComments method', () => {
      component.paginationParams = mockParams;
      spyOn(component, 'initComments');
      component.loadMoreComments();

      expect(component.initComments).toHaveBeenCalledWith({
        ...mockParams,
        page: 2,
      });
    });
  });

  describe('getUser', () => {
    it('should get user', () => {
      mockUsersService.user$.next(mockUser);
      component.getUser();

      expect(component.user).toEqual(mockUser);
    });
  });

  describe('refreshComments', () => {
    it('should call initComments method', () => {
      spyOn(component, 'initComments');
      component.refreshComments();

      expect(component.initComments).toHaveBeenCalledWith(mockParams);
    });
  });

  describe('deleteComment', () => {
    it('should call refreshComments method', () => {
      spyOn(component, 'refreshComments');
      mockCommentsService.deleteComment.and.returnValue(of(void 0));
      const id = 'ae01ab89-a342-4c8f-9b0c-23d26a8d0834';
      component.deleteComment(id);

      expect(component.refreshComments).toHaveBeenCalled();
    });
  });
});
