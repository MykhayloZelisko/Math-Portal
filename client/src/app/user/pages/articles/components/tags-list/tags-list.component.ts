import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagInterface } from '../../../../../shared/models/interfaces/tag.interface';
import { Subject, takeUntil } from 'rxjs';
import { TagsService } from '../../../../../shared/services/tags.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tags-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsListComponent implements OnInit, OnDestroy {
  public tagsList: TagInterface[] = [];

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private tagsService: TagsService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.initTagsList();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initTagsList(): void {
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

  public addTag(tag: TagInterface) {
    this.tagsService.tag$.next(tag);
    this.checkRoute();
  }

  private checkRoute(): void {
    const urlLength = this.router.url.split('/').length;
    if (urlLength > 2) {
      this.router.navigateByUrl('articles');
    }
  }
}
