import { DialogTypeEnum } from '../enums/dialog-type.enum';
import { DialogContentInterface } from './dialog-content.interface';

export interface DialogDataInterface {
  dialogType: DialogTypeEnum;
  data: DialogContentInterface;
}
