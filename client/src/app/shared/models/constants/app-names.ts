import { AppNameEnum } from '../enums/app-name.enum';
import { AppNameInterface } from '../interfaces/app-name.interface';

export const APP_NAMES: AppNameInterface[] = [
  {
    title: `Розв'язування трикутників`,
    value: AppNameEnum.SolvingTriangle,
  },
  {
    title: 'Системи лінійних алгебраїчних рівнянь',
    value: AppNameEnum.SystemLinearEquations,
  },
];
