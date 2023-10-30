import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleComponent } from './article.component';
import { MathjaxModule } from 'mathjax-angular';
import { ArticlesService } from '../../../../../shared/services/articles.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TagsService } from '../../../../../shared/services/tags.service';
import { BehaviorSubject } from 'rxjs';
import { TagInterface } from '../../../../../shared/models/interfaces/tag.interface';
import { RatingService } from '../../../../../shared/services/rating.service';
import { UsersService } from '../../../../../shared/services/users.service';
import { UserInterface } from '../../../../../shared/models/interfaces/user.interface';
import { DialogService } from '../../../../../shared/services/dialog.service';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;
  let mockArticlesService: jasmine.SpyObj<ArticlesService>;
  let mockTagsService: jasmine.SpyObj<TagsService>;
  let mockRatingService: jasmine.SpyObj<RatingService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;

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

    await TestBed.configureTestingModule({
      imports: [ArticleComponent, MathjaxModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: ArticlesService, useValue: mockArticlesService },
        { provide: TagsService, useValue: mockTagsService },
        { provide: RatingService, useValue: mockRatingService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: DialogService, useValue: mockDialogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
