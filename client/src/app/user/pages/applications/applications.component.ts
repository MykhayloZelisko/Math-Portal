import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppNameInterface } from '../../../shared/models/interfaces/app-name.interface';
import { APP_NAMES } from '../../../shared/models/constants/app-names';
import { DropdownModule } from 'primeng/dropdown';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppNameEnum } from '../../../shared/models/enums/app-name.enum';
import { Subject, takeUntil } from 'rxjs';
import { SolvingTriangleComponent } from './components/solving-triangle/solving-triangle.component';
import { SystemLinearEquationsComponent } from './components/system-linear-equations/system-linear-equations.component';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    ReactiveFormsModule,
    SolvingTriangleComponent,
    SystemLinearEquationsComponent,
  ],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsComponent implements OnInit, OnDestroy {
  public appNames: AppNameInterface[] = APP_NAMES;

  public appName!: AppNameEnum;

  public appTitle: string = '';

  public appNameEnum = AppNameEnum;

  public appCtrl: FormControl = new FormControl();

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.initApp();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initApp(): void {
    this.appCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (app) => {
        this.appName = app.value;
        this.appTitle = app.title;
      },
    });
  }
}
