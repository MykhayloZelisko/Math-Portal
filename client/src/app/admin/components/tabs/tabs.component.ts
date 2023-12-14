import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgFor } from '@angular/common';
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
  imports: [RouterLink, NgFor, MatTabsModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements OnInit, OnDestroy {
  @Input() public tabs: TabItemInterface[] = [];

  public activeRoute!: AdminRouteNameEnum;

  private destroy$: Subject<void> = new Subject<void>();

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private changeDetector = inject(ChangeDetectorRef);

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

  public setActiveRoute(): void {
    this.activeRoute = this.activatedRoute.children[0]?.snapshot.data['path'];
    this.changeDetector.detectChanges();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
