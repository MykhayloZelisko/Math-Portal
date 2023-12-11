import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TriangleTaskConfigInterface } from '../../../../../../../shared/models/interfaces/triangle-task-config.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { SolvingTriangleEnum } from '../../../../../../../shared/models/enums/solving-triangle.enum';
import { Subject, takeUntil } from 'rxjs';
import { TriangleInterface } from '../../../../../../../shared/models/interfaces/triangle.interface';
import { ZERO_TRIANGLE } from '../../../../../../../shared/models/constants/zero-triangle';
import {
  altitudesSSS,
  bisectorsSSS,
  calcAngle,
  calcSide,
  mediansSSS,
  radiusSSS,
} from '../../../../../../../shared/utils/triangle';
import {
  roundN,
  sin,
} from '../../../../../../../shared/utils/number-functions';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-solving-triangle-form',
  standalone: true,
  imports: [ReactiveFormsModule, MathjaxModule, NgIf],
  templateUrl: './solving-triangle-form.component.html',
  styleUrl: './solving-triangle-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolvingTriangleFormComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() public taskConfig!: TriangleTaskConfigInterface;

  @Output() public triangleEvent: EventEmitter<TriangleInterface[]> =
    new EventEmitter<TriangleInterface[]>();

  public triangles: TriangleInterface[] = [];

  private fb = inject(FormBuilder);

  public triangleForm: FormGroup = this.fb.group({
    control_1: null,
    control_2: null,
    control_3: null,
  });

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.initTriangle();
    this.triangleEvent.emit([]);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['taskConfig'].currentValue !== changes['taskConfig'].previousValue
    ) {
      this.triangleForm.setValue({
        control_1: null,
        control_2: null,
        control_3: null,
      });
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public notNegative(event: Event): void {
    if (
      +(event.target as HTMLInputElement).value < 0 ||
      !(event.target as HTMLInputElement).value
    ) {
      (event.target as HTMLInputElement).value = '0';
    }
  }

  public countTriangle(a: number, b: number, c: number): number {
    switch (this.taskConfig.type) {
      case SolvingTriangleEnum.SideSideSide:
        return Number(a + b > c && a + c > b && b + c > a);
      case SolvingTriangleEnum.SideSideAngle:
        const d = (b / a) * sin(c);
        if (d > 1 || (d < 1 && a <= b && c >= 0.5 * Math.PI) || !(a * b * c)) {
          return 0;
        } else if (
          d === 1 ||
          (d < 1 && a === b && c < 0.5 * Math.PI) ||
          (d < 1 && a > b)
        ) {
          return 1;
        } else {
          return 2;
        }
      case SolvingTriangleEnum.SideAngleSide:
        return Number(!!(a * b * c));
      case SolvingTriangleEnum.SideAngleAngle:
      case SolvingTriangleEnum.AngleSideAngle:
        return Number(!!(a * b * c) && b + c < Math.PI);
      case SolvingTriangleEnum.SideAltitudeSide:
        if (!(a * b * c) || c > a || c > b || (a === c && b === c)) {
          return 0;
        } else if (a === b || a === c || b === c) {
          return 1;
        } else {
          return 2;
        }
      case SolvingTriangleEnum.SideSideAltitude:
        if (!(a * b * c) || c > b) {
          return 0;
        } else if (b === c) {
          return 1;
        } else {
          return 2;
        }
      case SolvingTriangleEnum.SideMedianSide:
        return Number(a + b > 2 * c && a + 2 * c > b && b + 2 * c > a);
      case SolvingTriangleEnum.SideSideMedian:
        return Number(
          a + 2 * b > 2 * c && a + 2 * c > 2 * b && 2 * b + 2 * c > a,
        );
      case SolvingTriangleEnum.SideBisectorSide:
        return Number(c * (a + b) < 2 * a * b);
      default:
        return 0;
    }
  }

  public initTriangle(): void {
    this.triangleForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        const triangleNumber = this.countTriangle(
          value.control_1,
          value.control_2,
          value.control_3,
        );
        this.triangles = [];
        if (triangleNumber) {
          switch (this.taskConfig.type) {
            case SolvingTriangleEnum.SideSideSide:
              this.triangles = [{ ...ZERO_TRIANGLE }];
              this.triangles[0].side_a = value.control_1 ?? 0;
              this.triangles[0].side_b = value.control_2 ?? 0;
              this.triangles[0].side_c = value.control_3 ?? 0;
              break;
            case SolvingTriangleEnum.SideSideAngle:
              for (let i = 0; i < triangleNumber; i++) {
                this.triangles.push({ ...ZERO_TRIANGLE });
                this.triangles[i].side_a = value.control_1 ?? 0;
                this.triangles[i].side_b = value.control_2 ?? 0;
                this.triangles[i].angle_a = value.control_3 ?? 0;
              }
              break;
            case SolvingTriangleEnum.SideAngleSide:
              this.triangles = [{ ...ZERO_TRIANGLE }];
              this.triangles[0].side_a = value.control_1 ?? 0;
              this.triangles[0].side_b = value.control_2 ?? 0;
              this.triangles[0].angle_c = value.control_3 ?? 0;
              break;
            case SolvingTriangleEnum.SideAngleAngle:
              this.triangles = [{ ...ZERO_TRIANGLE }];
              this.triangles[0].side_a = value.control_1 ?? 0;
              this.triangles[0].angle_a = value.control_2 ?? 0;
              this.triangles[0].angle_b = value.control_3 ?? 0;
              break;
            case SolvingTriangleEnum.AngleSideAngle:
              this.triangles = [{ ...ZERO_TRIANGLE }];
              this.triangles[0].side_a = value.control_1 ?? 0;
              this.triangles[0].angle_b = value.control_2 ?? 0;
              this.triangles[0].angle_c = value.control_3 ?? 0;
              break;
            case SolvingTriangleEnum.SideAltitudeSide:
              for (let i = 0; i < triangleNumber; i++) {
                this.triangles.push({ ...ZERO_TRIANGLE });
                this.triangles[i].side_a = value.control_1 ?? 0;
                this.triangles[i].side_b = value.control_2 ?? 0;
                this.triangles[i].altitude_c = value.control_3 ?? 0;
              }
              break;
            case SolvingTriangleEnum.SideSideAltitude:
              for (let i = 0; i < triangleNumber; i++) {
                this.triangles.push({ ...ZERO_TRIANGLE });
                this.triangles[i].side_a = value.control_1 ?? 0;
                this.triangles[i].side_b = value.control_2 ?? 0;
                this.triangles[i].altitude_a = value.control_3 ?? 0;
              }
              break;
            case SolvingTriangleEnum.SideMedianSide:
              this.triangles = [{ ...ZERO_TRIANGLE }];
              this.triangles[0].side_a = value.control_1 ?? 0;
              this.triangles[0].side_b = value.control_2 ?? 0;
              this.triangles[0].median_c = value.control_3 ?? 0;
              break;
            case SolvingTriangleEnum.SideSideMedian:
              this.triangles = [{ ...ZERO_TRIANGLE }];
              this.triangles[0].side_a = value.control_1 ?? 0;
              this.triangles[0].side_b = value.control_2 ?? 0;
              this.triangles[0].median_a = value.control_3 ?? 0;
              break;
            case SolvingTriangleEnum.SideBisectorSide:
              this.triangles = [{ ...ZERO_TRIANGLE }];
              this.triangles[0].side_a = value.control_1 ?? 0;
              this.triangles[0].side_b = value.control_2 ?? 0;
              this.triangles[0].bisector_c = value.control_3 ?? 0;
              break;
            default:
              this.triangles = [];
          }
        } else {
          this.triangles = [];
        }
        const zeroTriangles: TriangleInterface[] = [];
        this.triangles.forEach(() => {
          zeroTriangles.push(ZERO_TRIANGLE);
        });
        this.triangleEvent.emit([...zeroTriangles]);
      },
    });
  }

  public calculate(): void {
    switch (this.taskConfig.type) {
      case SolvingTriangleEnum.SideSideSide:
        this.calculateSSS();
        break;
      case SolvingTriangleEnum.SideSideAngle:
        this.calculateSSA();
        break;
      case SolvingTriangleEnum.SideAngleSide:
        this.calculateSAS();
        break;
      case SolvingTriangleEnum.SideAngleAngle:
        this.calculateSAA();
        break;
      case SolvingTriangleEnum.AngleSideAngle:
        this.calculateASA();
        break;
      case SolvingTriangleEnum.SideAltitudeSide:
        this.calculateSHS();
        break;
      case SolvingTriangleEnum.SideSideAltitude:
        this.calculateSSH();
        break;
      case SolvingTriangleEnum.SideMedianSide:
        this.calculateSMS();
        break;
      case SolvingTriangleEnum.SideSideMedian:
        this.calculateSSM();
        break;
      case SolvingTriangleEnum.SideBisectorSide:
        this.calculateSBS();
        break;
      default:
        break;
    }
    this.showResult();
  }

  public calculateSSS(): void {
    calcAngle(this.triangles[0], { angle: 'a', calculate: 'cos' });
    calcAngle(this.triangles[0], { angle: 'b', calculate: 'cos' });
    calcAngle(this.triangles[0], { angle: 'c', calculate: 'sum' });
    altitudesSSS(this.triangles[0], true, true, true);
    mediansSSS(this.triangles[0], true, true, true);
    bisectorsSSS(this.triangles[0], true, true, true);
    radiusSSS(this.triangles[0], true, true, true, true, true);
  }

  public calculateSSA(): void {
    calcAngle(this.triangles[0], { angle: 'b', calculate: 'sinAB' });
    if (this.triangles.length === 2) {
      this.triangles[1].angle_b = Math.PI - this.triangles[0].angle_b;
    }
    for (let i = 0; i < this.triangles.length; i++) {
      calcAngle(this.triangles[i], { angle: 'c', calculate: 'sum' });
      calcSide(this.triangles[i], { side: 'c', calculate: 'sinAC' });
      altitudesSSS(this.triangles[i], true, true, true);
      mediansSSS(this.triangles[i], true, true, true);
      bisectorsSSS(this.triangles[i], true, true, true);
      radiusSSS(this.triangles[i], true, true, true, true, true);
    }
  }

  public calculateSAS(): void {
    calcSide(this.triangles[0], { side: 'c', calculate: 'cos' });
    calcAngle(this.triangles[0], { angle: 'a', calculate: 'cos' });
    calcAngle(this.triangles[0], { angle: 'b', calculate: 'sum' });
    altitudesSSS(this.triangles[0], true, true, true);
    bisectorsSSS(this.triangles[0], true, true, true);
    mediansSSS(this.triangles[0], true, true, true);
    radiusSSS(this.triangles[0], true, true, true, true, true);
  }

  public calculateSAA(): void {
    calcAngle(this.triangles[0], { angle: 'c', calculate: 'sum' });
    calcSide(this.triangles[0], { side: 'b', calculate: 'sinAB' });
    calcSide(this.triangles[0], { side: 'c', calculate: 'sinAC' });
    bisectorsSSS(this.triangles[0], true, true, true);
    altitudesSSS(this.triangles[0], true, true, true);
    mediansSSS(this.triangles[0], true, true, true);
    radiusSSS(this.triangles[0], true, true, true, true, true);
  }

  public calculateASA(): void {
    calcAngle(this.triangles[0], { angle: 'a', calculate: 'sum' });
    calcSide(this.triangles[0], { side: 'b', calculate: 'sinAB' });
    calcSide(this.triangles[0], { side: 'c', calculate: 'sinAC' });
    altitudesSSS(this.triangles[0], true, true, true);
    mediansSSS(this.triangles[0], true, true, true);
    radiusSSS(this.triangles[0], true, true, true, true, true);
    bisectorsSSS(this.triangles[0], true, true, true);
  }

  public calculateSHS(): void {
    if (this.triangles.length === 1) {
      if (this.triangles[0].side_a === this.triangles[0].side_b) {
        calcAngle(this.triangles[0], { angle: 'a', calculate: 'BH' });
        this.triangles[0].angle_b = this.triangles[0].angle_a;
      }
      if (this.triangles[0].side_a === this.triangles[0].altitude_c) {
        this.triangles[0].angle_b = Math.PI / 2;
        calcAngle(this.triangles[0], { angle: 'a', calculate: 'BH' });
      }
      if (this.triangles[0].side_b === this.triangles[0].altitude_c) {
        this.triangles[0].angle_a = Math.PI / 2;
        calcAngle(this.triangles[0], { angle: 'b', calculate: 'AH' });
      }
    } else {
      calcAngle(this.triangles[0], { angle: 'a', calculate: 'BH' });
      calcAngle(this.triangles[0], { angle: 'b', calculate: 'AH' });
      if (this.triangles[0].side_a > this.triangles[0].side_b) {
        this.triangles[1].angle_a = Math.PI - this.triangles[0].angle_a;
        this.triangles[1].angle_b = this.triangles[0].angle_b;
      }
      if (this.triangles[0].side_a < this.triangles[0].side_b) {
        this.triangles[1].angle_a = this.triangles[0].angle_a;
        this.triangles[1].angle_b = Math.PI - this.triangles[0].angle_b;
      }
    }
    for (let i = 0; i < this.triangles.length; i++) {
      calcAngle(this.triangles[i], { angle: 'c', calculate: 'sum' });
      calcSide(this.triangles[i], { side: 'c', calculate: 'sinAC' });
      altitudesSSS(this.triangles[i], true, true, false);
      mediansSSS(this.triangles[i], true, true, true);
      bisectorsSSS(this.triangles[i], true, true, true);
      radiusSSS(this.triangles[i], true, true, true, true, true);
    }
  }

  public calculateSSH(): void {
    calcAngle(this.triangles[0], { angle: 'c', calculate: 'BH' });
    if (this.triangles.length === 2) {
      this.triangles[1].angle_c = Math.PI - this.triangles[0].angle_c;
    }
    for (let i = 0; i < this.triangles.length; i++) {
      calcSide(this.triangles[i], { side: 'c', calculate: 'cos' });
      calcAngle(this.triangles[i], { angle: 'a', calculate: 'cos' });
      calcAngle(this.triangles[i], { angle: 'b', calculate: 'sum' });
      altitudesSSS(this.triangles[i], false, true, true);
      mediansSSS(this.triangles[i], true, true, true);
      bisectorsSSS(this.triangles[i], true, true, true);
      radiusSSS(this.triangles[i], true, true, true, true, true);
    }
  }

  public calculateSMS(): void {
    calcSide(this.triangles[0], { side: 'c', calculate: 'SMS' });
    calcAngle(this.triangles[0], { angle: 'a', calculate: 'cos' });
    calcAngle(this.triangles[0], { angle: 'b', calculate: 'cos' });
    calcAngle(this.triangles[0], { angle: 'c', calculate: 'sum' });
    altitudesSSS(this.triangles[0], true, true, true);
    mediansSSS(this.triangles[0], true, true, false);
    bisectorsSSS(this.triangles[0], true, true, true);
    radiusSSS(this.triangles[0], true, true, true, true, true);
  }

  public calculateSSM(): void {
    calcSide(this.triangles[0], { side: 'c', calculate: 'SSMA' });
    calcAngle(this.triangles[0], { angle: 'a', calculate: 'cos' });
    calcAngle(this.triangles[0], { angle: 'b', calculate: 'cos' });
    calcAngle(this.triangles[0], { angle: 'c', calculate: 'sum' });
    altitudesSSS(this.triangles[0], true, true, true);
    mediansSSS(this.triangles[0], false, true, true);
    bisectorsSSS(this.triangles[0], true, true, true);
    radiusSSS(this.triangles[0], true, true, true, true, true);
  }

  public calculateSBS(): void {
    calcAngle(this.triangles[0], { angle: 'c', calculate: 'SBS' });
    calcSide(this.triangles[0], { side: 'c', calculate: 'cos' });
    calcAngle(this.triangles[0], { angle: 'a', calculate: 'cos' });
    calcAngle(this.triangles[0], { angle: 'b', calculate: 'sum' });
    bisectorsSSS(this.triangles[0], true, true, false);
    altitudesSSS(this.triangles[0], true, true, true);
    mediansSSS(this.triangles[0], true, true, true);
    radiusSSS(this.triangles[0], true, true, true, true, true);
  }

  public showResult(): void {
    this.triangles = this.triangles.map((triangle: TriangleInterface) => {
      (Object.keys(triangle) as Array<keyof TriangleInterface>).forEach(
        (key: keyof TriangleInterface) => {
          triangle[key] = roundN(triangle[key], 10);
        },
      );
      return { ...triangle };
    });
    this.triangleEvent.emit([...this.triangles]);
  }
}
