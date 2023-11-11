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
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterOutlet } from '@angular/router';
import { AppNameEnum } from '../../../shared/models/enums/app-name.enum';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, DropdownModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsComponent implements OnInit, OnDestroy {
  public appNames: AppNameInterface[] = APP_NAMES;

  public appCtrl: FormControl = new FormControl();

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(private router: Router) {}

  public ngOnInit(): void {
    this.initApp();
    this.initRoute();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initApp(): void {
    this.appCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (app) => {
        switch (app.value) {
          case AppNameEnum.SolvingTriangle:
            this.router.navigateByUrl('/applications/triangle');
            break;
          case AppNameEnum.SystemLinearEquations:
            this.router.navigateByUrl('/applications/linear-system');
            break;
          default:
            this.router.navigateByUrl('/applications');
        }
      },
    });
  }

  public initRoute(): void {
    switch (this.router.url) {
      case '/applications/triangle':
        this.appCtrl.setValue(this.appNames[0]);
        break;
      case '/applications/linear-system':
        this.appCtrl.setValue(this.appNames[1]);
        break;
      default:
        break;
    }
  }
}
