import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesListItemComponent } from './articles-list-item.component';
import { MathjaxModule } from 'mathjax-angular';
import { TagInterface } from '../../../../../../../shared/models/interfaces/tag.interface';
import { ArticleInterface } from '../../../../../../../shared/models/interfaces/article.interface';
import { Router } from '@angular/router';

describe('ArticlesListItemComponent', () => {
  let component: ArticlesListItemComponent;
  let fixture: ComponentFixture<ArticlesListItemComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
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
  const mockArticle: ArticleInterface = {
    id: '9d6b5333-c912-4647-8885-c99eb5f2f48d',
    title: 'title',
    content: 'content',
    rating: 4.1,
    votes: 10,
    tags: mockTagsList,
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [ArticlesListItemComponent, MathjaxModule.forRoot()],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesListItemComponent);
    component = fixture.componentInstance;
    component.article = mockArticle;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openArticle', () => {
    it('should redirect to article page', () => {
      component.openArticle();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
        `articles/${mockArticle.id}`,
      );
    });
  });
});
