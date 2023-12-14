import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ArticlesService } from '../../../../../shared/services/articles.service';
import { ArticleInterface } from '../../../../../shared/models/interfaces/article.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { MathjaxModule } from 'mathjax-angular';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TagInterface } from '../../../../../shared/models/interfaces/tag.interface';
import { TagsService } from '../../../../../shared/services/tags.service';
import { RatingComponent } from './components/rating/rating.component';
import { RatingService } from '../../../../../shared/services/rating.service';
import { RatingType } from '../../../../../shared/models/types/rating.type';
import { CurrentArticleRatingInterface } from '../../../../../shared/models/interfaces/current-article-rating.interface';
import { UsersService } from '../../../../../shared/services/users.service';
import { UserInterface } from '../../../../../shared/models/interfaces/user.interface';
import { DialogService } from '../../../../../shared/services/dialog.service';
import { DialogTypeEnum } from '../../../../../shared/models/enums/dialog-type.enum';
import { ArticleTagsComponent } from '../../../../../shared/components/article-tags/article-tags.component';
import { ArticleTitleComponent } from '../../../../../shared/components/article-title/article-title.component';
import { ArticleContentComponent } from '../../../../../shared/components/article-content/article-content.component';
import { CreateArticleInterface } from '../../../../../shared/models/interfaces/create-article.interface';
import { CommentsComponent } from './components/comments/comments.component';
import { CurrentArticleStatusInterface } from '../../../../../shared/models/interfaces/current-article-status.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { PageNotFoundComponent } from '../../../page-not-found/page-not-found.component';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    MathjaxModule,
    AngularSvgIconModule,
    RatingComponent,
    ArticleTagsComponent,
    ArticleTitleComponent,
    ArticleContentComponent,
    CommentsComponent,
    PageNotFoundComponent,
    NgIf,
    NgForOf,
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleComponent implements OnInit, OnDestroy {
  public newArticle: CreateArticleInterface = {
    title: '',
    content: '',
    tagsIds: [],
  };

  public isAdmin = false;

  public isEditable = false;

  public article!: ArticleInterface;

  public finalRequest = false;

  public isRatingActive = false;

  public isSaveButtonDisable = false;

  private destroy$: Subject<void> = new Subject<void>();

  private articlesService = inject(ArticlesService);

  private route = inject(ActivatedRoute);

  private cdr = inject(ChangeDetectorRef);

  private tagsService = inject(TagsService);

  private router = inject(Router);

  private ratingService = inject(RatingService);

  private usersService = inject(UsersService);

  private dialogService = inject(DialogService);

  public ngOnInit(): void {
    this.initArticle();
    this.initUserRole();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initUserRole(): void {
    this.usersService.user$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user: UserInterface | null) => {
        this.isAdmin = !!user && user.isAdmin;
        this.cdr.detectChanges();
      },
    });
  }

  public initArticle(): void {
    this.finalRequest = false;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.articlesService
        .getArticle(id)
        .pipe(
          tap({
            next: (article: ArticleInterface) => {
              this.article = article;
              this.newArticle.title = article.title;
              this.newArticle.content = article.content;
              this.newArticle.tagsIds = this.article.tags.map(
                (tag: TagInterface) => tag.id,
              );
              // eslint-disable-next-line
              // @ts-ignore
              if (typeof window.MathJax.texReset === 'function') {
                // eslint-disable-next-line
                // @ts-ignore
                window.MathJax.texReset();
              }
            },
            error: (error: HttpErrorResponse) => {
              return throwError(() => error);
            },
          }),
          switchMap(() =>
            this.ratingService
              .getCurrentArticleStatus(id)
              .pipe(takeUntil(this.destroy$)),
          ),
        )
        .subscribe({
          next: (status: CurrentArticleStatusInterface) => {
            this.isRatingActive = status.canBeRated;
            this.finalRequest = true;
            this.cdr.detectChanges();
          },
          error: () => {
            this.isRatingActive = false;
            this.finalRequest = true;
            this.cdr.detectChanges();
          },
        });
    }
  }

  public searchArticle(tag: TagInterface): void {
    this.tagsService.tag$.next(tag);
    this.router.navigateByUrl('articles');
  }

  public updateRating(rating: RatingType): void {
    this.ratingService
      .updateArticleRating({ articleId: this.article.id, rate: rating })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value: CurrentArticleRatingInterface) => {
          this.article.rating = value.rating;
          this.article.votes = value.votes;
          this.isRatingActive = false;
          this.cdr.detectChanges();
        },
      });
  }

  public deleteArticle(): void {
    this.dialogService
      .openDialog(DialogTypeEnum.ConfirmDeleteArticle, {
        title: 'ПОВІДОМЛЕННЯ',
        text: '',
        user: undefined,
        tag: undefined,
        article: this.article,
      })
      .afterClosed()
      .subscribe({
        next: (id: string) => {
          if (id) {
            this.confirmDeleteArticle(id);
          }
        },
      });
  }

  public confirmDeleteArticle(id: string): void {
    this.articlesService
      .deleteArticle(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.dialogService.openDialog(DialogTypeEnum.Alert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Стаття видалена успішно.',
          });
          this.router.navigateByUrl('articles');
        },
        error: () => {
          this.dialogService.openDialog(DialogTypeEnum.Alert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Помилка видалення статті.',
          });
        },
      });
  }

  public editArticle(): void {
    this.isEditable = true;
  }

  public saveArticle(): void {
    this.articlesService
      .updateArticle(this.article.id, this.newArticle)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (article: ArticleInterface) => {
          this.article = article;
          this.dialogService.openDialog(DialogTypeEnum.Alert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Стаття оновлена успішно',
          });
          // eslint-disable-next-line
          // @ts-ignore
          if (typeof window.MathJax.texReset === 'function') {
            // eslint-disable-next-line
            // @ts-ignore
            window.MathJax.texReset();
          }
          this.isEditable = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.dialogService.openDialog(DialogTypeEnum.Alert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Помилка оновлення статті.',
          });
        },
      });
  }

  public cancelEdit(): void {
    this.isEditable = false;
  }

  public saveTagsIds(tagsIds: string[]): void {
    this.newArticle.tagsIds = tagsIds;
    this.isSaveButtonDisable =
      !this.newArticle.title ||
      !this.newArticle.content ||
      !this.newArticle.tagsIds.length;
  }

  public saveTitle(title: string): void {
    this.newArticle.title = title;
    this.isSaveButtonDisable =
      !this.newArticle.title ||
      !this.newArticle.content ||
      !this.newArticle.tagsIds.length;
  }

  public saveContent(content: string): void {
    this.newArticle.content = content;
    this.isSaveButtonDisable =
      !this.newArticle.title ||
      !this.newArticle.content ||
      !this.newArticle.tagsIds.length;
  }
}
