import { SolvingLinearSystemEnum } from '../enums/solving-linear-system.enum';

export interface SolvingLinearSystemInterface {
  title: string;
  method: SolvingLinearSystemEnum;
  disable: boolean;
}
