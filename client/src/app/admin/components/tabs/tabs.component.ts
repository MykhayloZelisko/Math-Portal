import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { TabItemInterface } from '../../../shared/models/interfaces/tab-item.interface';
import { AdminRouteNameEnum } from '../../../shared/models/enums/admin-route-name.enum';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, RouterLink, NgFor, NgClass, MatTabsModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  @Input() public tabs: TabItemInterface[] = [];

  public activeRoute!: AdminRouteNameEnum;

  public constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.setActiveRoute();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.setActiveRoute();
      });
  }

  public setActiveRoute() {
    this.activeRoute = this.activatedRoute.children[0]?.snapshot.data['path'];
    this.changeDetector.detectChanges();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
