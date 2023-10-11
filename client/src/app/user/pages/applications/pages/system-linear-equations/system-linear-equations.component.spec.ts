import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLinearEquationsComponent } from './system-linear-equations.component';

describe('SystemLinearEquationsComponent', () => {
  let component: SystemLinearEquationsComponent;
  let fixture: ComponentFixture<SystemLinearEquationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemLinearEquationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemLinearEquationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
