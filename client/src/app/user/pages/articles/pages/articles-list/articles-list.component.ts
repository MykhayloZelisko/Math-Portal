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

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private articlesService: ArticlesService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.initArticlesList(this.paginationParams);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public paginationParams: ArticlesListParamsInterface = {
    filter: '',
    tagsIds: [],
    // page: 1,
    // size: 10,
  };

  public changePaginationParams(event: ArticlesListParamsInterface) {
    this.paginationParams = event;
    this.initArticlesList(this.paginationParams);
  }

  private initArticlesList(params: ArticlesListParamsInterface): void {
    this.articlesService
      .getArticlesList(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list: ArticleInterface[]) => {
          this.articlesList = list;
          this.cdr.detectChanges();
        },
      });
  }
}
