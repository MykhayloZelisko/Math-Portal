import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsTreeInterface } from '../../../../../../../shared/models/interfaces/comments-tree.interface';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NewCommentComponent } from '../new-comment/new-comment.component';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';
import { CommentsService } from '../../../../../../../shared/services/comments.service';
import { Subject, takeUntil } from 'rxjs';
import { CommentInterface } from '../../../../../../../shared/models/interfaces/comment.interface';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [CommonModule, AngularSvgIconModule, NewCommentComponent],
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentItemComponent {
  @Input() public comment!: CommentsTreeInterface;

  @Input() public user: UserInterface | null = null;

  @Input() public articleId: number = 0;

  public isVisibleNewComment: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(private commentsService: CommentsService, private cdr: ChangeDetectorRef) {}

  public toggleComment(): void {
    this.isVisibleNewComment = !this.isVisibleNewComment;
  }

  public addComment(comment: CommentsTreeInterface) {
    this.comment.children = [...this.comment.children, comment];
    this.toggleComment();
  }

  public likeComment(status: -1 | 1): void {
    this.commentsService.updateCommentLikesDislikes(this.comment.id, status).pipe(takeUntil(this.destroy$)).subscribe({
      next: (comment: CommentInterface) => {
        this.comment.likesUsersIds = comment.likesUsersIds;
        this.comment.dislikesUsersIds = comment.dislikesUsersIds;
        console.log(comment);
        this.cdr.detectChanges();
      }
    });
  }
}
