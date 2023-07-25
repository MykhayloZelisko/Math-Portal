import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInterface } from '../../../../../../../shared/models/interfaces/tag.interface';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TagsService } from '../../../../../../../shared/services/tags.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ArticlesListParamsInterface } from '../../../../../../../shared/models/interfaces/articles-list-params.interface';

const DEBOUNCE_TIME = 600;

@Component({
  selector: 'app-articles-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSvgIconModule,
  ],
  templateUrl: './articles-filter.component.html',
  styleUrls: ['./articles-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesFilterComponent implements OnInit, OnDestroy {
  @Output()
  public changeFilterParams: EventEmitter<ArticlesListParamsInterface> =
    new EventEmitter<ArticlesListParamsInterface>();

  public tagsList: TagInterface[] = [];

  public searchArticleCtrl: FormControl = new FormControl('');

  public filterParams: ArticlesListParamsInterface = {
    filter: '',
    tagsIds: [],
    // page: 1,
    // size: 10,
  };

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private tagsService: TagsService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.initTagsList();
    this.initSearchValue();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tagsService.tag$.next(null);
  }

  private initTagsList(): void {
    this.tagsService.tag$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (tag: TagInterface | null) => {
        if (tag) {
          const tagItem = this.tagsList.find((item: TagInterface) => item.id === tag.id);
          if (!tagItem) {
            this.tagsList.push(tag);
          }
          const tagsIds = this.tagsList.map(
            (tagItem: TagInterface) => tagItem.id,
          );
          this.filterParams = { ...this.filterParams, tagsIds };
          this.changeFilterParams.emit(this.filterParams);
        }
        this.cdr.detectChanges();
      },
    });
  }

  private initSearchValue(): void {
    this.searchArticleCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        debounceTime(DEBOUNCE_TIME),
      )
      .subscribe({
        next: (value) => {
          this.filterParams = { ...this.filterParams, filter: value };
          this.changeFilterParams.emit(this.filterParams);
        },
      });
  }

  public deleteTag(tag: TagInterface): void {
    this.tagsList = this.tagsList.filter(
      (tagItem: TagInterface) => tagItem.id !== tag.id,
    );
    const tagsIds = this.tagsList.map((tagItem: TagInterface) => tagItem.id);
    this.filterParams = { ...this.filterParams, tagsIds };
    this.changeFilterParams.emit(this.filterParams);
  }

  public clearFilters(): void {
    this.tagsList = [];
    this.searchArticleCtrl.setValue('');
    this.filterParams = {
      filter: '',
      tagsIds: [],
      // page: 1,
      // size: 10,
    };
    this.changeFilterParams.emit(this.filterParams);
  }
}
