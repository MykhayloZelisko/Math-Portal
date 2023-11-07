import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleComponent } from './article.component';
import { MathjaxModule } from 'mathjax-angular';
import { ArticlesService } from '../../../../../shared/services/articles.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TagsService } from '../../../../../shared/services/tags.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { TagInterface } from '../../../../../shared/models/interfaces/tag.interface';
import { RatingService } from '../../../../../shared/services/rating.service';
import { UsersService } from '../../../../../shared/services/users.service';
import { UserInterface } from '../../../../../shared/models/interfaces/user.interface';
import { DialogService } from '../../../../../shared/services/dialog.service';
import { ArticleInterface } from '../../../../../shared/models/interfaces/article.interface';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CreateArticleInterface
} from '../../../../../shared/models/interfaces/create-article.interface';
import { CommentsService } from '../../../../../shared/services/comments.service';
import { SvgIconRegistryService } from 'angular-svg-icon';
import {
  CurrentArticleRatingInterface
} from '../../../../../shared/models/interfaces/current-article-rating.interface';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../../../../shared/components/dialog/dialog.component';
import { DialogTypeEnum } from '../../../../../shared/models/enums/dialog-type.enum';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;
  let mockArticlesService: jasmine.SpyObj<ArticlesService>;
  let mockTagsService: jasmine.SpyObj<TagsService>;
  let mockRatingService: jasmine.SpyObj<RatingService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  let mockCommentsService: jasmine.SpyObj<CommentsService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DialogComponent>>;
  let router: Router;
  let route: ActivatedRoute;
  const mockTag: TagInterface = {
    id: '34bacf2d-5c59-4897-a2f7-7a546e0c5d1a',
    value: 'Tag',
  };
  const mockTag2: TagInterface = {
    id: '34bacf2d-5c59-4897-a2f7-7a546fff5d1a',
    value: 'Tag 2',
  }
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
  const mockArticle: ArticleInterface = {
    id: 'a41230b5-4566-4db5-bb0d-5cdbf7e318f3',
    title: 'Title',
    content: 'Content',
    rating: 3.7,
    votes: 5,
    tags: [mockTag],
  };

  beforeEach(async () => {
    mockArticlesService = jasmine.createSpyObj('ArticlesService', [
      'getArticle',
      'deleteArticle',
      'updateArticle',
    ]);
    mockTagsService = jasmine.createSpyObj('TagsService', [], {
      tag$: new BehaviorSubject<TagInterface | null>(null),
    });
    mockRatingService = jasmine.createSpyObj('RatingService', [
      'getCurrentArticleStatus',
      'updateArticleRating',
    ]);
    mockUsersService = jasmine.createSpyObj('UsersService', [], {
      user$: new BehaviorSubject<UserInterface | null>(null),
    });
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );
    mockCommentsService = jasmine.createSpyObj('CommentsService', ['getCommentsList']);
    mockDialogRef = jasmine.createSpyObj('DialogRef', ['afterClosed']);

    await TestBed.configureTestingModule({
      imports: [ArticleComponent, MathjaxModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: ArticlesService, useValue: mockArticlesService },
        { provide: TagsService, useValue: mockTagsService },
        { provide: RatingService, useValue: mockRatingService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: CommentsService, useValue: mockCommentsService },
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call initArticle and initUserRole methods', () => {
      mockArticlesService.getArticle.and.returnValue(of(mockArticle));
      spyOn(component, 'initArticle');
      spyOn(component, 'initUserRole');
      component.ngOnInit();

      expect(component.initArticle).toHaveBeenCalled();
      expect(component.initUserRole).toHaveBeenCalled();
    });
  });

  describe('initUserRole', () => {
    it('should get isAdmin value from user and set it in component', () => {
      mockArticlesService.getArticle.and.returnValue(of(mockArticle));
      mockUsersService.user$.next(mockUser);
      component.initUserRole();

      expect(component.isAdmin).toBe(true);
    });

    it('should set false in isAdmin, when user is null', () => {
      mockArticlesService.getArticle.and.returnValue(of(mockArticle));
      mockUsersService.user$.next(null);
      component.initUserRole();

      expect(component.isAdmin).toBe(false);
    });
  });

  describe('initArticle', () => {
    it('should not call getCurrentArticleStatus', () => {
      spyOn(route.snapshot.paramMap, 'get').and.returnValue('id');
      mockArticlesService.getArticle.and.returnValue(throwError(() => {}));
      component.initArticle();

      expect(mockRatingService.getCurrentArticleStatus).not.toHaveBeenCalled();
    });

    it('should init article and newArticle but with error in status', () => {
      spyOn(route.snapshot.paramMap, 'get').and.returnValue('id');
      mockArticlesService.getArticle.and.returnValue(of(mockArticle));
      mockRatingService.getCurrentArticleStatus.and.returnValue(throwError(() => {}));
      mockCommentsService.getCommentsList.and.returnValue(of([]));
      const mockNewArticle: CreateArticleInterface = {
        title: mockArticle.title,
        content: mockArticle.content,
        tagsIds: [mockTag.id],
      }
      component.initArticle();

      expect(component.article).toEqual(mockArticle);
      expect(component.newArticle).toEqual(mockNewArticle);
      expect(component.isRatingActive).toBe(false);
    });

    it('should init article and newArticle without error in status', () => {
      spyOn(route.snapshot.paramMap, 'get').and.returnValue('id');
      mockArticlesService.getArticle.and.returnValue(of(mockArticle));
      mockRatingService.getCurrentArticleStatus.and.returnValue(of({ canBeRated: true }));
      mockCommentsService.getCommentsList.and.returnValue(of([]));
      const mockNewArticle: CreateArticleInterface = {
        title: mockArticle.title,
        content: mockArticle.content,
        tagsIds: [mockTag.id],
      }
      component.initArticle();

      expect(component.article).toEqual(mockArticle);
      expect(component.newArticle).toEqual(mockNewArticle);
      expect(component.isRatingActive).toBe(true);
    });
  });

  describe('searchArticle', () => {
    it('should redirect to articles page', () => {
      spyOn(router, 'navigateByUrl');
      component.searchArticle(mockTag);

      expect(mockTagsService.tag$.value).toEqual(mockTag);
      expect(router.navigateByUrl).toHaveBeenCalledWith('articles');
    });
  });

  describe('updateRating', () => {
    it('should update article rating', () => {
      component.article = mockArticle;
      const mockRating: CurrentArticleRatingInterface = {
        rating: 1.4,
        votes: 10,
      };
      mockRatingService.updateArticleRating.and.returnValue(of(mockRating));
      component.updateRating(1);

      expect(component.article.rating).toBe(mockRating.rating);
      expect(component.article.votes).toBe(mockRating.votes);
      expect(component.isRatingActive).toBe(false);
    });
  });

  describe('deleteArticle', () => {
    it('should call confirmDeleteArticle method', () => {
      component.article = mockArticle;
      const id = mockArticle.id;
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(id));
      spyOn(component, 'confirmDeleteArticle');
      component.deleteArticle();

      expect(component.confirmDeleteArticle).toHaveBeenCalledWith(id);
    });

    it('should not call confirmDeleteArticle method', () => {
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(undefined));
      spyOn(component, 'confirmDeleteArticle');
      component.deleteArticle();

      expect(component.confirmDeleteArticle).not.toHaveBeenCalled();
    });
  });

  describe('confirmDeleteArticle', () => {
    it('should open success dialog and redirect', () => {
      const id = mockArticle.id;
      spyOn(router, 'navigateByUrl');
      mockArticlesService.deleteArticle.and.returnValue(of(void 0));
      component.confirmDeleteArticle(id);

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.Alert, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Стаття видалена успішно.',
      });
      expect(router.navigateByUrl).toHaveBeenCalledWith('articles');
    });

    it('should open error dialog', () => {
      const id = mockArticle.id;
      mockArticlesService.deleteArticle.and.returnValue(throwError(() => {}));
      component.confirmDeleteArticle(id);

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.Alert, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Помилка видалення статті.',
      });
    });
  });

  describe('editArticle', () => {
    it('should be true isEditable value', () => {
      component.editArticle();

      expect(component.isEditable).toBe(true);
    });
  });

  describe('cancelEdit', () => {
    it('should be false isEditable value', () => {
      component.cancelEdit();

      expect(component.isEditable).toBe(false);
    });
  });

  describe('saveArticle', () => {
    it('should update article and open success dialog', () => {
      const mockNewArticle: CreateArticleInterface = {
        title: 'New title',
        content: 'New content',
        tagsIds: [
          '34bacf2d-5c59-4897-a2f7-7a546e0c5d1a',
          '34bacf2d-5c59-4897-a2f7-7a546fff5d1a',
        ],
      };
      const mockUpdatedArticle: ArticleInterface = {
        ...mockArticle,
        title: mockNewArticle.title,
        content: mockNewArticle.content,
        tags: [mockTag, mockTag2],
      };
      component.article = mockArticle;
      mockArticlesService.updateArticle.and.returnValue(of(mockUpdatedArticle));
      component.saveArticle();

      expect(component.article).toEqual(mockUpdatedArticle);
      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.Alert, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Стаття оновлена успішно',
      });
      expect(component.isEditable).toBe(false);
    });

    it('should open error dialog', () => {
      component.article = mockArticle;
      mockArticlesService.updateArticle.and.returnValue(throwError(() => {}));
      component.saveArticle();

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.Alert, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Помилка оновлення статті.',
      });
    });
  });

  describe('saveTagsIds', () => {
    it('should save tags ids but title is falsy', () => {
      component.newArticle = {
        title: '',
        content: 'New content',
        tagsIds: [],
      };
      component.saveTagsIds([mockTag.id, mockTag2.id]);

      expect(component.newArticle.tagsIds).toEqual([mockTag.id, mockTag2.id]);
      expect(component.isSaveButtonDisable).toBe(true);
    });

    it('should save tags ids but content is falsy', () => {
      component.newArticle = {
        title: 'New title',
        content: '',
        tagsIds: [],
      };
      component.saveTagsIds([mockTag.id, mockTag2.id]);

      expect(component.newArticle.tagsIds).toEqual([mockTag.id, mockTag2.id]);
      expect(component.isSaveButtonDisable).toBe(true);
    });

    it('should save tags ids', () => {
      component.newArticle = {
        title: 'New title',
        content: 'New content',
        tagsIds: [],
      };
      component.saveTagsIds([mockTag.id, mockTag2.id]);

      expect(component.newArticle.tagsIds).toEqual([mockTag.id, mockTag2.id]);
      expect(component.isSaveButtonDisable).toBe(false);
    });
  });

  describe('saveTitle', () => {
    it('should save title but tagsIds is empty', () => {
      component.newArticle = {
        title: '',
        content: 'New content',
        tagsIds: [],
      };
      component.saveTitle('New title');

      expect(component.newArticle.title).toBe('New title');
      expect(component.isSaveButtonDisable).toBe(true);
    });

    it('should save title but content is falsy', () => {
      component.newArticle = {
        title: '',
        content: '',
        tagsIds: [mockTag.id, mockTag2.id],
      };
      component.saveTitle('New title');

      expect(component.newArticle.title).toBe('New title');
      expect(component.isSaveButtonDisable).toBe(true);
    });

    it('should save title', () => {
      component.newArticle = {
        title: '',
        content: 'New content',
        tagsIds: [mockTag.id, mockTag2.id],
      };
      component.saveTitle('New title');

      expect(component.newArticle.title).toBe('New title');
      expect(component.isSaveButtonDisable).toBe(false);
    });
  });

  describe('saveContent', () => {
    it('should save content but tagsIds is empty', () => {
      component.newArticle = {
        title: 'New title',
        content: '',
        tagsIds: [],
      };
      component.saveContent('New content');

      expect(component.newArticle.content).toBe('New content');
      expect(component.isSaveButtonDisable).toBe(true);
    });

    it('should save content but title is falsy', () => {
      component.newArticle = {
        title: '',
        content: '',
        tagsIds: [mockTag.id, mockTag2.id],
      };
      component.saveContent('New content');

      expect(component.newArticle.content).toBe('New content');
      expect(component.isSaveButtonDisable).toBe(true);
    });

    it('should save content', () => {
      component.newArticle = {
        title: 'New title',
        content: '',
        tagsIds: [mockTag.id, mockTag2.id],
      };
      component.saveContent('New content');

      expect(component.newArticle.content).toBe('New content');
      expect(component.isSaveButtonDisable).toBe(false);
    });
  });
});
