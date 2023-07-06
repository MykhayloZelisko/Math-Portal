import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersFilterComponent } from './components/users-filter/users-filter.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { Subject, takeUntil } from 'rxjs';
import { UsersService } from '../../../shared/services/users.service';
import { UsersTableParamsInterface } from '../../../shared/models/interfaces/users-table-params.interface';
import { UsersTableInterface } from '../../../shared/models/interfaces/users-table.interface';
import { PaginatorConfigInterface } from '../../../shared/models/interfaces/paginator-config.interface';
import { SortColumnInterface } from '../../../shared/models/interfaces/sort-column.interface';
import { UsersTableColumnNameEnum } from '../../../shared/models/enums/users-table-column-name.enum';
import { UpdateUserRoleInterface } from '../../../shared/models/interfaces/update-user-role.interface';
import { UserWithNullTokenInterface } from '../../../shared/models/interfaces/user-with-null-token.interface';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { Router } from '@angular/router';
import { DialogService } from '../../../shared/services/dialog.service';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UsersFilterComponent, UsersTableComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit, OnDestroy {
  public usersTable!: UsersTableInterface;

  public filterParams: UsersTableParamsInterface = {
    sortByName: 'default',
    sortByRole: 'default',
    page: 1,
    size: 10,
    filter: '',
  };

  public paginatorConfig!: PaginatorConfigInterface;

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialogService: DialogService,
  ) {}

  public ngOnInit(): void {
    this.initUsersTable(this.filterParams);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initUsersTable(params: UsersTableParamsInterface): void {
    this.usersService
      .getUsersList(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe((table: UsersTableInterface) => {
        this.usersTable = table;
        this.paginatorConfig = {
          itemsPerPage: this.filterParams.size,
          currentPage: this.filterParams.page,
          totalItems: table.total,
        };
        this.cdr.detectChanges();
      });
  }

  public onChangePaginatorConfig(event: PaginatorConfigInterface) {
    this.paginatorConfig = event;
    this.filterParams = {
      ...this.filterParams,
      page: event.currentPage,
      size: event.itemsPerPage,
    };
    this.initUsersTable(this.filterParams);
  }

  public onSortColumn(event: SortColumnInterface) {
    this.filterParams = {
      ...this.filterParams,
      page: 1,
    };
    if (event.columnName === UsersTableColumnNameEnum.Role) {
      this.filterParams.sortByRole = event.sorting;
    }
    if (event.columnName === UsersTableColumnNameEnum.UserName) {
      this.filterParams.sortByName = event.sorting;
    }
    this.initUsersTable(this.filterParams);
  }

  private updateUserRole(event: UpdateUserRoleInterface): void {
    this.usersService
      .updateUserRole(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: UserWithNullTokenInterface) => {
          if (user.token) {
            this.usersService.updateUserData(user.user);
            sessionStorage.setItem(
              'token',
              JSON.stringify(`Bearer ${user.token.token}`),
            );
            this.router.navigateByUrl('');
          } else {
            const users = this.usersTable.users.map((item: UserInterface) =>
              user.user.id === item.id ? user.user : item,
            );
            this.usersTable = { ...this.usersTable, users };
          }
          this.cdr.detectChanges();
        },
      });
  }

  public confirmDelete(user: UserInterface): void {
    const currentUser = this.usersService.user$.getValue();
    if (currentUser && user.id === currentUser.id) {
      this.dialogService
        .openDialog(DialogTypeEnum.ConfirmDeleteProfile, {
          title: 'ПОВІДОМЛЕННЯ',
          text: 'Ви впевнені, що хочете видалити свій профіль?',
        })
        .afterClosed()
        .subscribe({
          next: (value) => {
            if (value && currentUser.id) {
              this.deleteUser(currentUser.id);
            }
          },
        });
    } else {
      this.dialogService
        .openDialog(DialogTypeEnum.ConfirmDeleteOtherUser, {
          title: 'ПОВІДОМЛЕННЯ',
          text: '',
          user: user,
        })
        .afterClosed()
        .subscribe({
          next: (userId) => {
            if (userId) {
              this.deleteUser(userId);
            }
          },
        });
    }
  }

  private deleteUser(id: number) {
    const currentUser = this.usersService.user$.getValue();
    this.usersService
      .deleteUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (currentUser && id === currentUser.id) {
            this.dialogService.openDialog(DialogTypeEnum.Alert, {
              title: 'ПОВІДОМЛЕННЯ',
              text: 'Профіль успішно видалено.',
            });
            this.router.navigateByUrl('');
            sessionStorage.removeItem('token');
            this.usersService.updateUserData(null);
          } else {
            this.initUsersTable(this.filterParams);
          }
        },
      });
  }

  public confirmUpdateUserRole(event: UpdateUserRoleInterface) {
    const currentUser = this.usersService.user$.getValue();
    if (currentUser && currentUser.id === event.userId) {
      this.dialogService
        .openDialog(DialogTypeEnum.ConfirmUpdateCurrentUserRole, {
          title: 'ПОВІДОМЛЕННЯ',
          text: 'Ви понижуєте себе до звичайного користувача. Бажаєте продовжити?',
        })
        .afterClosed()
        .subscribe({
          next: (value) => {
            if (value) {
              this.updateUserRole(event);
            }
          },
        });
    } else {
      this.updateUserRole(event);
    }
  }
}
