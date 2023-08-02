import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsService } from '../../../../../../../shared/services/comments.service';
import { map, Subject, takeUntil } from 'rxjs';
import { CommentWithDescendantsInterface } from '../../../../../../../shared/models/interfaces/comment-with-descendants.interface';
import { CommentsTreeInterface } from '../../../../../../../shared/models/interfaces/comments-tree.interface';
import { commentsListMapper } from '../../../../../../../shared/utils/comments-list-mapper';
import { CommentItemComponent } from '../comment-item/comment-item.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NewCommentComponent } from '../new-comment/new-comment.component';
import { UsersService } from '../../../../../../../shared/services/users.service';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';

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
export class CommentsComponent implements OnInit {
  @Input() public articleId: number = 0;

  public user: UserInterface | null = null;

  public commentsTree: CommentsTreeInterface[] = [];

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private commentsService: CommentsService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this.initComments();
    this.getUser();
  }

  private initComments(): void {
    this.commentsService
      .getCommentsList(this.articleId)
      .pipe(
        map((list: CommentWithDescendantsInterface[]) =>
          commentsListMapper(list),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (tree: CommentsTreeInterface[]) => {
          this.commentsTree = tree;
          this.cdr.detectChanges();
        },
      });
  }

  private getUser(): void {
    this.usersService.user$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user: UserInterface | null) => {
        this.user = user;
        this.cdr.detectChanges();
      },
    });
  }

  public addComment(comment: CommentsTreeInterface) {
    this.commentsTree = [...this.commentsTree, comment];
  }

  public deleteComment(id: number) {
    this.commentsService
      .deleteComment(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.commentsTree = this.commentsTree.filter(
            (comment: CommentsTreeInterface) => comment.id !== id,
          );
          this.cdr.detectChanges();
        },
      });
  }
}
