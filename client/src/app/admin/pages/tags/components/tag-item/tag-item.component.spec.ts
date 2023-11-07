import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagItemComponent } from './tag-item.component';
import { TagInterface } from '../../../../../shared/models/interfaces/tag.interface';
import { SvgIconRegistryService } from 'angular-svg-icon';

describe('TagItemComponent', () => {
  let component: TagItemComponent;
  let fixture: ComponentFixture<TagItemComponent>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  const mockTag: TagInterface = {
    id: '678e6a5e-c858-46fd-befd-22d6a576edb4',
    value: 'Tag 1',
  };

  beforeEach(async () => {
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [TagItemComponent],
      providers: [
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TagItemComponent);
    component = fixture.componentInstance;
    component.tag = mockTag;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
