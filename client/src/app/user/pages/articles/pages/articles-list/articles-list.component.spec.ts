import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesListComponent } from './articles-list.component';
import { MathjaxModule } from 'mathjax-angular';
import { ArticlesService } from '../../../../../shared/services/articles.service';
import { TagsService } from '../../../../../shared/services/tags.service';
import { BehaviorSubject, of } from 'rxjs';
import { TagInterface } from '../../../../../shared/models/interfaces/tag.interface';
import { ArticlesListInterface } from '../../../../../shared/models/interfaces/articles-list.interface';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { ArticlesListParamsInterface } from '../../../../../shared/models/interfaces/articles-list-params.interface';

describe('ArticlesListComponent', () => {
  let component: ArticlesListComponent;
  let fixture: ComponentFixture<ArticlesListComponent>;
  let mockArticlesService: jasmine.SpyObj<ArticlesService>;
  let mockTagsService: jasmine.SpyObj<TagsService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  const mockTagsList: TagInterface[] = [
    {
      id: '0102e249-26cd-4a9c-b23c-a9ad96ad3dd1',
      value: 'Tag 1',
    },
    {
      id: '6e532d02-325f-4f37-b6ae-fc7c7aa36980',
      value: 'Tag 2',
    },
  ];
  const mockArticlesList: ArticlesListInterface = {
    total: 2,
    articles: [
      {
        id: '9d6b5333-c912-4647-8885-c99eb5f2f48d',
        title: 'title',
        content: 'content',
        rating: 4.1,
        votes: 10,
        tags: mockTagsList,
      },
    ],
  };
  const mockParams: ArticlesListParamsInterface = {
    filter: 'text',
    tagsIds: [],
    page: 2,
    size: 1,
  };

  beforeEach(async () => {
    mockArticlesService = jasmine.createSpyObj('ArticlesService', [
      'getArticlesList',
    ]);
    mockTagsService = jasmine.createSpyObj('TagsService', [], {
      tag$: new BehaviorSubject<TagInterface | null>(null),
    });
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [ArticlesListComponent, MathjaxModule.forRoot()],
      providers: [
        { provide: ArticlesService, useValue: mockArticlesService },
        { provide: TagsService, useValue: mockTagsService },
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    mockArticlesService.getArticlesList.and.returnValue(of(mockArticlesList));

    fixture = TestBed.createComponent(ArticlesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init articles list', () => {
      mockTagsService.tag$.next(null);
      spyOn(component, 'initArticlesList');
      component.ngOnInit();

      expect(component.initArticlesList).toHaveBeenCalled();
    });

    it('should not init articles list', () => {
      mockTagsService.tag$.next(mockTagsList[0]);
      spyOn(component, 'initArticlesList');
      component.ngOnInit();

      expect(component.initArticlesList).not.toHaveBeenCalled();
    });
  });

  describe('changePaginationParams', () => {
    it('should init articles list', () => {
      spyOn(component, 'initArticlesList');
      component.changePaginationParams(mockParams);

      expect(component.initArticlesList).toHaveBeenCalledWith(mockParams);
    });
  });

  describe('initArticlesList', () => {
    it('should add articles to list', () => {
      component.articlesList = mockArticlesList.articles;
      mockArticlesService.getArticlesList.and.returnValue(of(mockArticlesList));
      component.initArticlesList(mockParams);

      expect(component.articlesList).toEqual([
        ...mockArticlesList.articles,
        ...mockArticlesList.articles,
      ]);
      expect(component.isButtonVisible).toBe(false);
    });

    it('should hide button when articles list is empty', () => {
      component.articlesList = [];
      mockArticlesService.getArticlesList.and.returnValue(
        of({
          total: 0,
          articles: [],
        }),
      );
      component.initArticlesList({
        ...mockParams,
        page: 1,
      });

      expect(component.isButtonVisible).toBe(false);
    });
  });

  describe('loadMoreArticles', () => {
    it('should load next page of articles', () => {
      component.paginationParams = {
        ...mockParams,
        page: mockParams.page - 1,
      };
      spyOn(component, 'initArticlesList');
      component.loadMoreArticles();

      expect(component.paginationParams).toEqual(mockParams);
      expect(component.initArticlesList).toHaveBeenCalledWith(mockParams);
    });
  });
});
