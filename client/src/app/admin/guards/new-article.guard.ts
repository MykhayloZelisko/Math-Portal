import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NewArticleComponent } from '../pages/new-article/new-article.component';
import { DialogTypeEnum } from '../../shared/models/enums/dialog-type.enum';
import { DialogService } from '../../shared/services/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class NewArticleGuard implements CanDeactivate<NewArticleComponent> {
  public constructor(private dialogService: DialogService) {}

  public canDeactivate(component: NewArticleComponent): Observable<boolean> {
    if (
      (component.newArticle.title ||
        component.newArticle.content ||
        component.newArticle.tagsIds.length) &&
      sessionStorage.getItem('exp') &&
      +JSON.parse(sessionStorage.getItem('exp') as string) * 1000 > Date.now()
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
