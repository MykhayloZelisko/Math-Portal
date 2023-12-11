import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { ArticleComponent } from '../pages/articles/pages/article/article.component';
import { DialogService } from '../../shared/services/dialog.service';
import { DialogTypeEnum } from '../../shared/models/enums/dialog-type.enum';
import { TagInterface } from '../../shared/models/interfaces/tag.interface';
import { CreateArticleInterface } from '../../shared/models/interfaces/create-article.interface';

export const editArticleGuard: CanDeactivateFn<ArticleComponent> = (
  component: ArticleComponent,
) => {
  const dialogService = inject(DialogService);
  if (!component.isEditable) {
    return of(true);
  }
  const newArticle: CreateArticleInterface = {
    title: component.article.title,
    content: component.article.content,
    tagsIds: component.article.tags.map((tag: TagInterface) => tag.id),
  };
  let isTagsIdsEqual;
  if (component.newArticle.tagsIds.length !== newArticle.tagsIds.length) {
    isTagsIdsEqual = false;
  } else {
    const newSetIds: Set<string> = new Set<string>(
      component.newArticle.tagsIds,
    );
    const difference: Set<string> = new Set<string>(
      newArticle.tagsIds.filter((x) => !newSetIds.has(x)),
    );
    isTagsIdsEqual = !difference.size;
  }
  if (
    (newArticle.title !== component.newArticle.title ||
      newArticle.content !== component.newArticle.content ||
      !isTagsIdsEqual) &&
    sessionStorage.getItem('exp') &&
    +JSON.parse(sessionStorage.getItem('exp') as string) * 1000 > Date.now()
  ) {
    return dialogService
      .openDialog(DialogTypeEnum.ConfirmRedirect, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Ви покидаєте сторінку. Всі незбережені дані будуть втрачені.',
      })
      .afterClosed();
  } else {
    return of(true);
  }
};
