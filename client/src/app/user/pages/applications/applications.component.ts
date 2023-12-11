import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  imports: [DropdownModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsComponent implements OnInit, OnDestroy {
  public appNames: AppNameInterface[] = APP_NAMES;

  public appCtrl: FormControl = new FormControl();

  private destroy$: Subject<void> = new Subject<void>();

  private router = inject(Router);

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
