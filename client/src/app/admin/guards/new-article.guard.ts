import { CanDeactivateFn } from '@angular/router';
import { of } from 'rxjs';
import { NewArticleComponent } from '../pages/new-article/new-article.component';
import { DialogTypeEnum } from '../../shared/models/enums/dialog-type.enum';
import { DialogService } from '../../shared/services/dialog.service';
import { inject } from '@angular/core';

export const newArticleGuard: CanDeactivateFn<NewArticleComponent> = (component: NewArticleComponent) => {
  const dialogService = inject(DialogService);
  if (
    (component.newArticle.title ||
      component.newArticle.content ||
      component.newArticle.tagsIds.length) &&
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
}
