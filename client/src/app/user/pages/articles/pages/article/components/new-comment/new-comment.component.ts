import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommentItemComponent } from '../comment-item/comment-item.component';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommentsTreeInterface } from '../../../../../../../shared/models/interfaces/comments-tree.interface';
import { Subject, takeUntil } from 'rxjs';
import { CommentsService } from '../../../../../../../shared/services/comments.service';
import { CommentInterface } from '../../../../../../../shared/models/interfaces/comment.interface';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-new-comment',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    forwardRef(() => CommentItemComponent),
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCommentComponent {
  @Input() public user: UserInterface | null = null;

  @Input() public comment!: CommentsTreeInterface;

  @Input() public articleId: string = '';

  @Output() public addComment: EventEmitter<CommentsTreeInterface> =
    new EventEmitter<CommentsTreeInterface>();

  public commentCtrl: FormControl = new FormControl('');

  public newComment!: CommentsTreeInterface;

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private commentsService: CommentsService,
    private cdr: ChangeDetectorRef,
  ) {}

  public sendComment(): void {
    if (!this.commentCtrl.getRawValue()) {
      return;
    }
    const commentData = {
      content: this.commentCtrl.getRawValue(),
      articleId: this.articleId,
      parentCommentId: this.comment ? this.comment.id : null,
      level: this.comment ? this.comment.level + 1 : 1,
    };
    this.commentsService
      .createComment(commentData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comment: CommentInterface) => {
          this.newComment = {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            level: commentData.level,
            nearestAncestorId: commentData.parentCommentId,
            likesUsersIds: comment.likesUsersIds,
            dislikesUsersIds: comment.dislikesUsersIds,
            user: {
              ...comment.user,
              photo: comment.user.photo
                ? `${environment.apiUrl}/${comment.user.photo}`
                : null,
            },
            children: [],
          };
          this.addComment.emit(this.newComment);
          this.commentCtrl.setValue('');
          this.cdr.detectChanges();
        },
      });
  }
}
