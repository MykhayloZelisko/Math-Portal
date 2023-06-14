import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProfileComponent } from '../../user/pages/profile/profile.component';
import { DialogService } from '../../shared/services/dialog.service';
import { DialogTypeEnum } from '../../shared/models/enums/dialog-type.enum';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanDeactivate<ProfileComponent> {
  public constructor(private dialogService: DialogService) {
  }
  public canDeactivate(
    component: ProfileComponent
  ): Observable<boolean> {
    if (component.profileForm.valid) {
      return this.dialogService.openDialog(DialogTypeEnum.ConfirmRedirect, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Ви покидаєте сторінку. Всі незбережені дані будуть втрачені.',
      }).afterClosed();
    } else {
      return of(true);
    }
  }
}
