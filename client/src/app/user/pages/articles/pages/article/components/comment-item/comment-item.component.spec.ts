import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentItemComponent } from './comment-item.component';
import { CommentsService } from '../../../../../../../shared/services/comments.service';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { CommentsTreeInterface } from '../../../../../../../shared/models/interfaces/comments-tree.interface';

describe('CommentItemComponent', () => {
  let component: CommentItemComponent;
  let fixture: ComponentFixture<CommentItemComponent>;
  let mockCommentsService: jasmine.SpyObj<CommentsService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  const mockComment: CommentsTreeInterface = {
    id: 'a79e37a0-0fcb-4cf6-97bd-79e73df68f05',
    content: 'comment',
    createdAt: '',
    updatedAt: '',
    level: 1,
    nearestAncestorId: null,
    likesUsersIds: [],
    dislikesUsersIds: [],
    user: {
      id: '35c90c0b-ba58-46f3-a091-bcdf66f514a8',
      email: 'mail@mail.mail',
      password: 'Pa$$word094',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      isAdmin: true,
      photo: null,
    },
    children: [],
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
});
