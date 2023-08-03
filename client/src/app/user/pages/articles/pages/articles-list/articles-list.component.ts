import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesFilterComponent } from './components/articles-filter/articles-filter.component';
import { ArticlesListParamsInterface } from '../../../../../shared/models/interfaces/articles-list-params.interface';
import { ArticlesListItemComponent } from './components/articles-list-item/articles-list-item.component';
import { ArticleInterface } from '../../../../../shared/models/interfaces/article.interface';
import { ArticlesService } from '../../../../../shared/services/articles.service';
import { Subject, takeUntil } from 'rxjs';
import {
  ArticlesListInterface
} from '../../../../../shared/models/interfaces/articles-list.interface';
import { TagsService } from '../../../../../shared/services/tags.service';

@Component({
  selector: 'app-articles-list',
  standalone: true,
  imports: [CommonModule, ArticlesFilterComponent, ArticlesListItemComponent],
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesListComponent implements OnInit, OnDestroy {
  public articlesList: ArticleInterface[] = [];

  public total: number = 0;

  public paginationParams: ArticlesListParamsInterface = {
    filter: '',
    tagsIds: [],
    page: 1,
    size: 10,
  };

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private articlesService: ArticlesService,
    private cdr: ChangeDetectorRef,
    private tagsService: TagsService,
  ) {}

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

  public changePaginationParams(event: ArticlesListParamsInterface) {
    this.paginationParams = event;
    this.articlesList = [];
    this.initArticlesList(this.paginationParams);
  }

  private initArticlesList(params: ArticlesListParamsInterface): void {
    this.articlesService
      .getArticlesList(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list: ArticlesListInterface) => {
          this.articlesList = [...this.articlesList, ...list.articles];
          this.total = list.total;
          this.cdr.detectChanges();
        },
      });
  }

  public loadMoreArticles() {
    this.paginationParams = {
      ...this.paginationParams,
      page: this.paginationParams.page + 1,
    };
    this.initArticlesList(this.paginationParams);
  }
}
