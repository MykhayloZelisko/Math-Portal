import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
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
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommentItemComponent,
    AngularSvgIconModule,
    NewCommentComponent,
    NgForOf,
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent implements OnInit {
  @Input() public articleId: string = '';

  public user: UserInterface | null = null;

  public commentsTree: CommentsTreeInterface[] = [];

  private destroy$: Subject<void> = new Subject<void>();

  private commentsService = inject(CommentsService);

  private usersService = inject(UsersService);

  private cdr = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.initComments();
    this.getUser();
  }

  public initComments(): void {
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

  public getUser(): void {
    this.usersService.user$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user: UserInterface | null) => {
        this.user = user;
        this.cdr.detectChanges();
      },
    });
  }

  public addComment(comment: CommentsTreeInterface): void {
    this.commentsTree = [...this.commentsTree, comment];
  }

  public deleteComment(id: string): void {
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
