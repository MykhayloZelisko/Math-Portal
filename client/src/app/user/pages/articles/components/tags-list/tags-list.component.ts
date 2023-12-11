import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TagInterface } from '../../../../../shared/models/interfaces/tag.interface';
import { Subject, takeUntil } from 'rxjs';
import { TagsService } from '../../../../../shared/services/tags.service';
import { Router } from '@angular/router';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-tags-list',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsListComponent implements OnInit, OnDestroy {
  public tagsList: TagInterface[] = [];

  private destroy$: Subject<void> = new Subject<void>();

  private tagsService = inject(TagsService);

  private cdr = inject(ChangeDetectorRef);

  private router = inject(Router);

  public ngOnInit(): void {
    this.initTagsList();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initTagsList(): void {
    this.tagsService
      .getAllTags()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list: TagInterface[]) => {
          this.tagsList = list;
          this.cdr.detectChanges();
        },
      });
  }

  public addTag(tag: TagInterface): void {
    this.tagsService.tag$.next(tag);
    this.checkRoute();
  }

  public checkRoute(): void {
    const urlLength = this.router.url.split('/').length;
    if (urlLength > 2) {
      this.router.navigateByUrl('articles');
    }
  }
}
