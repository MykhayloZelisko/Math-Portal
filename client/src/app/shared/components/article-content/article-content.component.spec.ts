import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleContentComponent } from './article-content.component';
import { MathjaxModule } from 'mathjax-angular';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { of } from 'rxjs';

describe('ArticleContentComponent', () => {
  let component: ArticleContentComponent;
  let fixture: ComponentFixture<ArticleContentComponent>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;

  beforeEach(async () => {
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [ArticleContentComponent, MathjaxModule.forRoot()],
      providers: [
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call changeContent method', () => {
      spyOn(component, 'changeContent');
      component.ngOnInit();

      expect(component.changeContent).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('should call clearContent method', () => {
      spyOn(component, 'clearContent');
      component.ngOnChanges();

      expect(component.clearContent).toHaveBeenCalled();
    });
  });

  describe('clearContent', () => {
    it('should not clear content and contentCtrl', () => {
      component.clearControl.clear = false;
      component.content = 'content';
      component.contentCtrl.setValue('content');
      component.clearContent();

      expect(component.content).toBe('content');
      expect(component.contentCtrl.value).toBe('content');
    });

    it('should clear content and contentCtrl', () => {
      component.clearControl.clear = true;
      component.content = 'content';
      component.contentCtrl.setValue('content');
      component.clearContent();

      expect(component.content).toBe('');
      expect(component.contentCtrl.value).toBe('');
      expect(component.clearControl.clear).toBe(false);
    });
  });

  describe('changeContent', () => {
    it('should emit new content value', () => {
      component.content = 'content';
      spyOn(component.contentCtrl.valueChanges, 'pipe').and.returnValue(
        of('new content'),
      );
      spyOn(component.saveContent, 'emit');
      component.changeContent();

      expect(component.content).toBe('new content');
      expect(component.saveContent.emit).toHaveBeenCalledWith('new content');
    });
  });

  describe('showContent', () => {
    it('isContentEditable should be false', () => {
      component.showContent();

      expect(component.isContentEditable).toBe(false);
    });
  });

  describe('editContent', () => {
    it('isContentEditable should be true', () => {
      component.editContent();

      expect(component.isContentEditable).toBe(true);
    });
  });
});
