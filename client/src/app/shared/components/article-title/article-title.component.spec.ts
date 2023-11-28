import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleTitleComponent } from './article-title.component';
import { MathjaxModule } from 'mathjax-angular';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { of } from 'rxjs';

describe('ArticleTitleComponent', () => {
  let component: ArticleTitleComponent;
  let fixture: ComponentFixture<ArticleTitleComponent>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;

  beforeEach(async () => {
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [ArticleTitleComponent, MathjaxModule.forRoot()],
      providers: [
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call changeTitle method', () => {
      spyOn(component, 'changeTitle');
      component.ngOnInit();

      expect(component.changeTitle).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('should call clearTitle method', () => {
      spyOn(component, 'clearTitle');
      component.ngOnChanges();

      expect(component.clearTitle).toHaveBeenCalled();
    });
  });

  describe('clearTitle', () => {
    it('should not clear title and titleCtrl', () => {
      component.clearControl.clear = false;
      component.title = 'title';
      component.titleCtrl.setValue('title');
      component.clearTitle();

      expect(component.title).toBe('title');
      expect(component.titleCtrl.value).toBe('title');
    });

    it('should clear title and titleCtrl', () => {
      component.clearControl.clear = true;
      component.title = 'title';
      component.titleCtrl.setValue('title');
      component.clearTitle();

      expect(component.title).toBe('');
      expect(component.titleCtrl.value).toBe('');
      expect(component.clearControl.clear).toBe(false);
    });
  });

  describe('changeTitle', () => {
    it('should emit new title value', () => {
      component.title = 'title';
      spyOn(component.titleCtrl.valueChanges, 'pipe').and.returnValue(
        of('new title'),
      );
      spyOn(component.saveTitle, 'emit');
      component.changeTitle();

      expect(component.title).toBe('new title');
      expect(component.saveTitle.emit).toHaveBeenCalledWith('new title');
    });
  });

  describe('showTitle', () => {
    it('isTitleEditable should be false', () => {
      component.showTitle();

      expect(component.isTitleEditable).toBe(false);
    });
  });

  describe('editTitle', () => {
    it('isTitleEditable should be true', () => {
      component.editTitle();

      expect(component.isTitleEditable).toBe(true);
    });
  });
});
