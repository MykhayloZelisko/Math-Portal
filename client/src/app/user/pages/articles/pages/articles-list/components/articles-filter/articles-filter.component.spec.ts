import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesFilterComponent } from './articles-filter.component';
import { TagsService } from '../../../../../../../shared/services/tags.service';
import { BehaviorSubject } from 'rxjs';
import { TagInterface } from '../../../../../../../shared/models/interfaces/tag.interface';

describe('ArticlesFilterComponent', () => {
  let component: ArticlesFilterComponent;
  let fixture: ComponentFixture<ArticlesFilterComponent>;
  let mockTagsService: jasmine.SpyObj<TagsService>;

  beforeEach(async () => {
    mockTagsService = jasmine.createSpyObj('TagsService', [], {
      tag$: new BehaviorSubject<TagInterface | null>(null),
    });

    await TestBed.configureTestingModule({
      imports: [ArticlesFilterComponent],
      providers: [{ provide: TagsService, useValue: mockTagsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
