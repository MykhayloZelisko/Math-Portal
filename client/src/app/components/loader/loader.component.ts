import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from '../../shared/services/loader.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent implements OnInit, OnDestroy {
  public isLoading$!: Subject<boolean>;

  private destroy$: Subject<void> = new Subject<void>();

  private loaderService = inject(LoaderService);

  public ngOnInit(): void {
    this.isLoading$ = this.loaderService.isLoading$;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
