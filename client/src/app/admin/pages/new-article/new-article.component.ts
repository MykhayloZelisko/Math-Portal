import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { ArticleTagsComponent } from '../../../shared/components/article-tags/article-tags.component';
import { ArticleTitleComponent } from '../../../shared/components/article-title/article-title.component';
import { ArticleContentComponent } from '../../../shared/components/article-content/article-content.component';
import { CreateArticleInterface } from '../../../shared/models/interfaces/create-article.interface';
import { ArticlesService } from '../../../shared/services/articles.service';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from '../../../shared/services/dialog.service';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';
import { AlertComponent } from './components/alert/alert.component';

@Component({
  selector: 'app-new-article',
  standalone: true,
  imports: [
    ArticleTagsComponent,
    ArticleTitleComponent,
    ArticleContentComponent,
    AlertComponent,
  ],
  templateUrl: './new-article.component.html',
  styleUrl: './new-article.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewArticleComponent implements OnDestroy {
  public newArticle: CreateArticleInterface = {
    title: '',
    content: '',
    tagsIds: [],
  };

  public clearControl: { clear: boolean } = { clear: false };

  public isButtonDisable = true;

  private destroy$: Subject<void> = new Subject<void>();

  private articlesService = inject(ArticlesService);

  private dialogService = inject(DialogService);

  private cdr = inject(ChangeDetectorRef);

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public saveTitle(title: string): void {
    this.newArticle.title = title;
    this.isButtonDisable =
      !this.newArticle.title ||
      !this.newArticle.content ||
      !this.newArticle.tagsIds.length;
  }

  public saveContent(content: string): void {
    this.newArticle.content = content;
    this.isButtonDisable =
      !this.newArticle.title ||
      !this.newArticle.content ||
      !this.newArticle.tagsIds.length;
  }

  public saveTagsIds(tagsIds: string[]): void {
    this.newArticle.tagsIds = tagsIds;
    this.isButtonDisable =
      !this.newArticle.title ||
      !this.newArticle.content ||
      !this.newArticle.tagsIds.length;
  }

  public saveArticle(): void {
    this.articlesService
      .createArticle(this.newArticle)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.newArticle = {
            title: '',
            content: '',
            tagsIds: [],
          };
          this.clearControl = { clear: true };
          this.cdr.detectChanges();
          this.dialogService.openDialog(DialogTypeEnum.Alert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Статтю успішно збережено.',
          });
        },
        error: () => {
          this.dialogService.openDialog(DialogTypeEnum.Alert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Помилка збереження статті. Повторіть спробу пізніше.',
          });
        },
      });
  }
}
