import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolvingTriangleFormComponent } from './solving-triangle-form.component';
import { MathjaxModule } from 'mathjax-angular';

describe('SolvingTriangleFormComponent', () => {
  let component: SolvingTriangleFormComponent;
  let fixture: ComponentFixture<SolvingTriangleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolvingTriangleFormComponent, MathjaxModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SolvingTriangleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
