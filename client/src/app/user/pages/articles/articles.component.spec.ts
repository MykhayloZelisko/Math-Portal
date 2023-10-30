import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesComponent } from './articles.component';
import { TagsService } from '../../../shared/services/tags.service';
import { TagInterface } from '../../../shared/models/interfaces/tag.interface';
import { of } from 'rxjs';

describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;
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
      imports: [ArticlesComponent],
      providers: [{ provide: TagsService, useValue: mockTagsService }],
    }).compileComponents();

    mockTagsService.getAllTags.and.returnValue(of(mockTagsList));

    fixture = TestBed.createComponent(ArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
