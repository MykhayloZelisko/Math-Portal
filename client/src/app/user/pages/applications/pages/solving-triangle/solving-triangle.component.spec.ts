import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolvingTriangleComponent } from './solving-triangle.component';
import { MathjaxModule } from 'mathjax-angular';
import { SolvingTriangleEnum } from '../../../../../shared/models/enums/solving-triangle.enum';
import { TriangleTaskConfigInterface } from '../../../../../shared/models/interfaces/triangle-task-config.interface';
import { TriangleInterface } from '../../../../../shared/models/interfaces/triangle.interface';

describe('SolvingTriangleComponent', () => {
  let component: SolvingTriangleComponent;
  let fixture: ComponentFixture<SolvingTriangleComponent>;
  const mockTriangle: TriangleInterface = {
    side_a: 4,
    side_b: 5,
    side_c: 3,
    angle_a: 0.927295218,
    angle_b: 1.5707963268,
    angle_c: 0.6435011088,
    bisector_a: 3.3541019662,
    bisector_b: 2.4243661069,
    bisector_c: 4.2163702136,
    altitude_a: 3,
    altitude_b: 2.4,
    altitude_c: 4,
    median_a: 3.6055512755,
    median_b: 2.5,
    median_c: 4.2720018727,
    radius_R: 2.5,
    radius_r: 1,
    radius_ra: 3,
    radius_rb: 6,
    radius_rc: 2,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolvingTriangleComponent, MathjaxModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SolvingTriangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initTask method', () => {
      spyOn(component, 'initTask');
      component.ngOnInit();

      expect(component.initTask).toHaveBeenCalled();
    });
  });

  describe('initTask', () => {
    it('should ', () => {
      const mockConfig: TriangleTaskConfigInterface = {
        type: SolvingTriangleEnum.SideSideSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Сторона $c$'],
      };
      component.triangleCtrl.setValue({
        value: mockConfig.type,
        labels: mockConfig.labels,
      });
      component.initTask();

      expect(component.config).toEqual(mockConfig);
    });
  });

  describe('saveResult', () => {
    it('should set triangles value and call printResult method', () => {
      spyOn(component, 'printResult');
      component.saveResult([mockTriangle]);

      expect(component.triangles).toEqual([mockTriangle]);
      expect(component.printResult).toHaveBeenCalled();
    });
  });

  describe('printResult', () => {
    it('should convert triangle properties to strings', () => {
      component.triangles = [mockTriangle];
      component.printResult();

      expect(component.trianglesToString).toEqual([
        {
          side_a: `$a=${mockTriangle.side_a}$`,
          side_b: `$b=${mockTriangle.side_b}$`,
          side_c: `$c=${mockTriangle.side_c}$`,
          angle_a: `$\\alpha=${mockTriangle.angle_a}$`,
          angle_b: `$\\beta=${mockTriangle.angle_b}$`,
          angle_c: `$\\gamma=${mockTriangle.angle_c}$`,
          bisector_a: `$l_a=${mockTriangle.bisector_a}$`,
          bisector_b: `$l_b=${mockTriangle.bisector_b}$`,
          bisector_c: `$l_c=${mockTriangle.bisector_c}$`,
          altitude_a: `$h_a=${mockTriangle.altitude_a}$`,
          altitude_b: `$h_b=${mockTriangle.altitude_b}$`,
          altitude_c: `$h_c=${mockTriangle.altitude_c}$`,
          median_a: `$m_a=${mockTriangle.median_a}$`,
          median_b: `$m_b=${mockTriangle.median_b}$`,
          median_c: `$m_c=${mockTriangle.median_c}$`,
          radius_R: `$R=${mockTriangle.radius_R}$`,
          radius_r: `$r=${mockTriangle.radius_r}$`,
          radius_ra: `$r_a=${mockTriangle.radius_ra}$`,
          radius_rb: `$r_b=${mockTriangle.radius_rb}$`,
          radius_rc: `$r_c=${mockTriangle.radius_rc}$`,
        },
      ]);
    });
  });
});
