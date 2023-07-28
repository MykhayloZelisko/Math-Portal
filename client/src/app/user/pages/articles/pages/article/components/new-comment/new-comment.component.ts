import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommentItemComponent } from '../comment-item/comment-item.component';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-comment',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    CommentItemComponent,
    RouterLink,
  ],
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCommentComponent {
  @Input() public user: UserInterface | null = null;
}
