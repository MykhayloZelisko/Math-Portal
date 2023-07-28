import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsTreeInterface } from '../../../../../../../shared/models/interfaces/comments-tree.interface';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NewCommentComponent } from '../new-comment/new-comment.component';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';

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

  public isVisibleNewComment: boolean = false;

  public toggleComment(): void {
    this.isVisibleNewComment = !this.isVisibleNewComment;
  }
}
