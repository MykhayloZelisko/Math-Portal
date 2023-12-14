import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ArticlesFilterComponent } from './components/articles-filter/articles-filter.component';
import { ArticlesListParamsInterface } from '../../../../../shared/models/interfaces/articles-list-params.interface';
import { ArticlesListItemComponent } from './components/articles-list-item/articles-list-item.component';
import { ArticleInterface } from '../../../../../shared/models/interfaces/article.interface';
import { ArticlesService } from '../../../../../shared/services/articles.service';
import { Subject, takeUntil } from 'rxjs';
import { ArticlesListInterface } from '../../../../../shared/models/interfaces/articles-list.interface';
import { TagsService } from '../../../../../shared/services/tags.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-articles-list',
  standalone: true,
  imports: [ArticlesFilterComponent, ArticlesListItemComponent, NgForOf, NgIf],
  templateUrl: './articles-list.component.html',
  styleUrl: './articles-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesListComponent implements OnInit, OnDestroy {
  public articlesList: ArticleInterface[] = [];

  public isButtonVisible = false;

  public paginationParams: ArticlesListParamsInterface = {
    filter: '',
    tagsIds: [],
    page: 1,
    size: 10,
  };

  private destroy$: Subject<void> = new Subject<void>();

  private articlesService = inject(ArticlesService);

  private cdr = inject(ChangeDetectorRef);

  private tagsService = inject(TagsService);

  public ngOnInit(): void {
    const tag = this.tagsService.tag$.getValue();
    if (!tag) {
      this.initArticlesList(this.paginationParams);
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public changePaginationParams(event: ArticlesListParamsInterface): void {
    this.paginationParams = event;
    this.articlesList = [];
    this.initArticlesList(this.paginationParams);
  }

  public initArticlesList(params: ArticlesListParamsInterface): void {
    this.isButtonVisible = false;
    this.articlesService
      .getArticlesList(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list: ArticlesListInterface) => {
          this.articlesList = [...this.articlesList, ...list.articles];
          this.isButtonVisible = list.total
            ? list.total !== this.articlesList.length
            : false;
          this.cdr.detectChanges();
        },
      });
  }

  public loadMoreArticles(): void {
    this.paginationParams = {
      ...this.paginationParams,
      page: this.paginationParams.page + 1,
    };
    this.initArticlesList(this.paginationParams);
  }
}
