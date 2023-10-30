import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsComponent } from './tags.component';
import { TagsService } from '../../../shared/services/tags.service';
import { TagInterface } from '../../../shared/models/interfaces/tag.interface';
import { of } from 'rxjs';
import { DialogService } from '../../../shared/services/dialog.service';
import { UsersService } from '../../../shared/services/users.service';
import { SvgIconRegistryService } from 'angular-svg-icon';

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;
  let mockTagsService: jasmine.SpyObj<TagsService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
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

  beforeEach(async () => {
    mockTagsService = jasmine.createSpyObj('TagsService', [
      'getAllTags',
      'createTag',
      'removeTag',
      'updateTag',
    ]);
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [TagsComponent],
      providers: [
        { provide: TagsService, useValue: mockTagsService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: UsersService, useValue: {} },
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    mockTagsService.getAllTags.and.returnValue(of(mockTagsList));

    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
