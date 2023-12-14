import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingComponent } from './rating.component';

describe('RatingComponent', () => {
  let component: RatingComponent;
  let fixture: ComponentFixture<RatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    component.rating = 3.7;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initForm', () => {
    it('should init disabled rating form', () => {
      component.isActive = false;
      component.initForm();

      expect(component.ratingForm.controls['rating'].value).toBe(0);
      expect(component.ratingForm.controls['rating'].disabled).toBeTrue();
    });
  });

  describe('changeRating', () => {
    it('should emit rating value', () => {
      component.ratingForm.controls['rating'].setValue(4);
      spyOn(component.activeRating, 'emit');
      component.changeRating();

      expect(component.activeRating.emit).toHaveBeenCalledWith(4);
    });
  });

  describe('svgGradient', () => {
    it('should return "100%"', () => {
      const gradient = component.svgGradient(2);

      expect(gradient).toBe('100%');
    });

    it('should return "0%"', () => {
      const gradient = component.svgGradient(5);

      expect(gradient).toBe('0%');
    });

    it('should return "70%"', () => {
      const gradient = component.svgGradient(4);

      expect(gradient).toBe(`${100 - (4 - component.rating) * 100}%`);
    });
  });
});
