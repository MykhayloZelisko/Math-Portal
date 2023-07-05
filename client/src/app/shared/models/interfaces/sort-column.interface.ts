import { UsersTableColumnNameEnum } from '../enums/users-table-column-name.enum';
import { SortingType } from '../types/sorting.type';

export interface SortColumnInterface {
  columnName: UsersTableColumnNameEnum;
  sorting: SortingType;
}
