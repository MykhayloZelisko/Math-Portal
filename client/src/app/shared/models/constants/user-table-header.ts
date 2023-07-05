import { TableHeaderInterface } from '../interfaces/table-header.interface';
import { UsersTableColumnNameEnum } from '../enums/users-table-column-name.enum';

export const USERS_TABLE_HEADER: TableHeaderInterface[] = [
  {
    title: `Ім'я користувача`,
    columnName: UsersTableColumnNameEnum.UserName,
    headerContentPosition: 'flex-start',
    tableContentPosition: 'start',
    isSortable: true,
    sorting: 'default',
  },
  {
    title: 'Електронна пошта',
    columnName: UsersTableColumnNameEnum.Email,
    headerContentPosition: 'flex-start',
    tableContentPosition: 'start',
    isSortable: false,
    sorting: 'none',
  },
  {
    title: 'Роль',
    columnName: UsersTableColumnNameEnum.Role,
    headerContentPosition: 'center',
    tableContentPosition: 'center',
    isSortable: true,
    sorting: 'default',
  },
  {
    title: '',
    columnName: UsersTableColumnNameEnum.Buttons,
    headerContentPosition: 'flex-end',
    tableContentPosition: 'end',
    isSortable: false,
    sorting: 'none',
  },
];
