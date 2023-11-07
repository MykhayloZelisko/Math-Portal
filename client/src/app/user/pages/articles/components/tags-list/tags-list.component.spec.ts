import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsListComponent } from './tags-list.component';
import { TagsService } from '../../../../../shared/services/tags.service';
import { TagInterface } from '../../../../../shared/models/interfaces/tag.interface';
import { BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';

describe('TagsListComponent', () => {
  let component: TagsListComponent;
  let fixture: ComponentFixture<TagsListComponent>;
  let mockTagsService: jasmine.SpyObj<TagsService>;
  let router: Router;
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
    mockTagsService = jasmine.createSpyObj('TagsService', ['getAllTags'], {
      tag$: new BehaviorSubject<TagInterface | null>(null),
    });

    await TestBed.configureTestingModule({
      imports: [TagsListComponent],
      providers: [
        { provide: TagsService, useValue: mockTagsService },
      ],
    }).compileComponents();

    mockTagsService.getAllTags.and.returnValue(of(mockTagsList));

    fixture = TestBed.createComponent(TagsListComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initTagsList method', () => {
      spyOn(component, 'initTagsList');
      component.ngOnInit();

      expect(component.initTagsList).toHaveBeenCalled();
    });
  });

  describe('initTagsList', () => {
    it('should init tags list', () => {
      component.initTagsList();

      expect(component.tagsList).toEqual(mockTagsList);
    });
  });

  describe('addTag', () => {
    it('should set tag and check route', () => {
      spyOn(component, 'checkRoute');
      component.addTag(mockTagsList[1]);

      expect(mockTagsService.tag$.value).toEqual(mockTagsList[1]);
      expect(component.checkRoute).toHaveBeenCalled();
    });
  });

  describe('checkRoute', () => {
    it('should not call navigateByUrl method', () => {
      // @ts-ignore: force this private property value for testing.
      router.currentUrlTree = router.parseUrl('/path');
      spyOn(router, 'navigateByUrl');
      component.checkRoute();

      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should call navigateByUrl method', () => {
      // @ts-ignore: force this private property value for testing.
      router.currentUrlTree = router.parseUrl('/path1/path2');
      spyOn(router, 'navigateByUrl');
      component.checkRoute();

      expect(router.navigateByUrl).toHaveBeenCalledWith('articles');
    });
  });
});
