import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentItemComponent } from './comment-item.component';
import { CommentsService } from '../../../../../../../shared/services/comments.service';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { CommentInterface } from '../../../../../../../shared/models/interfaces/comment.interface';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';
import { of } from 'rxjs';
import { CommentWithLevelInterface } from '../../../../../../../shared/models/interfaces/comment-with-level.interface';
import { CommentsListInterface } from '../../../../../../../shared/models/interfaces/comments-list.interface';
import { CommentsListParamsInterface } from '../../../../../../../shared/models/interfaces/comments-list-params.interface';

describe('CommentItemComponent', () => {
  let component: CommentItemComponent;
  let fixture: ComponentFixture<CommentItemComponent>;
  let mockCommentsService: jasmine.SpyObj<CommentsService>;
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
  const mockCommentThree: CommentWithLevelInterface = {
    id: 'ae01ab89-a342-4c8f-9b0c-23d26a11111',
    content: 'comment',
    createdAt: '',
    updatedAt: '',
    level: 2,
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
    comments: [mockCommentThree, mockCommentTwo],
  };
  const mockParams: CommentsListParamsInterface = { page: 1, size: 10 };
  const mockComments: CommentWithLevelInterface[] = [
    {
      ...mockCommentTwo,
      user: { ...mockUser2, photo: 'http://localhost:3000/photo' },
    },
    mockCommentThree,
  ];

  beforeEach(async () => {
    mockCommentsService = jasmine.createSpyObj('CommentsService', [
      'getCommentsListByCommentId',
      'updateCommentLikesDislikes',
      'updateComment',
      'deleteComment',
    ]);
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [CommentItemComponent],
      providers: [
        { provide: CommentsService, useValue: mockCommentsService },
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    mockCommentsService.getCommentsListByCommentId.and.returnValue(
      of(mockCommentsList),
    );

    fixture = TestBed.createComponent(CommentItemComponent);
    component = fixture.componentInstance;
    component.comment = mockCommentOne;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initChildrenList method', () => {
      component.paginationParams = mockParams;
      spyOn(component, 'initChildrenList');
      component.ngOnInit();

      expect(component.initChildrenList).toHaveBeenCalledWith(mockParams);
    });
  });

  describe('initChildrenList', () => {
    it('should init comments list', () => {
      component.commentsList = [];
      component.initChildrenList({ page: 1, size: 10 });

      expect(component.commentsList).toEqual(mockComments);
    });
  });

  describe('loadMoreComments', () => {
    it('should call initComments method', () => {
      component.paginationParams = mockParams;
      spyOn(component, 'initChildrenList');
      component.loadMoreComments();

      expect(component.initChildrenList).toHaveBeenCalledWith({
        ...mockParams,
        page: 2,
      });
    });
  });

  describe('toggleNewComment', () => {
    it('should show/hide new comment', () => {
      component.isVisibleNewComment = false;
      component.toggleNewComment();

      expect(component.isVisibleNewComment).toBe(true);
    });
  });

  describe('addComment', () => {
    it('should call refreshComments and toggleNewComment methods', () => {
      spyOn(component, 'toggleNewComment');
      spyOn(component, 'refreshComments');
      component.addComment();

      expect(component.toggleNewComment).toHaveBeenCalled();
      expect(component.refreshComments).toHaveBeenCalled();
    });
  });

  describe('refreshComments', () => {
    it('should call initChildrenList method', () => {
      spyOn(component, 'initChildrenList');
      component.refreshComments();

      expect(component.initChildrenList).toHaveBeenCalledWith(mockParams);
    });
  });

  describe('likeComment', () => {
    it('should add like to comment', () => {
      const mockCommentWithLikes: CommentInterface = {
        id: 'a79e37a0-0fcb-4cf6-97bd-79e73df68f05',
        content: 'comment',
        createdAt: '',
        updatedAt: '',
        likesUsersIds: ['35c90c0b-ba58-46f3-a091-bcdf66f514a8'],
        dislikesUsersIds: [],
        user: mockUser,
      };
      mockCommentsService.updateCommentLikesDislikes.and.returnValue(
        of(mockCommentWithLikes),
      );
      component.likeComment(1);

      expect(component.comment).toEqual({
        ...mockCommentOne,
        likesUsersIds: ['35c90c0b-ba58-46f3-a091-bcdf66f514a8'],
        dislikesUsersIds: [],
      });
    });
  });

  describe('closeDropDown', () => {
    it('should close dropdown', () => {
      component.closeDropDown();
      expect(component.isActiveDropDown).toBe(false);
    });
  });

  describe('openDropDown', () => {
    it('should open dropdown', () => {
      component.isActiveDropDown = false;
      component.openDropDown();
      expect(component.isActiveDropDown).toBe(true);
    });
  });

  describe('editComment', () => {
    it('should make comment editable', () => {
      spyOn(component, 'closeDropDown');
      component.editComment();

      expect(component.closeDropDown).toHaveBeenCalled();
      expect(component.isCommentEditable).toBe(true);
      expect(component.commentCtrl.value).toBe(mockCommentOne.content);
    });
  });

  describe('cancelEditComment', () => {
    it('should make comment not editable', () => {
      component.cancelEditComment();

      expect(component.isCommentEditable).toBe(false);
    });
  });

  describe('saveComment', () => {
    it('should save comment', () => {
      const mockNewComment: CommentInterface = {
        id: 'a79e37a0-0fcb-4cf6-97bd-79e73df68f05',
        content: 'new content',
        createdAt: '',
        updatedAt: '1',
        likesUsersIds: [],
        dislikesUsersIds: [],
        user: mockUser,
      };
      mockCommentsService.updateComment.and.returnValue(of(mockNewComment));
      component.saveComment();

      expect(component.comment).toEqual({
        ...mockCommentOne,
        content: mockNewComment.content,
        updatedAt: mockNewComment.updatedAt,
      });
    });
  });

  describe('deleteComment', () => {
    it('should emit value', () => {
      spyOn(component.removeComment, 'emit');
      component.deleteComment();

      expect(component.removeComment.emit).toHaveBeenCalledWith(
        mockCommentOne.id,
      );
    });
  });

  describe('confirmRemove', () => {
    it('should call refreshComments method', () => {
      spyOn(component, 'refreshComments');
      const id = mockCommentTwo.id;
      mockCommentsService.deleteComment.and.returnValue(of(void 0));
      component.confirmRemove(id);

      expect(component.refreshComments).toHaveBeenCalled();
    });
  });

  describe('toggleChildrenComments', () => {
    it('should show/hide children comments list', () => {
      component.isVisibleChildren = false;
      component.toggleChildrenComments();

      expect(component.isVisibleChildren).toBe(true);
    });
  });
});
