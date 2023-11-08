import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentItemComponent } from './comment-item.component';
import { CommentsService } from '../../../../../../../shared/services/comments.service';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { CommentsTreeInterface } from '../../../../../../../shared/models/interfaces/comments-tree.interface';
import { CommentInterface } from '../../../../../../../shared/models/interfaces/comment.interface';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';
import { of } from 'rxjs';

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
  const mockComment: CommentsTreeInterface = {
    id: 'a79e37a0-0fcb-4cf6-97bd-79e73df68f05',
    content: 'comment',
    createdAt: '',
    updatedAt: '',
    level: 1,
    nearestAncestorId: null,
    likesUsersIds: [],
    dislikesUsersIds: [],
    user: mockUser,
    children: [],
  };
  const mockChildComment: CommentsTreeInterface = {
    ...mockComment,
    user: { ...mockComment.user },
    level: 2,
    children: [],
    id: '04d46f3f-d859-4451-88cb-e53f1cb5c44b',
  };

  beforeEach(async () => {
    mockCommentsService = jasmine.createSpyObj('CommentsService', [
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

    fixture = TestBed.createComponent(CommentItemComponent);
    component = fixture.componentInstance;
    component.comment = mockComment;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleComment', () => {
    it('should show/hide new comment', () => {
      component.isVisibleNewComment = false;
      component.toggleComment();

      expect(component.isVisibleNewComment).toBe(true);
    });
  });

  describe('addComment', () => {
    it('should add comment to list of children comments', function () {
      spyOn(component, 'toggleComment');
      component.addComment(mockChildComment);

      expect(component.comment.children).toEqual([mockChildComment]);
      expect(component.toggleComment).toHaveBeenCalled();
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
        ...mockComment,
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
      expect(component.commentCtrl.value).toBe(mockComment.content);
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
        ...mockComment,
        content: mockNewComment.content,
        updatedAt: mockNewComment.updatedAt,
      });
    });
  });

  describe('deleteComment', () => {
    it('should emit value', () => {
      spyOn(component.removeComment, 'emit');
      component.deleteComment();

      expect(component.removeComment.emit).toHaveBeenCalledWith(mockComment.id);
    });
  });

  describe('confirmRemove', () => {
    it('should remove comment', () => {
      const id = mockChildComment.id;
      component.comment.children = [mockChildComment];
      mockCommentsService.deleteComment.and.returnValue(of(void 0));
      component.confirmRemove(id);

      expect(component.comment.children).toEqual([]);
    });
  });
});
