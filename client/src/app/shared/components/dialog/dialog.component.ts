import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DialogTypeEnum } from '../../models/enums/dialog-type.enum';
import { DialogDataInterface } from '../../models/interfaces/dialog-data.interface';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, MatButtonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  public readonly DialogType = DialogTypeEnum;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogDataInterface,
    private dialogRef: MatDialogRef<DialogComponent>,
  ) {
    dialogRef.disableClose = true;
  }

  public close(): void {
    this.dialogRef.close();
  }
}
