import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesService } from '../../../../../shared/services/articles.service';
import { ArticleInterface } from '../../../../../shared/models/interfaces/article.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
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

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, MathjaxModule, AngularSvgIconModule, RatingComponent],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleComponent implements OnInit, OnDestroy {
  public isAdmin: boolean = false;

  public article!: ArticleInterface;

  public isRatingActive: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private tagsService: TagsService,
    private router: Router,
    private ratingService: RatingService,
    private usersService: UsersService,
  ) {}

  public ngOnInit(): void {
    this.initArticle();
    this.initUserRole();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initUserRole(): void {
    // const user = this.usersService.user$.getValue();
    // this.isAdmin = !!user && user.isAdmin;
    this.usersService.user$.subscribe({
      next: (user: UserInterface | null) => {
        this.isAdmin = !!user && user.isAdmin;
        this.cdr.detectChanges();
      },
    });
  }

  private initArticle(): void {
    const stringId = this.route.snapshot.paramMap.get('id');
    if (stringId) {
      const id = parseInt(stringId);
      this.articlesService
        .getArticle(id)
        .pipe(
          tap((article: ArticleInterface) => {
            this.article = article;
          }),
          switchMap(() =>
            this.ratingService
              .getCurrentArticleStatus(id)
              .pipe(takeUntil(this.destroy$)),
          ),
        )
        .subscribe({
          next: (status) => {
            this.isRatingActive = status.canBeRated;
            this.cdr.detectChanges();
          },
          error: () => {
            this.isRatingActive = false;
            this.cdr.detectChanges();
          },
        });
    }
  }

  public searchArticle(tag: TagInterface) {
    this.tagsService.tag$.next(tag);
    this.router.navigateByUrl('articles');
  }

  public updateRating(rating: RatingType) {
    this.ratingService
      .updateArticleRating(this.article.id, rating)
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
}
