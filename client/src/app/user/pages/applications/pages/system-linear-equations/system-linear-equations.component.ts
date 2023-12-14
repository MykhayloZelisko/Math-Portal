import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DropdownModule } from 'primeng/dropdown';
import { SolvingLinearSystemInterface } from '../../../../../shared/models/interfaces/solving-linear-system.interface';
import { SOLVING_LINEAR_SYSTEM } from '../../../../../shared/models/constants/solving-linear-system';
import { SolvingLinearSystemEnum } from '../../../../../shared/models/enums/solving-linear-system.enum';
import { Subject, takeUntil } from 'rxjs';
import { Matrix } from '../../../../../shared/models/classes/matrix';
import { MathjaxModule } from 'mathjax-angular';
import { VarStatusEnum } from '../../../../../shared/models/enums/var-status.enum';
import { NgForOf, NgIf } from '@angular/common';

const MIN_NUMBER = 2;
const MAX_NUMBER = 10;

@Component({
  selector: 'app-system-linear-equations',
  standalone: true,
  imports: [
    InputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSvgIconModule,
    DropdownModule,
    MathjaxModule,
    NgForOf,
    NgIf,
  ],
  templateUrl: './system-linear-equations.component.html',
  styleUrl: './system-linear-equations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemLinearEquationsComponent implements OnInit, OnDestroy {
  public readonly startNumber = MIN_NUMBER;

  public readonly endNumber = MAX_NUMBER;

  public varsNumber: number = MIN_NUMBER;

  public eqsNumber: number = MIN_NUMBER;

  public method!: SolvingLinearSystemEnum | null;

  public matrixForm!: FormGroup;

  public paramsForm!: FormGroup;

  public resultToString: string[] = [];

  public methodCtrl: FormControl = new FormControl();

  public solvingLinearSystemOptions: SolvingLinearSystemInterface[] =
    SOLVING_LINEAR_SYSTEM;

  private destroy$: Subject<void> = new Subject<void>();

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.initParamsForm();
    this.initMatrixForm();
    this.initMethod();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initMethod(): void {
    this.methodCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        this.method = value;
        this.resultToString = [];
      },
    });
  }

  public initMatrixForm(): void {
    this.matrixForm = this.fb.group({
      rows: this.fb.array([]),
    });
    for (let i = 0; i < this.eqsNumber; i++) {
      this.addRow();
    }
  }

  public initParamsForm(): void {
    this.paramsForm = this.fb.group({
      eqsNumber: MIN_NUMBER,
      varsNumber: MIN_NUMBER,
    });
    this.initSystem();
  }

  public initSystem(): void {
    this.paramsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        if (
          this.varsNumber !== value.varsNumber ||
          this.eqsNumber !== value.eqsNumber
        ) {
          if (value.varsNumber === value.eqsNumber) {
            this.solvingLinearSystemOptions =
              this.solvingLinearSystemOptions.map(
                (option: SolvingLinearSystemInterface) => ({
                  ...option,
                  disable: false,
                }),
              );
          } else {
            this.solvingLinearSystemOptions =
              this.solvingLinearSystemOptions.map(
                (option: SolvingLinearSystemInterface) => ({
                  ...option,
                  disable: option.method !== SolvingLinearSystemEnum.Gauss,
                }),
              );
          }
          this.methodCtrl.setValue(null);
        } else {
          this.method = value.method;
        }
        this.varsNumber = value.varsNumber;
        this.eqsNumber = value.eqsNumber;
      },
    });
  }

  public notNull(event: Event): void {
    if (!(event.target as HTMLInputElement).value) {
      (event.target as HTMLInputElement).value = '0';
    }
  }

  public forbidInput(event: KeyboardEvent): boolean {
    event.preventDefault();
    return false;
  }

  public addEquation(): void {
    this.resultToString = [];
    this.paramsForm.controls['eqsNumber'].setValue(
      this.paramsForm.controls['eqsNumber'].value + 1,
    );
    this.addRow();
  }

  public removeEquation(): void {
    this.resultToString = [];
    this.paramsForm.controls['eqsNumber'].setValue(
      this.paramsForm.controls['eqsNumber'].value - 1,
    );
    this.removeRow(this.eqsNumber);
  }

  public addVariable(): void {
    this.resultToString = [];
    this.paramsForm.controls['varsNumber'].setValue(
      this.paramsForm.controls['varsNumber'].value + 1,
    );
    for (let i = 0; i < this.eqsNumber; i++) {
      this.addCell(i);
    }
  }

  public removeVariable(): void {
    this.resultToString = [];
    this.paramsForm.controls['varsNumber'].setValue(
      this.paramsForm.controls['varsNumber'].value - 1,
    );
    for (let i = 0; i < this.eqsNumber; i++) {
      this.removeCell(i, this.varsNumber);
    }
  }

  public getRows(): FormArray {
    return this.matrixForm.get('rows') as FormArray;
  }

  public newRow(): FormGroup {
    return this.fb.group({
      cells: this.fb.array([]),
      free: 0,
    });
  }

  public addRow(): void {
    this.getRows().push(this.newRow());
    for (let i = 0; i < this.varsNumber; i++) {
      this.addCell(this.getRows().length - 1);
    }
  }

  public removeRow(rowIndex: number): void {
    this.getRows().removeAt(rowIndex);
  }

  public getCells(rowIndex: number): FormArray {
    return this.getRows().at(rowIndex).get('cells') as FormArray;
  }

  public newCell(): FormGroup {
    return this.fb.group({
      coef: 0,
    });
  }

  public addCell(rowIndex: number): void {
    this.getCells(rowIndex).push(this.newCell());
  }

  public removeCell(rowIndex: number, cellIndex: number): void {
    this.getCells(rowIndex).removeAt(cellIndex);
  }

  public solveSystem(): void {
    this.resultToString = [];
    switch (this.method) {
      case SolvingLinearSystemEnum.Cramer:
        this.solveSystemCramer();
        break;
      case SolvingLinearSystemEnum.Gauss:
        this.solveSystemGauss();
        break;
      case SolvingLinearSystemEnum.Inverse:
        this.solveSystemInverse();
        break;
      default:
        break;
    }
  }

  public solveSystemCramer(): void {
    const mainMatrix = this.getMainMatrix();
    const freeColumn = this.getFreeColumn();
    const arrayOfDets = [];
    let squaresSum = 0;
    const mainDet = mainMatrix.det();
    for (let i = 0; i < this.varsNumber; i++) {
      const det = mainMatrix.replaceColumn(i, freeColumn).det();
      arrayOfDets.push(det);
      squaresSum += det ** 2;
    }
    if (!mainDet) {
      if (squaresSum) {
        this.resultToString.push('Система несумісна');
      } else {
        this.resultToString.push(
          `Система має безліч розв'язків і не може бути розв'язана методом Крамера`,
        );
      }
    } else {
      for (let i = 0; i < this.varsNumber; i++) {
        this.resultToString.push(`$x_{${i + 1}}=${arrayOfDets[i] / mainDet}$`);
      }
    }
  }

  public solveSystemInverse(): void {
    const mainMatrix = this.getMainMatrix();
    const freeColumn = this.getFreeColumn();
    const mainDet = mainMatrix.det();
    if (!mainDet) {
      this.resultToString.push(
        `Система не може бути розв'язана за допомогою оберненої матриці`,
      );
    } else {
      const result = Matrix.product(mainMatrix.inverse(), freeColumn);
      for (let i = 0; i < this.varsNumber; i++) {
        this.resultToString.push(`$x_{${i + 1}}=${result[i][0]}$`);
      }
    }
  }

  public solveSystemGauss(): void {
    const mainMatrix = this.getMainMatrix();
    let expandMatrix = this.getExpandMatrix();
    const rang = expandMatrix.rang();
    if (mainMatrix.rang() !== rang) {
      this.resultToString.push(`Система несумісна`);
    } else {
      expandMatrix = expandMatrix.echelon();
      const varsStatusArray = [];
      for (let i = 0; i < this.varsNumber; i++) {
        varsStatusArray.push(VarStatusEnum.Free);
      }
      for (let i = 0; i < rang; i++) {
        const index = expandMatrix[i].findIndex((item: number) => !!item);
        varsStatusArray[index] = VarStatusEnum.NotFree;
      }
      const freeVarsIndexes: number[] = [];
      const notFreeVarsIndexes: number[] = [];
      varsStatusArray.forEach((item: VarStatusEnum, index: number) => {
        if (item === VarStatusEnum.NotFree) {
          notFreeVarsIndexes.push(index);
        } else {
          freeVarsIndexes.push(index);
        }
      });
      const varsOrder = [
        ...notFreeVarsIndexes,
        this.varsNumber,
        ...freeVarsIndexes,
      ];
      expandMatrix = expandMatrix.columnsTransposition(...varsOrder);
      for (let i = rang - 1; i >= 0; i--) {
        let row = expandMatrix.getRow(i);
        let lambda = 1 / expandMatrix[i][i];
        row = row.lambda(lambda);
        expandMatrix = expandMatrix.replaceRow(i, row);
        for (let j = 0; j < i; j++) {
          lambda = -expandMatrix[j][i];
          expandMatrix = expandMatrix.rowsLinearCombination(j, lambda, i);
        }
      }
      for (const index of freeVarsIndexes) {
        this.resultToString[index] = `$x_{${index + 1}}=x_{${index + 1}}$`;
      }
      for (let i = 0; i < notFreeVarsIndexes.length; i++) {
        const index = notFreeVarsIndexes[i];
        this.resultToString[index] = `$x_{${index + 1}}=`;
        let rest = '';
        if (expandMatrix[i][rang]) {
          rest += `${expandMatrix[i][rang]}`;
        }
        for (let j = rang + 1; j < expandMatrix.size[1]; j++) {
          if (expandMatrix[i][j] === 1) {
            rest += `-x_{${varsOrder[j] + 1}}`;
          } else if (expandMatrix[i][j] === -1) {
            if (rest) {
              rest += `+x_{${varsOrder[j] + 1}}`;
            } else {
              rest += `x_{${varsOrder[j] + 1}}`;
            }
          } else if (expandMatrix[i][j] > 0) {
            rest += `-${expandMatrix[i][j]}x_{${varsOrder[j] + 1}}`;
          } else if (expandMatrix[i][j] < 0) {
            rest += `+${-expandMatrix[i][j]}x_{${varsOrder[j] + 1}}`;
          }
        }
        if (!rest.length) {
          rest = '0';
        }
        this.resultToString[index] += `${rest}$`;
      }
    }
  }

  public getMainMatrix(): Matrix {
    const mainMatrix = new Matrix(this.eqsNumber, this.varsNumber);
    for (let i = 0; i < this.eqsNumber; i++) {
      for (let j = 0; j < this.varsNumber; j++) {
        mainMatrix[i][j] = this.matrixForm.getRawValue().rows[i].cells[j].coef;
      }
    }
    return mainMatrix;
  }

  public getFreeColumn(): Matrix {
    const freeColumn = new Matrix(this.eqsNumber, 1);
    for (let i = 0; i < this.eqsNumber; i++) {
      freeColumn[i][0] = this.matrixForm.getRawValue().rows[i].free;
    }
    return freeColumn;
  }

  public getExpandMatrix(): Matrix {
    const expandMatrix = new Matrix(this.eqsNumber, this.varsNumber + 1);
    for (let i = 0; i < this.eqsNumber; i++) {
      for (let j = 0; j < this.varsNumber; j++) {
        expandMatrix[i][j] =
          this.matrixForm.getRawValue().rows[i].cells[j].coef;
      }
    }
    const freeColumn = this.getFreeColumn();
    return expandMatrix.replaceColumn(this.varsNumber, freeColumn);
  }
}
