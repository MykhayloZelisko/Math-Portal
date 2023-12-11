import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
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
  imports: [
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    NgIf,
    NgSwitch,
    NgSwitchCase,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  public readonly DialogType = DialogTypeEnum;

  public data: DialogDataInterface = inject(MAT_DIALOG_DATA);

  private dialogRef = inject(MatDialogRef<DialogComponent>);

  public close(): void {
    this.dialogRef.close();
  }
}
