import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewArticleComponent } from './new-article.component';
import { MathjaxModule } from 'mathjax-angular';
import { ArticlesService } from '../../../shared/services/articles.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { TagsService } from '../../../shared/services/tags.service';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { TagInterface } from '../../../shared/models/interfaces/tag.interface';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NewArticleComponent', () => {
  let component: NewArticleComponent;
  let fixture: ComponentFixture<NewArticleComponent>;
  let mockArticleService: jasmine.SpyObj<ArticlesService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  let mockTagsService: jasmine.SpyObj<TagsService>;
  const mockTagsList: TagInterface[] = [];

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
});
