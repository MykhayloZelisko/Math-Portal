import { SolvingLinearSystemInterface } from '../interfaces/solving-linear-system.interface';
import { SolvingLinearSystemEnum } from '../enums/solving-linear-system.enum';

export const SOLVING_LINEAR_SYSTEM: SolvingLinearSystemInterface[] = [
  {
    title: 'Метод Гауса',
    method: SolvingLinearSystemEnum.Gauss,
    disable: false,
  },
  {
    title: 'Метод Крамера',
    method: SolvingLinearSystemEnum.Cramer,
    disable: false,
  },
  {
    title: 'Матричний метод',
    method: SolvingLinearSystemEnum.Inverse,
    disable: false,
  },
];
