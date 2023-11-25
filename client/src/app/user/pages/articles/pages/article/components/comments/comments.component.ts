import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsService } from '../../../../../../../shared/services/comments.service';
import { map, Subject, takeUntil } from 'rxjs';
import { CommentItemComponent } from '../comment-item/comment-item.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NewCommentComponent } from '../new-comment/new-comment.component';
import { UsersService } from '../../../../../../../shared/services/users.service';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';
import { CommentWithLevelInterface } from '../../../../../../../shared/models/interfaces/comment-with-level.interface';
import { CommentsListParamsInterface } from '../../../../../../../shared/models/interfaces/comments-list-params.interface';
import { CommentsListInterface } from '../../../../../../../shared/models/interfaces/comments-list.interface';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    CommentItemComponent,
    AngularSvgIconModule,
    NewCommentComponent,
  ],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent implements OnInit, OnDestroy {
  @Input() public articleId: string = '';

  public user: UserInterface | null = null;

  public commentsList: CommentWithLevelInterface[] = [];

  public commentsRest: number = 0;

  public isButtonVisible: boolean = false;

  public paginationParams: CommentsListParamsInterface = {
    page: 1,
    size: 10,
  };

  public total: number = 0;

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private commentsService: CommentsService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.initComments(this.paginationParams);
    this.getUser();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initComments(params: CommentsListParamsInterface): void {
    this.isButtonVisible = false;
    this.commentsService
      .getCommentsListByArticleId(this.articleId, params)
      .pipe(
        map((list: CommentsListInterface) => {
          return {
            total: list.total,
            comments: list.comments.map(
              (comment: CommentWithLevelInterface) => ({
                ...comment,
                user: {
                  ...comment.user,
                  photo: comment.user.photo
                    ? `${environment.apiUrl}/${comment.user.photo}`
                    : null,
                },
              }),
            ),
          };
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (list: CommentsListInterface) => {
          this.commentsList = [
            ...list.comments.reverse(),
            ...this.commentsList,
          ];
          this.isButtonVisible = list.total
            ? list.total !== this.commentsList.length
            : false;
          this.total = list.total;
          this.commentsRest =
            list.total - this.commentsList.length > 10
              ? 10
              : list.total - this.commentsList.length;
          this.cdr.detectChanges();
        },
      });
  }

  public loadMoreComments(): void {
    this.paginationParams = {
      ...this.paginationParams,
      page: this.paginationParams.page + 1,
    };
    this.initComments(this.paginationParams);
  }

  public getUser(): void {
    this.usersService.user$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user: UserInterface | null) => {
        this.user = user;
        this.cdr.detectChanges();
      },
    });
  }

  public refreshComments(): void {
    this.commentsList = [];
    this.paginationParams = {
      page: 1,
      size: 10,
    };
    this.initComments(this.paginationParams);
  }

  public deleteComment(id: string): void {
    this.commentsService
      .deleteComment(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.refreshComments();
          this.cdr.detectChanges();
        },
      });
  }
}
