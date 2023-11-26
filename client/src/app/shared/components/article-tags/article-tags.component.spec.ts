import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleTagsComponent } from './article-tags.component';
import { MathjaxModule } from 'mathjax-angular';
import { TagsService } from '../../services/tags.service';
import { TagInterface } from '../../models/interfaces/tag.interface';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

describe('ArticleTagsComponent', () => {
  let component: ArticleTagsComponent;
  let fixture: ComponentFixture<ArticleTagsComponent>;
  let mockTagsService: jasmine.SpyObj<TagsService>;
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

  beforeEach(async () => {
    mockTagsService = jasmine.createSpyObj('TagsService', ['getAllTags']);

    await TestBed.configureTestingModule({
      imports: [
        ArticleTagsComponent,
        MathjaxModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [{ provide: TagsService, useValue: mockTagsService }],
    }).compileComponents();

    mockTagsService.getAllTags.and.returnValue(of(mockTagsList));

    fixture = TestBed.createComponent(ArticleTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initTagList and initFilteredList methods', () => {
      spyOn(component, 'initTagList');
      spyOn(component, 'initFilteredList');
      component.ngOnInit();

      expect(component.initTagList).toHaveBeenCalled();
      expect(component.initFilteredList).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('should call clearTags method', () => {
      spyOn(component, 'clearTags');
      component.ngOnChanges();

      expect(component.clearTags).toHaveBeenCalled();
    });
  });

  describe('clearTags', () => {
    it('should not clear tags', () => {
      component.clearControl.clear = false;
      component.selectedTags = mockTagsList;
      component.tagInput.nativeElement.value = 'tag';
      component.tagCtrl.setValue('tag');
      component.clearTags();

      expect(component.selectedTags).toEqual(mockTagsList);
      expect(component.tagInput.nativeElement.value).toBe('tag');
      expect(component.tagCtrl.value).toBe('tag');
    });

    it('should clear tags', () => {
      component.clearControl.clear = true;
      component.selectedTags = mockTagsList;
      component.tagInput.nativeElement.value = 'tag';
      component.tagCtrl.setValue('tag');
      component.clearTags();

      expect(component.selectedTags.length).toBe(0);
      expect(component.tagInput.nativeElement.value).toBe('');
      expect(component.tagCtrl.value).toBe('');
      expect(component.clearControl.clear).toBe(false);
    });
  });

  describe('initTagList', () => {
    it('should init allTags and filteredTags values', () => {
      component.initTagList();

      expect(component.allTags).toEqual(mockTagsList);
      expect(component.filteredTags).toEqual(mockTagsList);
    });
  });

  describe('initFilteredList', () => {
    it('filteredList should be equal allTags', () => {
      component.allTags = mockTagsList;
      spyOn(component.tagCtrl.valueChanges, 'pipe').and.returnValue(of(''));
      component.initFilteredList();

      expect(component.filteredTags).toEqual(mockTagsList);
    });

    it('filteredList should contain a part of allTags', () => {
      component.allTags = mockTagsList;
      spyOn(component.tagCtrl.valueChanges, 'pipe').and.returnValue(of('g 1'));
      component.initFilteredList();

      expect(component.filteredTags).toEqual([mockTagsList[0]]);
    });
  });

  describe('remove', () => {
    it('should remove tag from selectedTags and call saveTags method', () => {
      component.selectedTags = mockTagsList;
      spyOn(component, 'saveTags');
      component.remove(mockTagsList[0]);

      expect(component.selectedTags).toEqual([mockTagsList[1]]);
      expect(component.saveTags).toHaveBeenCalledWith([mockTagsList[1]])
    });
  });

  describe('selected', () => {
    it('should add tag to selectedTags and call saveTags method', () => {
      component.allTags = mockTagsList;
      component.selectedTags = [mockTagsList[0]];
      const mockEvent: MatAutocompleteSelectedEvent = {
        option: {
          viewValue: 'Tag 2',
        }
      } as MatAutocompleteSelectedEvent;
      spyOn(component, 'saveTags');
      component.selected(mockEvent);

      expect(component.selectedTags).toEqual(mockTagsList);
      expect(component.saveTags).toHaveBeenCalledWith(mockTagsList);
      expect(component.tagInput.nativeElement.value).toBe('');
      expect(component.tagCtrl.value).toBe('');
    });

    it('should not add tag to selectedTags and not call saveTags method', () => {
      component.allTags = mockTagsList;
      component.selectedTags = [mockTagsList[0]];
      const mockEvent: MatAutocompleteSelectedEvent = {
        option: {
          viewValue: 'Tag 1',
        }
      } as MatAutocompleteSelectedEvent;
      spyOn(component, 'saveTags');
      component.selected(mockEvent);

      expect(component.selectedTags).toEqual([mockTagsList[0]]);
      expect(component.saveTags).not.toHaveBeenCalled();
      expect(component.tagInput.nativeElement.value).toBe('');
      expect(component.tagCtrl.value).toBe('');
    });
  });

  describe('saveTags', () => {
    it('should emit tagsIds', () => {
      const mockIds = mockTagsList.map((tag) => tag.id);
      spyOn(component.saveTagsIds, 'emit');
      component.saveTags(mockTagsList);

      expect(component.saveTagsIds.emit).toHaveBeenCalledWith(mockIds);
    });
  });
});
