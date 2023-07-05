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
}
