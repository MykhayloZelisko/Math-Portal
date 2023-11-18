import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolvingTriangleFormComponent } from './solving-triangle-form.component';
import { MathjaxModule } from 'mathjax-angular';
import { SimpleChanges } from '@angular/core';
import { SolvingTriangleEnum } from '../../../../../../../shared/models/enums/solving-triangle.enum';
import { ZERO_TRIANGLE } from '../../../../../../../shared/models/constants/zero-triangle';
import { of } from 'rxjs';
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

  describe('ngOnChanges', () => {
    it('should clear controls', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideAngleAngle,
        labels: ['Сторона $a$', 'Кут $\\alpha$', 'Кут $\\beta$'],
      };
      const mockChanges: SimpleChanges = {
        taskConfig: {
          previousValue: {
            type: SolvingTriangleEnum.SideSideAngle,
            labels: ['Сторона $a$', 'Сторона $b$', 'Кут $\\alpha$'],
          },
          currentValue: {
            type: SolvingTriangleEnum.SideAngleAngle,
            labels: ['Сторона $a$', 'Кут $\\alpha$', 'Кут $\\beta$'],
          },
          firstChange: false,
          isFirstChange: () => false,
        },
      };
      component.ngOnChanges(mockChanges);

      expect(component.triangleForm.value).toEqual({
        control_1: null,
        control_2: null,
        control_3: null,
      });
    });
  });

  describe('ngOnInit', () => {
    it('should call initTriangle method and emit empty array', () => {
      spyOn(component, 'initTriangle');
      spyOn(component.triangleEvent, 'emit');
      component.ngOnInit();

      expect(component.initTriangle).toHaveBeenCalled();
      expect(component.triangleEvent.emit).toHaveBeenCalledWith([]);
    });
  });

  describe('notNegative', () => {
    it('should set 0', () => {
      const mockEvent = {
        target: {
          value: '-3',
        },
      };
      component.notNegative(mockEvent as unknown as Event);

      expect(mockEvent.target.value).toBe('0');
    });

    it('should not change value', () => {
      const mockEvent = {
        target: {
          value: '123',
        },
      };
      component.notNegative(mockEvent as unknown as Event);

      expect(mockEvent.target.value).toBe('123');
    });
  });

  describe('countTriangle', () => {
    it('should return 1 when type is SSS', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Сторона $c$'],
      };
      const count = component.countTriangle(4, 3, 5);

      expect(count).toBe(1);
    });

    it('should return 0 when type is SSA', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideAngle,
        labels: ['Сторона $a$', 'Сторона $b$', 'Кут $\\alpha$'],
      };
      const count = component.countTriangle(1, 10, 0);

      expect(count).toBe(0);
    });

    it('should return 1 when type is SSA 1', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideAngle,
        labels: ['Сторона $a$', 'Сторона $b$', 'Кут $\\alpha$'],
      };
      const count = component.countTriangle(6, 6, 0.1);

      expect(count).toBe(1);
    });

    it('should return 1 when type is SSA 2', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideAngle,
        labels: ['Сторона $a$', 'Сторона $b$', 'Кут $\\alpha$'],
      };
      const count = component.countTriangle(10, 6, 0.1);

      expect(count).toBe(1);
    });

    it('should return 2 when type is SSA', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideAngle,
        labels: ['Сторона $a$', 'Сторона $b$', 'Кут $\\alpha$'],
      };
      const count = component.countTriangle(60, 61, 0.5);

      expect(count).toBe(2);
    });

    it('should return 1 when type is SAS', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideAngleSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Кут $\\gamma$'],
      };
      const count = component.countTriangle(4, 3, 1);

      expect(count).toBe(1);
    });

    it('should return 1 when type is SAA', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideAngleAngle,
        labels: ['Сторона $a$', 'Кут $\\alpha$', 'Кут $\\beta$'],
      };
      const count = component.countTriangle(4, 1, 1);

      expect(count).toBe(1);
    });

    it('should return 1 when type is ASA', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideAngleAngle,
        labels: ['Сторона $a$', 'Кут $\\beta$', 'Кут $\\gamma$'],
      };
      const count = component.countTriangle(4, 1, 1);

      expect(count).toBe(1);
    });

    it('should return 0 when type is SHS', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideAltitudeSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Висота $h_c$'],
      };
      const count = component.countTriangle(1, 1, 1);

      expect(count).toBe(0);
    });

    it('should return 1 when type is SHS', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideAltitudeSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Висота $h_c$'],
      };
      const count = component.countTriangle(3, 1, 1);

      expect(count).toBe(1);
    });

    it('should return 2 when type is SHS', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideAltitudeSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Висота $h_c$'],
      };
      const count = component.countTriangle(3, 2, 1);

      expect(count).toBe(2);
    });

    it('should return 0 when type is SSH', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideAltitude,
        labels: ['Сторона $a$', 'Сторона $b$', 'Висота $h_a$'],
      };
      const count = component.countTriangle(1, 1, 2);

      expect(count).toBe(0);
    });

    it('should return 1 when type is SSH', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideAltitude,
        labels: ['Сторона $a$', 'Сторона $b$', 'Висота $h_a$'],
      };
      const count = component.countTriangle(3, 1, 1);

      expect(count).toBe(1);
    });

    it('should return 2 when type is SSH', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideAltitude,
        labels: ['Сторона $a$', 'Сторона $b$', 'Висота $h_a$'],
      };
      const count = component.countTriangle(3, 2, 1);

      expect(count).toBe(2);
    });

    it('should return 1 when type is SMS', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideMedianSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Медіана $m_c$'],
      };
      const count = component.countTriangle(2, 2, 1);

      expect(count).toBe(1);
    });

    it('should return 1 when type is SSM', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideMedian,
        labels: ['Сторона $a$', 'Сторона $b$', 'Медіана $m_a$'],
      };
      const count = component.countTriangle(3, 2, 1);

      expect(count).toBe(1);
    });

    it('should return 1 when type is SBS', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideBisectorSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Бісектриса $l_c$'],
      };
      const count = component.countTriangle(3, 2, 1);

      expect(count).toBe(1);
    });

    it('should return 0 when type is null', () => {
      component.taskConfig = {
        type: null,
        labels: [],
      };
      const count = component.countTriangle(3, 2, 1);

      expect(count).toBe(0);
    });
  });

  describe('initTriangle', () => {
    it('should init triangle when type is SSS', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Сторона $c$'],
      };
      spyOn(component.triangleForm.valueChanges, 'pipe').and.returnValue(
        of({
          control_1: null,
          control_2: null,
          control_3: null,
        }),
      );
      spyOn(component, 'countTriangle').and.returnValue(1);
      component.initTriangle();

      expect(component.triangles).toEqual([ZERO_TRIANGLE]);
    });

    it('should emit empty array', () => {
      component.taskConfig = {
        type: null,
        labels: [],
      };
      spyOn(component.triangleForm.valueChanges, 'pipe').and.returnValue(
        of({
          control_1: null,
          control_2: null,
          control_3: null,
        }),
      );
      spyOn(component, 'countTriangle').and.returnValue(0);
      spyOn(component.triangleEvent, 'emit');
      component.initTriangle();

      expect(component.triangles).toEqual([]);
      expect(component.triangleEvent.emit).toHaveBeenCalledWith([]);
    });

    it('should init triangle when type is SSA', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideAngle,
        labels: ['Сторона $a$', 'Сторона $b$', 'Кут $\\alpha$'],
      };
      spyOn(component.triangleForm.valueChanges, 'pipe').and.returnValue(
        of({
          control_1: null,
          control_2: null,
          control_3: null,
        }),
      );
      spyOn(component, 'countTriangle').and.returnValue(2);
      component.initTriangle();

      expect(component.triangles).toEqual([ZERO_TRIANGLE, ZERO_TRIANGLE]);
    });

    it('should init triangle when type is SAS', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideAngleSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Кут $\\gamma$'],
      };
      spyOn(component.triangleForm.valueChanges, 'pipe').and.returnValue(
        of({
          control_1: null,
          control_2: null,
          control_3: null,
        }),
      );
      spyOn(component, 'countTriangle').and.returnValue(1);
      component.initTriangle();

      expect(component.triangles).toEqual([ZERO_TRIANGLE]);
    });

    it('should init triangle when type is SAA', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideAngleAngle,
        labels: ['Сторона $a$', 'Кут $\\alpha$', 'Кут $\\beta$'],
      };
      spyOn(component.triangleForm.valueChanges, 'pipe').and.returnValue(
        of({
          control_1: null,
          control_2: null,
          control_3: null,
        }),
      );
      spyOn(component, 'countTriangle').and.returnValue(1);
      component.initTriangle();

      expect(component.triangles).toEqual([ZERO_TRIANGLE]);
    });

    it('should init triangle when type is ASA', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.AngleSideAngle,
        labels: ['Сторона $a$', 'Кут $\\beta$', 'Кут $\\gamma$'],
      };
      spyOn(component.triangleForm.valueChanges, 'pipe').and.returnValue(
        of({
          control_1: null,
          control_2: null,
          control_3: null,
        }),
      );
      spyOn(component, 'countTriangle').and.returnValue(1);
      component.initTriangle();

      expect(component.triangles).toEqual([ZERO_TRIANGLE]);
    });

    it('should init triangle when type is SHS', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideAltitudeSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Висота $h_c$'],
      };
      spyOn(component.triangleForm.valueChanges, 'pipe').and.returnValue(
        of({
          control_1: null,
          control_2: null,
          control_3: null,
        }),
      );
      spyOn(component, 'countTriangle').and.returnValue(2);
      component.initTriangle();

      expect(component.triangles).toEqual([ZERO_TRIANGLE, ZERO_TRIANGLE]);
    });

    it('should init triangle when type is SSH', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideAltitude,
        labels: ['Сторона $a$', 'Сторона $b$', 'Висота $h_a$'],
      };
      spyOn(component.triangleForm.valueChanges, 'pipe').and.returnValue(
        of({
          control_1: null,
          control_2: null,
          control_3: null,
        }),
      );
      spyOn(component, 'countTriangle').and.returnValue(2);
      component.initTriangle();

      expect(component.triangles).toEqual([ZERO_TRIANGLE, ZERO_TRIANGLE]);
    });

    it('should init triangle when type is SMS', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideMedianSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Медіана $m_c$'],
      };
      spyOn(component.triangleForm.valueChanges, 'pipe').and.returnValue(
        of({
          control_1: null,
          control_2: null,
          control_3: null,
        }),
      );
      spyOn(component, 'countTriangle').and.returnValue(1);
      component.initTriangle();

      expect(component.triangles).toEqual([ZERO_TRIANGLE]);
    });

    it('should init triangle when type is SSM', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideMedian,
        labels: ['Сторона $a$', 'Сторона $b$', 'Медіана $m_a$'],
      };
      spyOn(component.triangleForm.valueChanges, 'pipe').and.returnValue(
        of({
          control_1: null,
          control_2: null,
          control_3: null,
        }),
      );
      spyOn(component, 'countTriangle').and.returnValue(1);
      component.initTriangle();

      expect(component.triangles).toEqual([ZERO_TRIANGLE]);
    });

    it('should init triangle when type is SBS', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideBisectorSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Бісектриса $l_c$'],
      };
      spyOn(component.triangleForm.valueChanges, 'pipe').and.returnValue(
        of({
          control_1: null,
          control_2: null,
          control_3: null,
        }),
      );
      spyOn(component, 'countTriangle').and.returnValue(1);
      component.initTriangle();

      expect(component.triangles).toEqual([ZERO_TRIANGLE]);
    });

    it('should not init triangle when type is null', () => {
      component.taskConfig = {
        type: null,
        labels: [],
      };
      spyOn(component.triangleForm.valueChanges, 'pipe').and.returnValue(
        of({
          control_1: null,
          control_2: null,
          control_3: null,
        }),
      );
      spyOn(component, 'countTriangle').and.returnValue(1);
      component.initTriangle();

      expect(component.triangles).toEqual([]);
    });
  });

  describe('calculate', () => {
    it('should call calculateSSS method', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Сторона $c$'],
      };
      spyOn(component, 'calculateSSS');
      component.calculate();

      expect(component.calculateSSS).toHaveBeenCalled();
    });

    it('should call calculateSSA method', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideAngle,
        labels: ['Сторона $a$', 'Сторона $b$', 'Кут $\\alpha$'],
      };
      spyOn(component, 'calculateSSA');
      component.calculate();

      expect(component.calculateSSA).toHaveBeenCalled();
    });

    it('should call calculateSAS method', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideAngleSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Кут $\\gamma$'],
      };
      spyOn(component, 'calculateSAS');
      component.calculate();

      expect(component.calculateSAS).toHaveBeenCalled();
    });

    it('should call calculateSAA method', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideAngleAngle,
        labels: ['Сторона $a$', 'Кут $\\alpha$', 'Кут $\\beta$'],
      };
      spyOn(component, 'calculateSAA');
      component.calculate();

      expect(component.calculateSAA).toHaveBeenCalled();
    });

    it('should call calculateASA method', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.AngleSideAngle,
        labels: ['Сторона $a$', 'Кут $\\beta$', 'Кут $\\gamma$'],
      };
      spyOn(component, 'calculateASA');
      component.calculate();

      expect(component.calculateASA).toHaveBeenCalled();
    });

    it('should call calculateSHS method', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideAltitudeSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Висота $h_c$'],
      };
      spyOn(component, 'calculateSHS');
      component.calculate();

      expect(component.calculateSHS).toHaveBeenCalled();
    });

    it('should call calculateSSH method', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideAltitude,
        labels: ['Сторона $a$', 'Сторона $b$', 'Висота $h_a$'],
      };
      spyOn(component, 'calculateSSH');
      component.calculate();

      expect(component.calculateSSH).toHaveBeenCalled();
    });

    it('should call calculateSMS method', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideMedianSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Медіана $m_c$'],
      };
      spyOn(component, 'calculateSMS');
      component.calculate();

      expect(component.calculateSMS).toHaveBeenCalled();
    });

    it('should call calculateSSM method', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideSideMedian,
        labels: ['Сторона $a$', 'Сторона $b$', 'Медіана $m_a$'],
      };
      spyOn(component, 'calculateSSM');
      component.calculate();

      expect(component.calculateSSM).toHaveBeenCalled();
    });

    it('should call calculateSBS method', () => {
      component.taskConfig = {
        type: SolvingTriangleEnum.SideBisectorSide,
        labels: ['Сторона $a$', 'Сторона $b$', 'Бісектриса $l_c$'],
      };
      spyOn(component, 'calculateSBS');
      component.calculate();

      expect(component.calculateSBS).toHaveBeenCalled();
    });

    it('should not call any methods (check only two methods)', () => {
      component.taskConfig = {
        type: null,
        labels: [],
      };
      spyOn(component, 'calculateSSS');
      spyOn(component, 'calculateSSA');
      component.calculate();

      expect(component.calculateSSS).not.toHaveBeenCalled();
      expect(component.calculateSSA).not.toHaveBeenCalled();
    });
  });

  describe('calculateSSS', () => {
    it('should calculate all elements of triangles', () => {
      component.triangles = [
        {
          ...ZERO_TRIANGLE,
          side_a: 3,
          side_b: 4,
          side_c: 5,
        },
      ];
      component.calculateSSS();

      expect(component.triangles).toEqual([
        {
          side_a: 3,
          side_b: 4,
          side_c: 5,
          angle_a: 0.6435011087932843,
          angle_b: 0.9272952180016123,
          angle_c: 1.5707963267948966,
          bisector_a: 4.216370213557839,
          bisector_b: 3.3541019662496847,
          bisector_c: 2.4243661069253055,
          altitude_a: 4,
          altitude_b: 3,
          altitude_c: 2.4,
          median_a: 4.272001872658765,
          median_b: 3.605551275463989,
          median_c: 2.5,
          radius_R: 2.5,
          radius_r: 1,
          radius_ra: 2,
          radius_rb: 3,
          radius_rc: 6,
        },
      ]);
    });
  });

  describe('calculateSSA', () => {
    it('should calculate all elements of triangles', () => {
      component.triangles = [
        {
          ...ZERO_TRIANGLE,
          side_a: 60,
          side_b: 61,
          angle_a: 0.5,
        },
        {
          ...ZERO_TRIANGLE,
          side_a: 60,
          side_b: 61,
          angle_a: 0.5,
        },
      ];
      component.calculateSSA();

      expect(component.triangles).toEqual([
        {
          side_a: 60,
          side_b: 61,
          side_c: 105.92273039661444,
          angle_a: 0.5,
          angle_b: 0.5091279267954503,
          angle_c: 2.1324647267943426,
          bisector_a: 75.00980588701188,
          bisector_b: 74.13753039026781,
          bisector_c: 29.24526244025427,
          altitude_a: 51.62842977200505,
          altitude_b: 50.78206207082464,
          altitude_c: 29.24495785485637,
          median_a: 81.05746361277865,
          median_b: 80.49572912482336,
          median_c: 29.25053497513392,
          radius_R: 62.57488928800468,
          radius_r: 13.650927700835206,
          radius_ra: 28.971442974097375,
          radius_rb: 29.523686379593652,
          radius_rc: 205.45535549916292,
        },
        {
          side_a: 60,
          side_b: 61,
          side_c: 1.14234215401107,
          angle_a: 0.5,
          angle_b: 2.6324647267943426,
          angle_c: 0.009127926795450492,
          bisector_a: 2.1729660432635605,
          bisector_b: 0.564587871405576,
          bisector_c: 60.49523771242805,
          altitude_a: 0.5567958024980398,
          altitude_b: 0.547668002457059,
          altitude_c: 29.244957854857258,
          median_a: 31.00245914114581,
          median_b: 29.50258417153344,
          median_c: 60.49936994383324,
          radius_R: 62.57488928799943,
          radius_r: 0.27351488075902514,
          radius_ra: 15.594030154022578,
          radius_rb: 234.70031335400887,
          radius_rc: 0.2787285247373003,
        },
      ]);
    });
  });

  describe('calculateSAS', () => {
    it('should calculate all elements of triangles', () => {
      component.triangles = [
        {
          ...ZERO_TRIANGLE,
          side_a: 4,
          side_b: 3,
          angle_c: 1,
        },
      ];
      component.calculateSAS();

      expect(component.triangles).toEqual([
        {
          side_a: 4,
          side_b: 3,
          side_c: 3.468824679796407,
          angle_a: 1.326567250183821,
          angle_b: 0.8150254034059721,
          angle_c: 1,
          bisector_a: 2.535248358276982,
          bisector_b: 3.411257688975822,
          bisector_c: 3.0088544979098493,
          altitude_a: 2.52441295442369,
          altitude_b: 3.3658839392315865,
          altitude_c: 2.910972087031915,
          median_a: 2.5527186154338124,
          median_b: 3.4302146185890936,
          median_c: 3.0808787439964007,
          radius_R: 2.0611671361362034,
          radius_r: 0.9645449347510837,
          radius_ra: 4.0900643534264525,
          radius_rb: 2.259576631714,
          radius_rc: 2.8595724941554503,
        },
      ]);
    });
  });

  describe('calculateSAA', () => {
    it('should calculate all elements of triangles', () => {
      component.triangles = [
        {
          ...ZERO_TRIANGLE,
          side_a: 4,
          angle_a: 1,
          angle_b: 1,
        },
      ];
      component.calculateSAA();

      expect(component.triangles).toEqual([
        {
          side_a: 4,
          side_b: 4,
          side_c: 4.322418446945117,
          angle_a: 1,
          angle_b: 1,
          angle_c: 1.1415926535897931,
          bisector_a: 3.6463237972608202,
          bisector_b: 3.6463237972608202,
          bisector_c: 3.3658839392315865,
          altitude_a: 3.6371897073027277,
          altitude_b: 3.6371897073027277,
          altitude_c: 3.3658839392315874,
          median_a: 3.6526224298777064,
          median_b: 3.6526224298777064,
          median_c: 3.3658839392315865,
          radius_R: 2.3767902115562416,
          radius_r: 1.1806739798564243,
          radius_ra: 3.3658839392315865,
          radius_rb: 3.3658839392315865,
          radius_rc: 3.956066947618221,
        },
      ]);
    });
  });

  describe('calculateASA', () => {
    it('should calculate all elements of triangles', () => {
      component.triangles = [
        {
          ...ZERO_TRIANGLE,
          side_a: 4,
          angle_b: 1,
          angle_c: 1,
        },
      ];
      component.calculateASA();

      expect(component.triangles).toEqual([
        {
          side_a: 4,
          side_b: 3.701631435361852,
          side_c: 3.701631435361852,
          angle_a: 1.1415926535897931,
          angle_b: 1,
          angle_c: 1,
          bisector_a: 3.114815449309805,
          bisector_b: 3.3743366978621614,
          bisector_c: 3.3743366978621614,
          altitude_a: 3.1148154493098064,
          altitude_b: 3.365883939231587,
          altitude_c: 3.365883939231587,
          median_a: 3.114815449309805,
          median_b: 3.3801655019857773,
          median_c: 3.3801655019857773,
          radius_R: 2.1995003405892324,
          radius_r: 1.0926049796875814,
          radius_ra: 3.6609754434249036,
          radius_rb: 3.114815449309805,
          radius_rc: 3.114815449309805,
        },
      ]);
    });
  });

  describe('calculateSHS', () => {
    it('should calculate all elements of triangles when a is equal b', () => {
      component.triangles = [
        {
          ...ZERO_TRIANGLE,
          side_a: 5,
          side_b: 5,
          altitude_c: 3,
        },
      ];
      component.calculateSHS();

      expect(component.triangles).toEqual([
        {
          side_a: 5,
          side_b: 5,
          side_c: 8,
          angle_a: 0.6435011087932844,
          angle_b: 0.6435011087932844,
          angle_c: 1.8545904360032246,
          bisector_a: 5.838051064926239,
          bisector_b: 5.838051064926239,
          bisector_c: 3,
          altitude_a: 4.8,
          altitude_b: 4.8,
          altitude_c: 3,
          median_a: 6.18465843842649,
          median_b: 6.18465843842649,
          median_c: 3,
          radius_R: 4.166666666666667,
          radius_r: 1.3333333333333333,
          radius_ra: 3,
          radius_rb: 3,
          radius_rc: 12,
        },
      ]);
    });

    it('should calculate all elements of triangles when a is equal h_c', () => {
      component.triangles = [
        {
          ...ZERO_TRIANGLE,
          side_a: 4,
          side_b: 5,
          altitude_c: 4,
        },
      ];
      component.calculateSHS();

      expect(component.triangles).toEqual([
        {
          side_a: 4,
          side_b: 5,
          side_c: 2.999999999999999,
          angle_a: 0.9272952180016123,
          angle_b: 1.5707963267948966,
          angle_c: 0.6435011087932843,
          bisector_a: 3.3541019662496843,
          bisector_b: 2.4243661069253055,
          bisector_c: 4.216370213557839,
          altitude_a: 3.0000000000000004,
          altitude_b: 2.4000000000000004,
          altitude_c: 4,
          median_a: 3.6055512754639887,
          median_b: 2.499999999999999,
          median_c: 4.272001872658765,
          radius_R: 2.499999999999999,
          radius_r: 1.0000000000000002,
          radius_ra: 3.000000000000001,
          radius_rb: 6.000000000000002,
          radius_rc: 2,
        },
      ]);
    });

    it('should calculate all elements of triangles when b is equal h_c', () => {
      component.triangles = [
        {
          ...ZERO_TRIANGLE,
          side_a: 5,
          side_b: 4,
          altitude_c: 4,
        },
      ];
      component.calculateSHS();

      expect(component.triangles).toEqual([
        {
          side_a: 5,
          side_b: 4,
          side_c: 2.999999999999999,
          angle_a: 1.5707963267948966,
          angle_b: 0.9272952180016123,
          angle_c: 0.6435011087932843,
          bisector_a: 2.4243661069253055,
          bisector_b: 3.3541019662496843,
          bisector_c: 4.216370213557839,
          altitude_a: 2.4000000000000004,
          altitude_b: 3.0000000000000004,
          altitude_c: 4,
          median_a: 2.499999999999999,
          median_b: 3.6055512754639887,
          median_c: 4.272001872658765,
          radius_R: 2.499999999999999,
          radius_r: 1.0000000000000002,
          radius_ra: 6.000000000000002,
          radius_rb: 3.000000000000001,
          radius_rc: 2,
        },
      ]);
    });

    it('should calculate all elements of triangles when a is greater than b', () => {
      component.triangles = [
        {
          ...ZERO_TRIANGLE,
          side_a: 5,
          side_b: 4,
          altitude_c: 3,
        },
        {
          ...ZERO_TRIANGLE,
          side_a: 5,
          side_b: 4,
          altitude_c: 3,
        },
      ];
      component.calculateSHS();

      expect(component.triangles).toEqual([
        {
          side_a: 5,
          side_b: 4,
          side_c: 6.645751311064591,
          angle_a: 0.848062078981481,
          angle_b: 0.6435011087932844,
          angle_c: 1.6500294658150279,
          bisector_a: 4.551817123539408,
          bisector_b: 5.413745411010274,
          bisector_c: 3.015760637891807,
          altitude_a: 3.987450786638753,
          altitude_b: 4.984313483298441,
          altitude_c: 3,
          median_a: 4.881905902847612,
          median_b: 5.530190344306275,
          median_c: 3.0754670178479917,
          radius_R: 3.3333333333333344,
          radius_r: 1.2742918851774314,
          radius_ra: 3.5313730334031135,
          radius_rb: 2.6076252185107642,
          radius_rc: 8.468626966596887,
        },
        {
          side_a: 5,
          side_b: 4,
          side_c: 1.3542486889354093,
          angle_a: 2.293530574608312,
          angle_b: 0.6435011087932844,
          angle_c: 0.20456097018819663,
          bisector_a: 0.8325188779253728,
          bisector_b: 2.0218804385748332,
          bisector_c: 4.421217375744421,
          altitude_a: 0.8125492133612469,
          altitude_b: 1.0156865167015585,
          altitude_c: 3,
          median_a: 1.6330936151187527,
          median_b: 3.0687122308456423,
          median_c: 4.476773684488549,
          radius_R: 3.333333333333328,
          radius_r: 0.39237478148923544,
          radius_ra: 11.468626966596878,
          radius_rb: 1.7257081148225701,
          radius_rc: 0.5313730334031148,
        },
      ]);
    });

    it('should calculate all elements of triangles when b is greater than a', () => {
      component.triangles = [
        {
          ...ZERO_TRIANGLE,
          side_a: 4,
          side_b: 6,
          altitude_c: 3,
        },
        {
          ...ZERO_TRIANGLE,
          side_a: 4,
          side_b: 6,
          altitude_c: 3,
        },
      ];
      component.calculateSHS();

      expect(component.triangles).toEqual([
        {
          side_a: 4,
          side_b: 6,
          side_c: 7.841903733771223,
          angle_a: 0.5235987755982989,
          angle_b: 0.848062078981481,
          angle_c: 1.769931799010013,
          bisector_a: 6.566753379659786,
          bisector_b: 4.828553155200151,
          bisector_c: 3.039916281620859,
          altitude_a: 5.881427800328415,
          altitude_b: 3.9209518668856096,
          altitude_c: 3,
          median_a: 6.689374192319303,
          median_b: 5.454147695549463,
          median_c: 3.259775522573025,
          radius_R: 4.000000000000002,
          radius_r: 1.3185650787244247,
          radius_ra: 2.390361848448915,
          radius_rb: 4.027062456595243,
          radius_rc: 10.901140773680266,
        },
        {
          side_a: 4,
          side_b: 6,
          side_c: 2.550401111642039,
          angle_a: 0.5235987755982989,
          angle_b: 2.293530574608312,
          angle_c: 0.32446330338318186,
          bisector_a: 3.457379277017285,
          bisector_b: 1.2815477714076324,
          bisector_c: 4.736972556468574,
          altitude_a: 1.9128008337315257,
          altitude_b: 1.2752005558210173,
          altitude_c: 3,
          median_a: 4.153585549273359,
          median_b: 1.500757447135437,
          median_c: 4.9369893196596815,
          radius_R: 4.000000000000008,
          radius_r: 0.6096381515510825,
          radius_ra: 1.6814349212755713,
          radius_rb: 13.901140773680297,
          radius_rc: 1.027062456595241,
        },
      ]);
    });
  });

  describe('calculateSSH', () => {
    it('should calculate all elements of triangles', () => {
      component.triangles = [
        {
          ...ZERO_TRIANGLE,
          side_a: 3,
          side_b: 2,
          altitude_a: 1,
        },
        {
          ...ZERO_TRIANGLE,
          side_a: 3,
          side_b: 2,
          altitude_a: 1,
        },
      ];
      component.calculateSSH();

      expect(component.triangles).toEqual([
        {
          side_a: 3,
          side_b: 2,
          side_c: 1.6148359528406395,
          angle_a: 1.9501965895197753,
          angle_b: 0.6677972884717189,
          angle_c: 0.5235987755982989,
          bisector_a: 1.0026047929720814,
          bisector_b: 1.983582773015579,
          bisector_c: 2.318221983093764,
          altitude_a: 1,
          altitude_b: 1.5,
          altitude_c: 1.8577738467630314,
          median_a: 1.0265707853301533,
          median_b: 2.191768139492261,
          median_c: 2.4182795974314706,
          radius_R: 1.6148359528406397,
          radius_r: 0.45352598634161073,
          radius_ra: 4.879350314729521,
          radius_rb: 1.1472995071606444,
          radius_rc: 0.8862199758140027,
        },
        {
          side_a: 3,
          side_b: 2,
          side_c: 4.836559194862941,
          angle_a: 0.315338013471825,
          angle_b: 0.20826076212647404,
          angle_c: 2.617993877991494,
          bisector_a: 2.7947195286251816,
          bisector_b: 3.6830152305241843,
          bisector_c: 0.6211657082460502,
          altitude_a: 1,
          altitude_b: 1.5000000000000009,
          altitude_c: 0.6202756710155423,
          median_a: 3.3832162837611537,
          median_b: 3.8982242653170474,
          median_c: 0.8074179764203203,
          radius_R: 4.8365591948629385,
          radius_r: 0.3049846944007338,
          radius_ra: 0.781950661419985,
          radius_rb: 0.5140014689888621,
          radius_rc: 18.35526934344364,
        },
      ]);
    });
  });

  describe('calculateSMS', () => {
    it('should calculate all elements of triangles', () => {
      component.triangles = [
        {
          ...ZERO_TRIANGLE,
          side_a: 4,
          side_b: 4,
          median_c: 2,
        },
      ];
      component.calculateSMS();

      expect(component.triangles).toEqual([
        {
          side_a: 4,
          side_b: 4,
          side_c: 6.928203230275509,
          angle_a: 0.5235987755982989,
          angle_b: 0.5235987755982989,
          angle_c: 2.094395102393195,
          bisector_a: 4.898979485566356,
          bisector_b: 4.898979485566356,
          bisector_c: 2.0000000000000004,
          altitude_a: 3.4641016151377553,
          altitude_b: 3.4641016151377553,
          altitude_c: 2.0000000000000004,
          median_a: 5.2915026221291805,
          median_b: 5.2915026221291805,
          median_c: 2,
          radius_R: 3.999999999999999,
          radius_r: 0.9282032302755093,
          radius_ra: 2.0000000000000004,
          radius_rb: 2.0000000000000004,
          radius_rc: 12.928203230275507,
        },
      ]);
    });
  });

  describe('calculateSSM', () => {
    it('should calculate all elements of triangles', () => {
      component.triangles = [
        {
          ...ZERO_TRIANGLE,
          side_a: 4,
          side_b: 4,
          median_a: 3,
        },
      ];
      component.calculateSSM();

      expect(component.triangles).toEqual([
        {
          side_a: 4,
          side_b: 4,
          side_c: 3.1622776601683795,
          angle_a: 1.1644185461105663,
          angle_b: 1.1644185461105663,
          angle_c: 0.8127555613686606,
          bisector_a: 2.950225775466004,
          bisector_b: 2.950225775466004,
          bisector_c: 3.674234614174767,
          altitude_a: 2.9047375096555634,
          altitude_b: 2.9047375096555634,
          altitude_c: 3.6742346141747677,
          median_a: 3,
          median_b: 3,
          median_c: 3.6742346141747673,
          radius_R: 2.177324215807269,
          radius_r: 1.0409121142079694,
          radius_ra: 3.6742346141747673,
          radius_rb: 3.6742346141747673,
          radius_rc: 2.401739749087513,
        },
      ]);
    });
  });

  describe('calculateSBS', () => {
    it('should calculate all elements of triangles', () => {
      component.triangles = [
        {
          ...ZERO_TRIANGLE,
          side_a: 4,
          side_b: 4,
          bisector_c: 3,
        },
      ];
      component.calculateSBS();

      expect(component.triangles).toEqual([
        {
          side_a: 4,
          side_b: 4,
          side_c: 5.291502622129181,
          angle_a: 0.8480620789814811,
          angle_b: 0.8480620789814808,
          angle_c: 1.4454684956268313,
          bisector_a: 4.152504370215302,
          bisector_b: 4.152504370215302,
          bisector_c: 3,
          altitude_a: 3.968626966596886,
          altitude_b: 3.968626966596886,
          altitude_c: 3,
          median_a: 4.242640687119285,
          median_b: 4.242640687119285,
          median_c: 3,
          radius_R: 2.6666666666666665,
          radius_r: 1.1943350814194542,
          radius_ra: 3,
          radius_rb: 3,
          radius_rc: 5.861001748086122,
        },
      ]);
    });
  });

  describe('showResult', () => {
    it('should round all results', () => {
      component.triangles = [
        {
          side_a: 4,
          side_b: 5,
          side_c: 2.999999999999999,
          angle_a: 0.9272952180016123,
          angle_b: 1.5707963267948966,
          angle_c: 0.6435011087932843,
          bisector_a: 3.3541019662496843,
          bisector_b: 2.4243661069253055,
          bisector_c: 4.216370213557839,
          altitude_a: 3.0000000000000004,
          altitude_b: 2.4000000000000004,
          altitude_c: 4,
          median_a: 3.6055512754639887,
          median_b: 2.499999999999999,
          median_c: 4.272001872658765,
          radius_R: 2.499999999999999,
          radius_r: 1.0000000000000002,
          radius_ra: 3.000000000000001,
          radius_rb: 6.000000000000002,
          radius_rc: 2,
        },
      ];
      component.showResult();

      expect(component.triangles).toEqual([
        {
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
        },
      ]);
    });
  });
});
