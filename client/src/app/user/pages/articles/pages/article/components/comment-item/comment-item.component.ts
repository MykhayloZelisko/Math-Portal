import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { CommentsTreeInterface } from '../../../../../../../shared/models/interfaces/comments-tree.interface';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NewCommentComponent } from '../new-comment/new-comment.component';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';
import { CommentsService } from '../../../../../../../shared/services/comments.service';
import { Subject, takeUntil } from 'rxjs';
import { CommentInterface } from '../../../../../../../shared/models/interfaces/comment.interface';
import { RouterLink } from '@angular/router';
import { ClickOutsideDirective } from '../../../../../../../shared/directives/click-outside.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [
    AngularSvgIconModule,
    NewCommentComponent,
    RouterLink,
    ClickOutsideDirective,
    ReactiveFormsModule,
    NgIf,
    DatePipe,
    NgForOf,
  ],
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentItemComponent implements OnDestroy {
  @Input() public comment!: CommentsTreeInterface;

  @Input() public user: UserInterface | null = null;

  @Input() public articleId: string = '';

  @Output() public removeComment: EventEmitter<string> =
    new EventEmitter<string>();

  public isVisibleNewComment: boolean = false;

  public isActiveDropDown: boolean = false;

  public isCommentEditable: boolean = false;

  public commentCtrl: FormControl = new FormControl('');

  private destroy$: Subject<void> = new Subject<void>();

  private commentsService = inject(CommentsService);

  private cdr = inject(ChangeDetectorRef);

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public toggleComment(): void {
    this.isVisibleNewComment = !this.isVisibleNewComment;
  }

  public addComment(comment: CommentsTreeInterface): void {
    this.comment.children = [...this.comment.children, comment];
    this.toggleComment();
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
          this.comment.children = this.comment.children.filter(
            (comment: CommentsTreeInterface) => comment.id !== id,
          );
          this.cdr.detectChanges();
        },
      });
  }
}
