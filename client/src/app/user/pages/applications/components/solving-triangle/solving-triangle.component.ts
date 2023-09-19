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

  public config!: TriangleTaskConfigInterface;

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.initTask();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initTask(): void {
    this.triangleCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        this.config = { type: value.value, labels: value.labels };
      },
    });
  }

  public saveResult(triangles: TriangleInterface[]): void {
    this.triangles = triangles;
  }
}
