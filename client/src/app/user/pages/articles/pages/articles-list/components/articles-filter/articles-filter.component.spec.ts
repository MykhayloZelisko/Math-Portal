import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticlesFilterComponent } from './articles-filter.component';
import { TagsService } from '../../../../../../../shared/services/tags.service';
import { BehaviorSubject } from 'rxjs';
import { TagInterface } from '../../../../../../../shared/models/interfaces/tag.interface';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { ArticlesListParamsInterface } from '../../../../../../../shared/models/interfaces/articles-list-params.interface';

describe('ArticlesFilterComponent', () => {
  let component: ArticlesFilterComponent;
  let fixture: ComponentFixture<ArticlesFilterComponent>;
  let mockTagsService: jasmine.SpyObj<TagsService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  const mockTag: TagInterface = {
    id: '0102e249-26cd-4a9c-b23c-a9ad96ad3dd1',
    value: 'Tag 1',
  };
  const mockTagsList: TagInterface[] = [
    {
      id: '0102e249-26cd-4a9c-b23c-a9ad96ad33d1',
      value: 'Tag 3',
    },
    {
      id: '6e532d02-325f-4f37-b6ae-fc7c7aa36980',
      value: 'Tag 2',
    },
  ];

  beforeEach(async () => {
    mockTagsService = jasmine.createSpyObj('TagsService', [], {
      tag$: new BehaviorSubject<TagInterface | null>(null),
    });
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [ArticlesFilterComponent],
      providers: [
        { provide: TagsService, useValue: mockTagsService },
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initTagsList', () => {
    it('should add tag to tags list', () => {
      component.tagsList = [...mockTagsList];
      mockTagsService.tag$.next(mockTag);
      component.initTagsList();

      expect(component.tagsList).toEqual([...mockTagsList, mockTag]);
    });

    it('should not add tag to tags list', () => {
      component.tagsList = [...mockTagsList];
      mockTagsService.tag$.next(mockTagsList[0]);
      component.initTagsList();

      expect(component.tagsList).toEqual([...mockTagsList]);
    });
  });

  describe('initSearchValue', () => {
    it('should set search value to filter params', () => {
      component.searchArticleCtrl.setValue('');
      spyOn(component.changeFilterParams, 'emit');
      component.initSearchValue();

      expect(component.filterParams.filter).toBe('');
    });
  });

  describe('deleteTag', () => {
    it('should delete tag from tags list', () => {
      component.tagsList = [...mockTagsList, mockTag];
      component.deleteTag(mockTag);

      expect(component.tagsList).toEqual([...mockTagsList]);
    });

    it('should not delete tag from tags list', () => {
      component.tagsList = [...mockTagsList];
      component.deleteTag(mockTag);

      expect(component.tagsList).toEqual([...mockTagsList]);
    });
  });

  describe('clearFilters', () => {
    it('should clear all filters', () => {
      const filters: ArticlesListParamsInterface = {
        filter: '',
        tagsIds: [],
        page: 1,
        size: 10,
      };
      component.clearFilters();

      expect(component.filterParams).toEqual(filters);
    });
  });
});
