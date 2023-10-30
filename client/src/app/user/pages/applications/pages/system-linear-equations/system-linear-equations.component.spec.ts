import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLinearEquationsComponent } from './system-linear-equations.component';
import { MathjaxModule } from 'mathjax-angular';
import { SvgIconRegistryService } from 'angular-svg-icon';

describe('SystemLinearEquationsComponent', () => {
  let component: SystemLinearEquationsComponent;
  let fixture: ComponentFixture<SystemLinearEquationsComponent>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;

  beforeEach(async () => {
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [SystemLinearEquationsComponent, MathjaxModule.forRoot()],
      providers: [
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemLinearEquationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
