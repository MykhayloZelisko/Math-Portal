import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { SolvingTriangleFormComponent } from './components/solving-triangle-form/solving-triangle-form.component';
import { SolvingTriangleInterface } from '../../../../../shared/models/interfaces/solving-triangle.interface';
import { SOLVING_TRIANGLE } from '../../../../../shared/models/constants/solving-triangle';
import { TriangleInterface } from '../../../../../shared/models/interfaces/triangle.interface';
import { TriangleTaskConfigInterface } from '../../../../../shared/models/interfaces/triangle-task-config.interface';
import { Subject, takeUntil } from 'rxjs';
import { TriangleStringInterface } from '../../../../../shared/models/interfaces/triangle-string.interface';

@Component({
  selector: 'app-solving-triangle',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    ReactiveFormsModule,
    MathjaxModule,
    SolvingTriangleFormComponent,
  ],
  templateUrl: './solving-triangle.component.html',
  styleUrls: ['./solving-triangle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolvingTriangleComponent implements OnInit, OnDestroy {
  public solvingTriangleOptions: SolvingTriangleInterface[] = SOLVING_TRIANGLE;

  public triangleCtrl: FormControl = new FormControl();

  public triangles: TriangleInterface[] = [];

  public trianglesToString: TriangleStringInterface[] = [];

  public config!: TriangleTaskConfigInterface;

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.initTask();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initTask(): void {
    this.triangleCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        this.config = { type: value.value, labels: value.labels };
      },
    });
  }

  public saveResult(triangles: TriangleInterface[]): void {
    this.triangles = triangles;
    this.printResult();
  }

  public printResult(): void {
    this.trianglesToString = this.triangles.map(
      (triangle: TriangleInterface) => ({
        side_a: `$a=${triangle.side_a}$`,
        side_b: `$b=${triangle.side_b}$`,
        side_c: `$c=${triangle.side_c}$`,
        angle_a: `$\\alpha=${triangle.angle_a}$`,
        angle_b: `$\\beta=${triangle.angle_b}$`,
        angle_c: `$\\gamma=${triangle.angle_c}$`,
        bisector_a: `$l_a=${triangle.bisector_a}$`,
        bisector_b: `$l_b=${triangle.bisector_b}$`,
        bisector_c: `$l_c=${triangle.bisector_c}$`,
        altitude_a: `$h_a=${triangle.altitude_a}$`,
        altitude_b: `$h_b=${triangle.altitude_b}$`,
        altitude_c: `$h_c=${triangle.altitude_c}$`,
        median_a: `$m_a=${triangle.median_a}$`,
        median_b: `$m_b=${triangle.median_b}$`,
        median_c: `$m_c=${triangle.median_c}$`,
        radius_R: `$R=${triangle.radius_R}$`,
        radius_r: `$r=${triangle.radius_r}$`,
        radius_ra: `$r_a=${triangle.radius_ra}$`,
        radius_rb: `$r_b=${triangle.radius_rb}$`,
        radius_rc: `$r_c=${triangle.radius_rc}$`,
      }),
    );
  }
}
