import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemLinearEquationsComponent } from './system-linear-equations.component';
import { MathjaxModule } from 'mathjax-angular';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { SolvingLinearSystemEnum } from '../../../../../shared/models/enums/solving-linear-system.enum';
import { SolvingLinearSystemInterface } from '../../../../../shared/models/interfaces/solving-linear-system.interface';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Matrix } from '../../../../../shared/models/classes/matrix';

describe('SystemLinearEquationsComponent', () => {
  let component: SystemLinearEquationsComponent;
  let fixture: ComponentFixture<SystemLinearEquationsComponent>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  const mockOptions: SolvingLinearSystemInterface[] = [
    {
      title: 'Метод Гауса',
      method: SolvingLinearSystemEnum.Gauss,
      disable: false,
    },
    {
      title: 'Метод Крамера',
      method: SolvingLinearSystemEnum.Cramer,
      disable: true,
    },
    {
      title: 'Матричний метод',
      method: SolvingLinearSystemEnum.Inverse,
      disable: true,
    },
  ];
  const cells: FormGroup[] = [];
  const cell: FormGroup = new FormGroup({
    cell: new FormControl(0),
  });
  for (let i = 1; i < 5; i++) {
    cells.push(cell);
  }
  const rows: FormGroup[] = [];
  const row: FormGroup = new FormGroup({
    cells: new FormArray(cells),
    free: new FormControl(0),
  });
  for (let i = 1; i < 5; i++) {
    rows.push(row);
  }
  const mockMatrixForm: FormGroup = new FormGroup({
    rows: new FormArray(rows),
  });
  const mockMatrixFormValue = {
    rows: [
      {
        cells: [{ coef: 1 }, { coef: 2 }],
        free: 3,
      },
      {
        cells: [{ coef: 4 }, { coef: 5 }],
        free: 9,
      },
    ],
  };
  const mockMatrixFormValue2 = {
    rows: [
      {
        cells: [{ coef: 1 }, { coef: 2 }],
        free: 3,
      },
      {
        cells: [{ coef: 1 }, { coef: 2 }],
        free: 3,
      },
    ],
  };
  const mockMatrixFormValue3 = {
    rows: [
      {
        cells: [{ coef: 1 }, { coef: 2 }],
        free: 3,
      },
      {
        cells: [{ coef: 1 }, { coef: 2 }],
        free: 1,
      },
    ],
  };

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

  describe('ngOnInit', () => {
    it('should call initParamsForm, initMatrixForm and initMethod methods', () => {
      spyOn(component, 'initParamsForm');
      spyOn(component, 'initMatrixForm');
      spyOn(component, 'initMethod');
      component.ngOnInit();

      expect(component.initParamsForm).toHaveBeenCalled();
      expect(component.initMatrixForm).toHaveBeenCalled();
      expect(component.initMethod).toHaveBeenCalled();
    });
  });

  describe('initMethod', () => {
    it('should init method of solving the system', () => {
      component.methodCtrl.setValue(SolvingLinearSystemEnum.Gauss);
      component.initMethod();

      expect(component.method).toBe(SolvingLinearSystemEnum.Gauss);
      expect(component.resultToString.length).toBe(0);
    });
  });

  describe('initMatrixForm', () => {
    it('should call addRow method many times', () => {
      component.eqsNumber = 5;
      spyOn(component, 'addRow');
      component.initMatrixForm();

      expect(component.addRow).toHaveBeenCalledTimes(5);
    });
  });

  describe('initParamsForm', () => {
    it('should init params form and call initSystem method', () => {
      spyOn(component, 'initSystem');
      component.initParamsForm();

      expect(component.initSystem).toHaveBeenCalled();
      expect(component.paramsForm.value).toEqual({
        eqsNumber: 2,
        varsNumber: 2,
      });
    });
  });

  describe('initSystem', () => {
    it('should set varsNumber and eqsNumber', () => {
      component.paramsForm.setValue({
        eqsNumber: 5,
        varsNumber: 5,
      });
      component.initSystem();

      expect(component.varsNumber).toBe(5);
      expect(component.eqsNumber).toBe(5);
    });

    it('should enable all methods when varsNumber and eqsNumber in form are equal', () => {
      component.varsNumber = 5;
      component.eqsNumber = 3;
      component.paramsForm.setValue({
        eqsNumber: 5,
        varsNumber: 5,
      });
      component.initSystem();

      component.solvingLinearSystemOptions.forEach((option) => {
        expect(option.disable).toBeFalse();
      });
    });

    it('should enable only Gauss method when varsNumber and eqsNumber in form are not equal', () => {
      component.varsNumber = 5;
      component.eqsNumber = 3;
      component.paramsForm.setValue({
        eqsNumber: 2,
        varsNumber: 5,
      });
      component.initSystem();

      expect(component.solvingLinearSystemOptions).toEqual(mockOptions);
      expect(component.methodCtrl.value).toBeNull();
    });

    it('should set method when form values and component values are equal', () => {
      component.varsNumber = 5;
      component.eqsNumber = 3;
      component.paramsForm.setValue({
        eqsNumber: 3,
        varsNumber: 5,
      });
      component.methodCtrl.setValue(SolvingLinearSystemEnum.Gauss);
      component.initSystem();

      expect(component.method).toBe(SolvingLinearSystemEnum.Gauss);
    });
  });

  describe('notNull', () => {
    it('should set 0', () => {
      const mockEvent = {
        target: {
          value: '',
        },
      };
      component.notNull(mockEvent as unknown as Event);

      expect(mockEvent.target.value).toBe('0');
    });

    it('should not change value', () => {
      const mockEvent = {
        target: {
          value: '123',
        },
      };
      component.notNull(mockEvent as unknown as Event);

      expect(mockEvent.target.value).toBe('123');
    });
  });

  describe('forbidInput', () => {
    it('should return false', () => {
      const mockEvent: jasmine.SpyObj<KeyboardEvent> = jasmine.createSpyObj(
        'KeyboardEvent',
        ['preventDefault'],
      );
      const result = component.forbidInput(mockEvent);

      expect(result).toBeFalse();
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe('addEquation', () => {
    it('should call addRow method and increase eqsNumber value', () => {
      component.paramsForm.controls['eqsNumber'].setValue(3);
      spyOn(component, 'addRow');
      component.addEquation();

      expect(component.addRow).toHaveBeenCalled();
      expect(component.paramsForm.controls['eqsNumber'].value).toBe(4);
    });
  });

  describe('removeEquation', () => {
    it('should call removeRow method and decrease eqsNumber value', () => {
      component.paramsForm.controls['eqsNumber'].setValue(3);
      spyOn(component, 'removeRow');
      component.removeEquation();

      expect(component.removeRow).toHaveBeenCalled();
      expect(component.paramsForm.controls['eqsNumber'].value).toBe(2);
    });
  });

  describe('addVariable', () => {
    it('should call addCell method many times and increase varsNumber value', () => {
      component.paramsForm.setValue({
        eqsNumber: 5,
        varsNumber: 3,
      });
      spyOn(component, 'addCell');
      component.addVariable();

      expect(component.addCell).toHaveBeenCalledTimes(5);
      expect(component.paramsForm.controls['varsNumber'].value).toBe(4);
    });
  });

  describe('removeVariable', () => {
    it('should call removeCell method many times and decrease varsNumber value', () => {
      component.paramsForm.setValue({
        eqsNumber: 5,
        varsNumber: 3,
      });
      spyOn(component, 'removeCell');
      component.removeVariable();

      expect(component.removeCell).toHaveBeenCalledTimes(5);
      expect(component.paramsForm.controls['varsNumber'].value).toBe(2);
    });
  });

  describe('getRows', () => {
    it('should return FormArray', () => {
      component.matrixForm = mockMatrixForm;
      const mockRows = component.getRows();

      expect(mockRows).toEqual(mockMatrixForm.get('rows') as FormArray);
    });
  });

  describe('newRow', () => {
    it('should create a new row with the expected structure', () => {
      const newRow = component.newRow();

      expect(newRow).toBeInstanceOf(FormGroup);
      expect(newRow.get('cells')).toBeInstanceOf(FormArray);
      expect(newRow.get('free')).toBeDefined();
    });
  });

  describe('addRow', () => {
    it('should call addCell method many times', () => {
      component.varsNumber = 5;
      spyOn(component, 'addCell');
      component.addRow();

      expect(component.addCell).toHaveBeenCalledTimes(5);
    });
  });

  describe('removeRow', () => {
    it('should call getRows', () => {
      spyOn(component, 'getRows').and.returnValue(
        mockMatrixForm.get('rows') as FormArray,
      );
      component.removeRow(0);

      expect(component.getRows).toHaveBeenCalled();
    });
  });

  describe('getCells', () => {
    it('should call getRows', () => {
      spyOn(component, 'getRows').and.returnValue(
        mockMatrixForm.get('rows') as FormArray,
      );
      component.getCells(0);

      expect(component.getRows).toHaveBeenCalled();
    });
  });

  describe('newCell', () => {
    it('should create a new cell with the expected structure', () => {
      const newCell = component.newCell();

      expect(newCell).toBeInstanceOf(FormGroup);
    });
  });

  describe('addCell', () => {
    it('should call getCells', () => {
      spyOn(component, 'getCells').and.returnValue(new FormArray(cells));
      component.addCell(0);

      expect(component.getCells).toHaveBeenCalled();
    });
  });

  describe('removeCell', () => {
    it('should call getCells', () => {
      spyOn(component, 'getCells').and.returnValue(new FormArray(cells));
      component.removeCell(0, 0);

      expect(component.getCells).toHaveBeenCalled();
    });
  });

  describe('solveSystem', () => {
    it('should call only solveSystemCramer method', () => {
      component.method = SolvingLinearSystemEnum.Cramer;
      spyOn(component, 'solveSystemCramer');
      spyOn(component, 'solveSystemGauss');
      spyOn(component, 'solveSystemInverse');
      component.solveSystem();

      expect(component.solveSystemCramer).toHaveBeenCalled();
      expect(component.solveSystemGauss).not.toHaveBeenCalled();
      expect(component.solveSystemInverse).not.toHaveBeenCalled();
    });

    it('should call only solveSystemGauss method', () => {
      component.method = SolvingLinearSystemEnum.Gauss;
      spyOn(component, 'solveSystemCramer');
      spyOn(component, 'solveSystemGauss');
      spyOn(component, 'solveSystemInverse');
      component.solveSystem();

      expect(component.solveSystemCramer).not.toHaveBeenCalled();
      expect(component.solveSystemGauss).toHaveBeenCalled();
      expect(component.solveSystemInverse).not.toHaveBeenCalled();
    });

    it('should call only solveSystemInverse method', () => {
      component.method = SolvingLinearSystemEnum.Inverse;
      spyOn(component, 'solveSystemCramer');
      spyOn(component, 'solveSystemGauss');
      spyOn(component, 'solveSystemInverse');
      component.solveSystem();

      expect(component.solveSystemCramer).not.toHaveBeenCalled();
      expect(component.solveSystemGauss).not.toHaveBeenCalled();
      expect(component.solveSystemInverse).toHaveBeenCalled();
    });

    it('should not call any methods', () => {
      component.method = null;
      spyOn(component, 'solveSystemCramer');
      spyOn(component, 'solveSystemGauss');
      spyOn(component, 'solveSystemInverse');
      component.solveSystem();

      expect(component.solveSystemInverse).not.toHaveBeenCalled();
      expect(component.solveSystemCramer).not.toHaveBeenCalled();
      expect(component.solveSystemGauss).not.toHaveBeenCalled();
    });
  });

  describe('getMainMatrix', () => {
    it('should return main matrix of system', () => {
      component.matrixForm.setValue(mockMatrixFormValue);
      const mockMatrix = new Matrix(2, 2);
      mockMatrix[0] = [1, 2];
      mockMatrix[1] = [4, 5];
      const matrix = component.getMainMatrix();

      expect(matrix).toEqual(mockMatrix);
    });
  });

  describe('getFreeColumn', () => {
    it('should return free column of system', () => {
      component.matrixForm.setValue(mockMatrixFormValue);
      const freeColumn = new Matrix(2, 1);
      freeColumn[0] = [3];
      freeColumn[1] = [9];
      const matrix = component.getFreeColumn();

      expect(matrix).toEqual(freeColumn);
    });
  });

  describe('getExpandMatrix', () => {
    it('should return expand matrix of system', () => {
      component.matrixForm.setValue(mockMatrixFormValue);
      const expandMatrix = new Matrix(2, 3);
      expandMatrix[0] = [1, 2, 3];
      expandMatrix[1] = [4, 5, 9];
      const matrix = component.getExpandMatrix();

      expect(matrix).toEqual(expandMatrix);
    });
  });

  describe('solveSystemCramer', () => {
    it('resultToString should contain string `Система несумісна`', () => {
      component.matrixForm.setValue(mockMatrixFormValue3);
      component.solveSystemCramer();

      expect(component.resultToString).toEqual(['Система несумісна']);
    });

    it(`resultToString should contain string "Система має безліч розв'язків і не може бути розв'язана методом Крамера"`, () => {
      component.matrixForm.setValue(mockMatrixFormValue2);
      component.solveSystemCramer();

      expect(component.resultToString).toEqual([
        `Система має безліч розв'язків і не може бути розв'язана методом Крамера`,
      ]);
    });

    it('resultToString should contain solutions of the system', () => {
      component.matrixForm.setValue(mockMatrixFormValue);
      component.solveSystemCramer();

      expect(component.resultToString).toEqual(['$x_{1}=1$', '$x_{2}=1$']);
    });
  });

  describe('solveSystemInverse', () => {
    it(`resultToString should contain string "Система не може бути розв'язана за допомогою оберненої матриці"`, () => {
      component.matrixForm.setValue(mockMatrixFormValue3);
      component.solveSystemInverse();

      expect(component.resultToString).toEqual([
        `Система не може бути розв'язана за допомогою оберненої матриці`,
      ]);
    });

    it('resultToString should contain solutions of the system', () => {
      component.matrixForm.setValue(mockMatrixFormValue);
      component.solveSystemInverse();

      expect(component.resultToString).toEqual(['$x_{1}=1$', '$x_{2}=1$']);
    });
  });

  describe('solveSystemGauss', () => {
    it('resultToString should contain solutions of the system when system has many solutions', () => {
      component.eqsNumber = 6;
      component.varsNumber = 8;
      const mainMatrix = new Matrix(6, 8);
      mainMatrix[0] = [1, 0, 1, 0, 0, 0, 0, 0];
      mainMatrix[1] = [0, 1, 0, 0, 0, 0, 0, 0];
      mainMatrix[2] = [0, 0, 0, 1, 0, 0, 0, -1];
      mainMatrix[3] = [0, 0, 0, 0, 1, 0, 0, -1];
      mainMatrix[4] = [0, 0, 0, 0, 0, 1, 0, -2];
      mainMatrix[5] = [0, 0, 0, 0, 0, 0, 1, 2];
      spyOn(component, 'getMainMatrix').and.returnValue(mainMatrix);
      const freeColumn = new Matrix(6, 1);
      freeColumn[0] = [0];
      freeColumn[1] = [0];
      freeColumn[2] = [0];
      freeColumn[3] = [2];
      freeColumn[4] = [1];
      freeColumn[5] = [0];
      spyOn(component, 'getFreeColumn').and.returnValue(freeColumn);
      const expandMatrix = new Matrix(6, 9);
      expandMatrix[0] = [1, 0, 1, 0, 0, 0, 0, 0, 0];
      expandMatrix[1] = [0, 1, 0, 0, 0, 0, 0, 0, 0];
      expandMatrix[2] = [0, 0, 0, 1, 0, 0, 0, -1, 0];
      expandMatrix[3] = [0, 0, 0, 0, 1, 0, 0, -1, 2];
      expandMatrix[4] = [0, 0, 0, 0, 0, 1, 0, -2, 1];
      expandMatrix[5] = [0, 0, 0, 0, 0, 0, 1, 2, 0];
      spyOn(component, 'getExpandMatrix').and.returnValue(expandMatrix);
      component.solveSystemGauss();

      expect(component.resultToString).toEqual([
        '$x_{1}=-x_{3}$',
        '$x_{2}=0$',
        '$x_{3}=x_{3}$',
        '$x_{4}=x_{8}$',
        '$x_{5}=2+x_{8}$',
        '$x_{6}=1+2x_{8}$',
        '$x_{7}=-2x_{8}$',
        '$x_{8}=x_{8}$',
      ]);
    });

    it('resultToString should contain solution of the system when system has one solution', () => {
      component.matrixForm.setValue(mockMatrixFormValue);
      component.solveSystemGauss();

      expect(component.resultToString).toEqual(['$x_{1}=1$', '$x_{2}=1$']);
    });

    it('resultToString should contain string `Система несумісна`', () => {
      component.matrixForm.setValue(mockMatrixFormValue3);
      component.solveSystemGauss();

      expect(component.resultToString).toEqual(['Система несумісна']);
    });
  });
});
