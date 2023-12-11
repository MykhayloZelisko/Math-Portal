import { CanDeactivateFn } from '@angular/router';
import { ProfileComponent } from '../pages/profile/profile.component';
import { of } from 'rxjs';
import { inject } from '@angular/core';
import { DialogService } from '../../shared/services/dialog.service';
import { DialogTypeEnum } from '../../shared/models/enums/dialog-type.enum';

export const profileGuard: CanDeactivateFn<ProfileComponent> = (component: ProfileComponent) => {
  const dialogService = inject(DialogService);
  if (
    component.profileForm.valid &&
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
