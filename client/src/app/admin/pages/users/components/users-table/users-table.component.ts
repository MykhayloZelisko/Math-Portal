import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { TableHeaderInterface } from '../../../../../shared/models/interfaces/table-header.interface';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { UsersTableInterface } from '../../../../../shared/models/interfaces/users-table.interface';
import { SortingType } from '../../../../../shared/models/types/sorting.type';
import { USERS_TABLE_HEADER } from '../../../../../shared/models/constants/user-table-header';
import { TableContentPositionType } from '../../../../../shared/models/types/table-content-position.type';
import { HeaderContentPositionType } from '../../../../../shared/models/types/header-content-position.type';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginatorConfigInterface } from '../../../../../shared/models/interfaces/paginator-config.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsersTableColumnNameEnum } from '../../../../../shared/models/enums/users-table-column-name.enum';
import { SortColumnInterface } from '../../../../../shared/models/interfaces/sort-column.interface';
import { UserInterface } from '../../../../../shared/models/interfaces/user.interface';
import { UpdateUserRoleInterface } from '../../../../../shared/models/interfaces/update-user-role.interface';
import { DropdownModule } from 'primeng/dropdown';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    AngularSvgIconModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    DropdownModule,
    NgIf,
    NgForOf,
    NgStyle,
    NgClass,
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersTableComponent implements OnInit, OnChanges {
  @Input()
  public tableContent!: UsersTableInterface;

  @Input()
  public paginatorConfig!: PaginatorConfigInterface;

  @Input() public clearCurrentPageField = false;

  @Output()
  public changePaginatorConfig: EventEmitter<PaginatorConfigInterface> =
    new EventEmitter<PaginatorConfigInterface>();

  @Output()
  public updateRole: EventEmitter<UpdateUserRoleInterface> =
    new EventEmitter<UpdateUserRoleInterface>();

  @Output()
  public sortColumn: EventEmitter<SortColumnInterface> =
    new EventEmitter<SortColumnInterface>();

  @Output()
  public removeUser: EventEmitter<UserInterface> =
    new EventEmitter<UserInterface>();

  @Output()
  public clearPageControl: EventEmitter<boolean> = new EventEmitter<boolean>();

  public sortParams: { [key: string]: SortingType } = {};

  public isPaginatorInit = false;

  public rowsPerPage: number[] = [10, 20, 50, 100];

  public pageArray: number[] = [1];

  public usersTableHeader: TableHeaderInterface[] = USERS_TABLE_HEADER;

  private fb = inject(FormBuilder);

  public paginationForm: FormGroup = this.fb.group({
    pageSize: [this.rowsPerPage[0]],
    currentPage: [1],
  });

  private cdr = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.initSortParams();
  }

  public ngOnChanges(): void {
    if (this.tableContent && !this.isPaginatorInit) {
      this.initPaginator();
    }
    if (this.clearCurrentPageField) {
      this.paginationForm.controls['currentPage'].setValue(1);
      this.clearPageControl.emit(false);
      this.initSortParams();
    }
  }

  public onSortColumn(columnName: UsersTableColumnNameEnum): void {
    switch (this.sortParams[columnName]) {
      case 'default':
        this.sortParams[columnName] = 'asc';
        break;
      case 'asc':
        this.sortParams[columnName] = 'desc';
        break;
      case 'desc':
        this.sortParams[columnName] = 'default';
        break;
      default:
        break;
    }
    this.sortColumn.emit({
      columnName: columnName,
      sorting: this.sortParams[columnName],
    });
    this.paginationForm.controls['currentPage'].setValue(1);
  }

  public initSortParams(): void {
    this.usersTableHeader.forEach((headerItem: TableHeaderInterface) => {
      this.sortParams[headerItem.columnName] = headerItem.sorting;
    });
  }

  public getHeaderStyle(headerItem: TableHeaderInterface): {
    [key: string]: HeaderContentPositionType;
  } {
    return {
      'justify-content': headerItem.headerContentPosition,
    };
  }

  public getContentPosition(index: number): {
    [key: string]: TableContentPositionType;
  } {
    return {
      'text-align': this.usersTableHeader[index].tableContentPosition,
    };
  }

  public onPageChange(pageNumber: number): void {
    this.paginatorConfig = {
      ...this.paginatorConfig,
      currentPage: pageNumber,
    };
    this.paginationForm.controls['currentPage'].setValue(pageNumber);
    this.changePaginatorConfig.emit(this.paginatorConfig);
  }

  public initPaginator(): void {
    this.paginatorConfig = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.tableContent.total,
    };
    const arrayLength = Math.ceil(
      this.paginatorConfig.totalItems / this.paginatorConfig.itemsPerPage,
    );
    this.pageArray = [];
    for (let i = 1; i <= arrayLength; i++) {
      this.pageArray.push(i);
    }
    this.isPaginatorInit = true;
    this.cdr.detectChanges();
  }

  public updatePageSize(): void {
    const itemsPerPage = this.paginationForm.controls['pageSize'].value;
    this.paginatorConfig = {
      ...this.paginatorConfig,
      currentPage: 1,
      itemsPerPage,
    };
    this.paginationForm.controls['currentPage'].setValue(1);
    const arrayLength = Math.ceil(
      this.paginatorConfig.totalItems / this.paginatorConfig.itemsPerPage,
    );
    this.pageArray = [];
    for (let i = 1; i <= arrayLength; i++) {
      this.pageArray.push(i);
    }
    this.changePaginatorConfig.emit(this.paginatorConfig);
  }

  public updateCurrentPage(): void {
    const currentPage = this.paginationForm.controls['currentPage'].value;
    this.paginatorConfig = {
      ...this.paginatorConfig,
      currentPage,
    };
    this.changePaginatorConfig.emit(this.paginatorConfig);
  }

  public updateUserRole(user: UserInterface): void {
    if (user.id) {
      this.updateRole.emit({ userId: user.id, isAdmin: !user.isAdmin });
    }
  }

  public deleteUser(user: UserInterface): void {
    this.removeUser.emit(user);
  }
}
