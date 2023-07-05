import { TableContentPositionType } from '../types/table-content-position.type';
import { SortingType } from '../types/sorting.type';
import { HeaderContentPositionType } from '../types/header-content-position.type';
import { UsersTableColumnNameEnum } from '../enums/users-table-column-name.enum';

export interface TableHeaderInterface {
  title: string;
  columnName: UsersTableColumnNameEnum;
  headerContentPosition: HeaderContentPositionType;
  tableContentPosition: TableContentPositionType;
  isSortable: boolean;
  sorting: SortingType;
}
