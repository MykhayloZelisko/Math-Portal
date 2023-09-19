import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolvingTriangleComponent } from './solving-triangle.component';

describe('SolvingTriangleComponent', () => {
  let component: SolvingTriangleComponent;
  let fixture: ComponentFixture<SolvingTriangleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolvingTriangleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SolvingTriangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
