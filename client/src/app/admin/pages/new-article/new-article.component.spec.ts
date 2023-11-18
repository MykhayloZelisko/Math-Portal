import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewArticleComponent } from './new-article.component';
import { MathjaxModule } from 'mathjax-angular';
import { ArticlesService } from '../../../shared/services/articles.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { TagsService } from '../../../shared/services/tags.service';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { TagInterface } from '../../../shared/models/interfaces/tag.interface';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateArticleInterface } from '../../../shared/models/interfaces/create-article.interface';
import { ArticleInterface } from '../../../shared/models/interfaces/article.interface';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';

describe('NewArticleComponent', () => {
  let component: NewArticleComponent;
  let fixture: ComponentFixture<NewArticleComponent>;
  let mockArticleService: jasmine.SpyObj<ArticlesService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  let mockTagsService: jasmine.SpyObj<TagsService>;
  const mockTag: TagInterface = {
    id: '34bacf2d-5c59-4897-a2f7-7a546e0c5d1a',
    value: 'Tag',
  };
  const mockTagsList: TagInterface[] = [mockTag];
  const mockNewArticle: CreateArticleInterface = {
    title: 'title',
    content: 'content',
    tagsIds: ['66165442-5cd2-40ef-a901-74e40dd9daa4'],
  };
  const mockArticle: ArticleInterface = {
    id: 'a41230b5-4566-4db5-bb0d-5cdbf7e318f3',
    title: 'Title',
    content: 'Content',
    rating: 3.7,
    votes: 5,
    tags: mockTagsList,
  };

  beforeEach(async () => {
    mockArticleService = jasmine.createSpyObj('ArticlesService', [
      'createArticle',
    ]);
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);
    mockTagsService = jasmine.createSpyObj('TagsService', ['getAllTags']);

    await TestBed.configureTestingModule({
      imports: [
        NewArticleComponent,
        MathjaxModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ArticlesService, useValue: mockArticleService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: TagsService, useValue: mockTagsService },
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    mockTagsService.getAllTags.and.returnValue(of(mockTagsList));

    fixture = TestBed.createComponent(NewArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('saveTitle', () => {
    it('should set newArticle.title and check isButtonDisabled', () => {
      component.newArticle = {
        ...mockNewArticle,
        title: '',
      };
      component.saveTitle(mockNewArticle.title);

      expect(component.newArticle.title).toBe(mockNewArticle.title);
      expect(component.isButtonDisable).toBe(false);
    });
  });

  describe('saveContent', () => {
    it('should set newArticle.content and check isButtonDisabled', () => {
      component.newArticle = {
        ...mockNewArticle,
        content: '',
      };
      component.saveContent(mockNewArticle.content);

      expect(component.newArticle.content).toBe(mockNewArticle.content);
      expect(component.isButtonDisable).toBe(false);
    });
  });

  describe('saveTagsIds', () => {
    it('should set newArticle.tagsIds and check isButtonDisabled', () => {
      component.newArticle = {
        ...mockNewArticle,
        tagsIds: [],
      };
      component.saveTagsIds(mockNewArticle.tagsIds);

      expect(component.newArticle.tagsIds).toEqual(mockNewArticle.tagsIds);
      expect(component.isButtonDisable).toBe(false);
    });
  });

  describe('saveArticle', () => {
    it('should open success dialog', () => {
      mockArticleService.createArticle.and.returnValue(of(mockArticle));
      component.saveArticle();

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(
        DialogTypeEnum.Alert,
        {
          title: 'ПОВІДОМЛЕННЯ',
          text: 'Статтю успішно збережено.',
        },
      );
    });

    it('should open error dialog', () => {
      mockArticleService.createArticle.and.returnValue(throwError(() => {}));
      component.saveArticle();

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(
        DialogTypeEnum.Alert,
        {
          title: 'ПОВІДОМЛЕННЯ',
          text: 'Помилка збереження статті. Повторіть спробу пізніше.',
        },
      );
    });
  });
});
