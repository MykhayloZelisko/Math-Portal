import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';
import { DialogContentInterface } from '../models/interfaces/dialog-content.interface';
import { DialogDataInterface } from '../models/interfaces/dialog-data.interface';
import { DialogTypeEnum } from '../models/enums/dialog-type.enum';

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
