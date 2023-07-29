import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ArticleComponent } from '../pages/articles/pages/article/article.component';
import { DialogService } from '../../shared/services/dialog.service';
import { DialogTypeEnum } from '../../shared/models/enums/dialog-type.enum';
import { TagInterface } from '../../shared/models/interfaces/tag.interface';
import { CreateArticleInterface } from '../../shared/models/interfaces/create-article.interface';

@Injectable({
  providedIn: 'root'
})
export class EditArticleGuard implements CanDeactivate<ArticleComponent> {
  public constructor(private dialogService: DialogService) {}

  public canDeactivate(component: ArticleComponent): Observable<boolean> {
    if (!component.isEditable) {
      return of(true);
    }
    const newArticle: CreateArticleInterface = {
      title: component.article.title,
      content: component.article.content,
      tagsIds: component.article.tags.map(
        (tag: TagInterface) => tag.id,
      ),
    };
    let isTagsIdsEqual = true;
    if (component.newArticle.tagsIds.length !== newArticle.tagsIds.length) {
      isTagsIdsEqual = false;
    } else {
      const newSetIds: Set<number> = new Set<number>(component.newArticle.tagsIds);
      const difference: Set<number> = new Set<number>(newArticle.tagsIds.filter((x) => !newSetIds.has(x)));
      isTagsIdsEqual = !difference.size;
    };
    if (
      newArticle.title !== component.newArticle.title || newArticle.content !== component.newArticle.content || !isTagsIdsEqual
    ) {
      return this.dialogService
        .openDialog(DialogTypeEnum.ConfirmRedirect, {
          title: 'ПОВІДОМЛЕННЯ',
          text: 'Ви покидаєте сторінку. Всі незбережені дані будуть втрачені.',
        })
        .afterClosed();
    } else {
      return of(true);
    }
  }
}
