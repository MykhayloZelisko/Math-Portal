import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewTagComponent } from './new-tag.component';
import { of } from 'rxjs';

describe('NewTagComponent', () => {
  let component: NewTagComponent;
  let fixture: ComponentFixture<NewTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTagComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initTag method', () => {
      spyOn(component, 'initTag');
      component.ngOnInit();

      expect(component.initTag).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('should call clearTag method', () => {
      spyOn(component, 'clearTag');
      component.ngOnChanges();

      expect(component.clearTag).toHaveBeenCalled();
    });
  });

  describe('initTag', () => {
    it('should init tag value', () => {
      spyOn(component.tagCtrl.valueChanges, 'pipe').and.returnValue(of('tag'));
      component.initTag();

      expect(component.tag).toBe('tag');
    });
  });

  describe('clearTag', () => {
    it('should clear tag control and tag value', () => {
      component.tagCtrl.setValue('tag 2');
      component.clearControl = { clear: true };
      component.clearTag();

      expect(component.tag).toBe('');
      expect(component.tagCtrl.value).toBe('');
      expect(component.clearControl.clear).toBe(false);
    });

    it('should not clear tag control and tag value', () => {
      component.tagCtrl.setValue('tag 2');
      component.clearControl = { clear: false };
      component.clearTag();

      expect(component.tag).toBe('tag 2');
      expect(component.tagCtrl.value).toBe('tag 2');
      expect(component.clearControl.clear).toBe(false);
    });
  });

  describe('onAddTag', () => {
    it('should emit tag value', () => {
      component.tagCtrl.setValue('new tag');
      spyOn(component.addTag, 'emit');
      component.onAddTag();

      expect(component.addTag.emit).toHaveBeenCalledWith('new tag');
    });
  });
});
