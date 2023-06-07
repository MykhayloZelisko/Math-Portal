import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';

export enum DialogTypeEnum {
  ConflictRegistration,
  WrongCredentials,
}

export interface DialogDataInterface {
  dialogType: DialogTypeEnum;
  data: DialogContentInterface;
}

export interface DialogContentInterface {
  title?: string;
  text?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  public constructor(private dialog: MatDialog) {}

  public openDialog(
    dialogType: DialogTypeEnum,
    dialogContent: DialogContentInterface = {
      title: '',
      text: '',
    },
  ) {
    const dialogData: DialogDataInterface = {
      dialogType: dialogType,
      data: dialogContent,
    };

    return this.dialog.open(DialogComponent, {
      position: { top: '50px' },
      data: dialogData,
      autoFocus: false,
    });
  }
}
