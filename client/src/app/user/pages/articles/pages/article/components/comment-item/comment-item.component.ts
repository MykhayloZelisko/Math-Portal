import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NewCommentComponent } from '../new-comment/new-comment.component';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';
import { CommentsService } from '../../../../../../../shared/services/comments.service';
import { map, Subject, takeUntil } from 'rxjs';
import { CommentInterface } from '../../../../../../../shared/models/interfaces/comment.interface';
import { RouterLink } from '@angular/router';
import { ClickOutsideDirective } from '../../../../../../../shared/directives/click-outside.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommentWithLevelInterface } from '../../../../../../../shared/models/interfaces/comment-with-level.interface';
import { CommentsListParamsInterface } from '../../../../../../../shared/models/interfaces/comments-list-params.interface';
import { CommentsListInterface } from '../../../../../../../shared/models/interfaces/comments-list.interface';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    NewCommentComponent,
    RouterLink,
    ClickOutsideDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentItemComponent implements OnInit, OnDestroy {
  @Input() public comment!: CommentWithLevelInterface;

  @Input() public user: UserInterface | null = null;

  @Input() public articleId: string = '';

  @Output() public removeComment: EventEmitter<string> =
    new EventEmitter<string>();

  public isVisibleNewComment: boolean = false;

  public isActiveDropDown: boolean = false;

  public isCommentEditable: boolean = false;

  public commentCtrl: FormControl = new FormControl('');

  public isVisibleChildren: boolean = false;

  public commentsList: CommentWithLevelInterface[] = [];

  public commentsRest: number = 0;

  public total: number = 0;

  public isButtonVisible: boolean = false;

  public paginationParams: CommentsListParamsInterface = {
    page: 1,
    size: 10,
  };

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private commentsService: CommentsService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.initChildrenList(this.paginationParams);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initChildrenList(params: CommentsListParamsInterface): void {
    this.isButtonVisible = false;
    this.commentsService
      .getCommentsListByCommentId(this.comment.id, params)
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
    this.initChildrenList(this.paginationParams);
  }

  public toggleNewComment(): void {
    this.isVisibleNewComment = !this.isVisibleNewComment;
  }

  public addComment(): void {
    this.refreshComments();
    this.toggleNewComment();
  }

  public refreshComments(): void {
    this.commentsList = [];
    this.paginationParams = {
      page: 1,
      size: 10,
    };
    this.initChildrenList(this.paginationParams);
  }

  public likeComment(status: -1 | 1): void {
    this.commentsService
      .updateCommentLikesDislikes(this.comment.id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comment: CommentInterface) => {
          this.comment.likesUsersIds = comment.likesUsersIds;
          this.comment.dislikesUsersIds = comment.dislikesUsersIds;
          this.cdr.detectChanges();
        },
      });
  }

  public openDropDown(): void {
    this.isActiveDropDown = !this.isActiveDropDown;
  }

  public closeDropDown(): void {
    this.isActiveDropDown = false;
  }

  public editComment(): void {
    this.closeDropDown();
    this.isCommentEditable = true;
    this.commentCtrl.setValue(this.comment.content);
  }

  public cancelEditComment(): void {
    this.isCommentEditable = false;
  }

  public saveComment(): void {
    const content = this.commentCtrl.getRawValue();
    this.commentsService
      .updateComment(this.comment.id, content)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comment: CommentInterface) => {
          this.comment.content = comment.content;
          this.comment.updatedAt = comment.updatedAt;
          this.isCommentEditable = false;
          this.cdr.detectChanges();
        },
      });
  }

  public deleteComment(): void {
    this.removeComment.emit(this.comment.id);
  }

  public confirmRemove(id: string): void {
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

  public toggleChildrenComments(): void {
    this.isVisibleChildren = !this.isVisibleChildren;
  }
}
