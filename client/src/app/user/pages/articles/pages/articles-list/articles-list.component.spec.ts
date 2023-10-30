import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesListComponent } from './articles-list.component';
import { MathjaxModule } from 'mathjax-angular';
import { ArticlesService } from '../../../../../shared/services/articles.service';
import { TagsService } from '../../../../../shared/services/tags.service';
import { BehaviorSubject, of } from 'rxjs';
import { TagInterface } from '../../../../../shared/models/interfaces/tag.interface';
import { ArticlesListInterface } from '../../../../../shared/models/interfaces/articles-list.interface';
import { SvgIconRegistryService } from 'angular-svg-icon';

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
    total: 1,
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

  beforeEach(async () => {
    mockArticlesService = jasmine.createSpyObj('ArticlesService', [
      'getArticlesList',
    ]);
    mockTagsService = jasmine.createSpyObj('TagsService', [], {
      tag$: new BehaviorSubject<TagInterface | null>(mockTagsList[0]),
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
});
