import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCommentComponent } from './new-comment.component';
import { CommentsService } from '../../../../../../../shared/services/comments.service';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { RouterTestingModule } from '@angular/router/testing';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';
import { CommentInterface } from '../../../../../../../shared/models/interfaces/comment.interface';
import { of } from 'rxjs';
import { CommentWithLevelInterface } from '../../../../../../../shared/models/interfaces/comment-with-level.interface';

describe('NewCommentComponent', () => {
  let component: NewCommentComponent;
  let fixture: ComponentFixture<NewCommentComponent>;
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
  const mockComment: CommentInterface = {
    id: '860eb69a-d767-46f8-bd94-dc2643c56d72',
    content: 'new comment',
    createdAt: '',
    updatedAt: '',
    likesUsersIds: [],
    dislikesUsersIds: [],
    user: {
      ...mockUser,
      photo: null,
    },
  };
  const mockCommentWithUserPhoto: CommentInterface = {
    id: '17259d35-74b5-4036-b06a-e67386d5fe6b',
    content: 'new comment',
    createdAt: '',
    updatedAt: '',
    likesUsersIds: [],
    dislikesUsersIds: [],
    user: {
      ...mockUser,
      photo: 'photo',
    },
  };
  const mockCommentWithLevel: CommentWithLevelInterface = {
    ...mockComment,
    level: 1,
  };
  const mockCommentWithLevelTwo: CommentWithLevelInterface = {
    ...mockCommentWithUserPhoto,
    level: 2,
  };

  beforeEach(async () => {
    mockCommentsService = jasmine.createSpyObj('CommentsService', [
      'createComment',
    ]);
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [NewCommentComponent, RouterTestingModule],
      providers: [
        { provide: CommentsService, useValue: mockCommentsService },
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('sendComment', () => {
    it('should not call method "createComment" from service', () => {
      component.commentCtrl.setValue('');
      component.sendComment();

      expect(mockCommentsService.createComment).not.toHaveBeenCalled();
    });

    it('should create new comment level 1 without user photo and emit it', () => {
      component.commentCtrl.setValue('new comment');
      spyOn(component.addComment, 'emit');
      mockCommentsService.createComment.and.returnValue(of(mockComment));
      component.sendComment();

      expect(component.newComment).toEqual(mockCommentWithLevel);
      expect(component.addComment.emit).toHaveBeenCalled();
    });

    it('should create new comment level 2 with user photo and emit it', () => {
      component.commentCtrl.setValue('new comment');
      component.comment = mockCommentWithLevel;
      spyOn(component.addComment, 'emit');
      mockCommentsService.createComment.and.returnValue(
        of(mockCommentWithUserPhoto),
      );
      component.sendComment();

      expect(component.newComment).toEqual({
        ...mockCommentWithLevelTwo,
        user: {
          ...mockUser,
          photo: 'http://localhost:3000/photo',
        },
      });
      expect(component.addComment.emit).toHaveBeenCalled();
    });
  });
});
